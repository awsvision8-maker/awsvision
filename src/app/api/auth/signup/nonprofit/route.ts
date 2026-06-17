import { createNonprofitUser } from "@/lib/server/auth-service";
import { jsonError, jsonOk } from "@/lib/server/api";
import { notifyNonprofitSignup } from "@/lib/server/notifications";
import {
  createSession,
  setSessionCookie,
} from "@/lib/server/session";
import type { NonprofitSignupApplication } from "@/types";

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as NonprofitSignupApplication;

    if (!data.repEmail || !data.password || !data.organizationLegalName) {
      return jsonError("Missing required fields", 400);
    }

    const user = await createNonprofitUser(data);
    const token = await createSession(user.id);
    await setSessionCookie(token);

    notifyNonprofitSignup(user, data.organizationLegalName);

    return jsonOk({ user });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Signup failed";
    if (message.includes("Unique constraint")) {
      return jsonError("An account with this email or Online ID already exists", 409);
    }
    console.error("Nonprofit signup error:", err);
    return jsonError("Signup failed", 500);
  }
}
