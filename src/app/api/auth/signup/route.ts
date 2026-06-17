import { applicationToKYC } from "@/lib/application-to-kyc";
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

    const user = await createIndividualUser(data, applicationToKYC(data));
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
