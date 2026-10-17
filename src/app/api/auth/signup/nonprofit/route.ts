import { createNonprofitUser } from "@/lib/server/auth-service";
import { jsonError, jsonOk } from "@/lib/server/api";
import { notifyNonprofitSignup } from "@/lib/server/notifications";
import {
  deriveSignupErrorCode,
  logSignupAttempt,
  requestMeta,
} from "@/lib/server/signup-log-service";
import {
  createSession,
  setSessionCookie,
} from "@/lib/server/session";
import { clientIpFromRequest, verifyRecaptchaToken } from "@/lib/server/verify-recaptcha";
import type { NonprofitSignupApplication } from "@/types";

async function logFailed(
  meta: ReturnType<typeof requestMeta>,
  data: Partial<NonprofitSignupApplication> | null,
  message: string,
  code: string
) {
  await logSignupAttempt({
    ...meta,
    profileType: "nonprofit",
    status: "failed",
    email: data?.repEmail,
    onlineId: data?.onlineId,
    firstName: data?.repFirstName,
    lastName: data?.repLastName,
    orgName: data?.organizationLegalName,
    errorMessage: message,
    errorCode: code,
    source: "server",
  });
}

export async function POST(request: Request) {
  const meta = requestMeta(request);
  let data: NonprofitSignupApplication | null = null;

  try {
    const parsed = (await request.json()) as NonprofitSignupApplication & {
      recaptchaToken?: string;
    };
    const { recaptchaToken, ...signupFields } = parsed;
    data = signupFields;

    const captcha = await verifyRecaptchaToken(
      recaptchaToken,
      clientIpFromRequest(request)
    );
    if (!captcha.ok) {
      await logFailed(meta, data, captcha.error, "recaptcha_failed");
      return jsonError(captcha.error, 400);
    }

    if (!data.repEmail || !data.password || !data.organizationLegalName) {
      const message = "Missing required fields";
      await logFailed(meta, data, message, "missing_fields");
      return jsonError(message, 400);
    }

    const user = await createNonprofitUser(data);
    const token = await createSession(user.id);
    await setSessionCookie(token);

    notifyNonprofitSignup(user, data.organizationLegalName);

    await logSignupAttempt({
      ...meta,
      profileType: "nonprofit",
      status: "success",
      email: user.email,
      onlineId: user.onlineId,
      firstName: user.firstName,
      lastName: user.lastName,
      orgName: data.organizationLegalName,
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
    }

    await logFailed(meta, data, responseMessage, code);
    console.error("Nonprofit signup error:", err);
    return jsonError(responseMessage, status);
  }
}
