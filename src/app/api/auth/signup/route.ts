import { applicationToKYC } from "@/lib/application-to-kyc";
import { getAmbassadorByReferralCode } from "@/lib/server/ambassador-service";
import { createIndividualUser } from "@/lib/server/auth-service";
import { jsonError, jsonOk } from "@/lib/server/api";
import { notifySignup } from "@/lib/server/notifications";
import {
  createSession,
  setSessionCookie,
} from "@/lib/server/session";
import type { SignupApplication } from "@/types";

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as SignupApplication;

    if (!data.email || !data.password || !data.firstName || !data.lastName) {
      return jsonError("Missing required fields", 400);
    }

    let ambassadorId: string | undefined;
    if (data.referralCode?.trim()) {
      const ambassador = await getAmbassadorByReferralCode(data.referralCode.trim());
      if (!ambassador) {
        return jsonError(
          "Invalid referral code. Leave the field blank if you were not referred by a brand ambassador.",
          400
        );
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

    return jsonOk({ user });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Signup failed";
    if (message.includes("Unique constraint")) {
      return jsonError("An account with this email or Online ID already exists", 409);
    }
    console.error("Signup error:", err);
    return jsonError("Signup failed", 500);
  }
}
