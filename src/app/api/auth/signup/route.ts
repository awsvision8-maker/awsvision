import { applicationToKYC } from "@/lib/application-to-kyc";
import { getAmbassadorByReferralCode } from "@/lib/server/ambassador-service";
import { createIndividualUser } from "@/lib/server/auth-service";
import { jsonError, jsonOk } from "@/lib/server/api";
import { notifySignup } from "@/lib/server/notifications";
import {
  deriveSignupErrorCode,
  logSignupAttempt,
  requestMeta,
} from "@/lib/server/signup-log-service";
import {
  createSession,
  setSessionCookie,
} from "@/lib/server/session";
import type { SignupApplication } from "@/types";

async function logFailed(
  meta: ReturnType<typeof requestMeta>,
  data: Partial<SignupApplication> | null,
  message: string,
  code: string,
  payloadKb?: number
) {
  await logSignupAttempt({
    ...meta,
    profileType: "individual",
    status: "failed",
    email: data?.email,
    onlineId: data?.onlineId,
    firstName: data?.firstName,
    lastName: data?.lastName,
    errorMessage: message,
    errorCode: code,
    payloadKb,
    source: "server",
  });
}

export async function POST(request: Request) {
  const meta = requestMeta(request);
  let data: SignupApplication | null = null;
  let payloadKb: number | undefined;

  try {
    const raw = await request.text();
    payloadKb = Math.round(raw.length / 1024);

    if (raw.length > 4_000_000) {
      const message = "Uploaded documents are too large. Please use smaller photos and try again.";
      await logFailed(meta, null, message, "payload_too_large", payloadKb);
      return jsonError(message, 413);
    }

    data = JSON.parse(raw) as SignupApplication;

    if (!data.email || !data.password || !data.firstName || !data.lastName) {
      const message = "Missing required fields";
      await logFailed(meta, data, message, "missing_fields", payloadKb);
      return jsonError(message, 400);
    }

    let ambassadorId: string | undefined;
    if (data.referralCode?.trim()) {
      const ambassador = await getAmbassadorByReferralCode(data.referralCode.trim());
      if (!ambassador) {
        const message =
          "Invalid referral code. Leave the field blank if you were not referred by a brand ambassador.";
        await logFailed(meta, data, message, "invalid_referral", payloadKb);
        return jsonError(message, 400);
      }
      ambassadorId = ambassador.id;
    }

    const user = await createIndividualUser(data, applicationToKYC(data), ambassadorId ?? null);
    const token = await createSession(user.id);
    await setSessionCookie(token);

    const accountLabel =
      data.accountType === "fixed_deposit"
        ? "Fixed Deposit"
        : data.accountType === "investment"
          ? "Investment"
          : "Savings";
    notifySignup(user, accountLabel);

    await logSignupAttempt({
      ...meta,
      profileType: "individual",
      status: "success",
      email: user.email,
      onlineId: user.onlineId,
      firstName: user.firstName,
      lastName: user.lastName,
      payloadKb,
      source: "server",
    });

    return jsonOk({ user });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Signup failed";
    let responseMessage = message;
    let status = 500;
    let code = deriveSignupErrorCode(message, status);

    if (message.includes("Unique constraint")) {
      responseMessage = "An account with this email or Online ID already exists";
      status = 409;
      code = "duplicate_account";
    } else if (message.includes("Online ID")) {
      status = 409;
      code = "duplicate_online_id";
    } else if (message.includes("JSON")) {
      responseMessage = "Invalid signup data";
      code = "invalid_payload";
    }

    await logFailed(meta, data, responseMessage, code, payloadKb);
    console.error("Signup error:", err);
    return jsonError(responseMessage, status);
  }
}
