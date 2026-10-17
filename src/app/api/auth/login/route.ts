import { findUserByLoginIdentifier, verifyPassword } from "@/lib/server/auth-service";
import { jsonError, jsonOk } from "@/lib/server/api";
import { mapUser } from "@/lib/server/user-mapper";
import { notifyLogin } from "@/lib/server/notifications";
import {
  createSession,
  setSessionCookie,
} from "@/lib/server/session";
import { clientIpFromRequest, verifyRecaptchaToken } from "@/lib/server/verify-recaptcha";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      identifier?: string;
      password?: string;
      recaptchaToken?: string;
    };

    const captcha = await verifyRecaptchaToken(
      body.recaptchaToken,
      clientIpFromRequest(request)
    );
    if (!captcha.ok) return jsonError(captcha.error, 400);

    const identifier = (body.identifier ?? body.email)?.trim();
    const password = body.password;

    if (!identifier || !password) {
      return jsonError("Email or Online ID and password are required", 400);
    }

    const row = await findUserByLoginIdentifier(identifier);

    if (!row || !(await verifyPassword(password, row.passwordHash))) {
      return jsonError("Invalid email, Online ID, or password", 401);
    }

    const token = await createSession(row.id);
    await setSessionCookie(token);

    const user = mapUser(row);
    notifyLogin(user);

    return jsonOk({ user });
  } catch (err) {
    console.error("Login error:", err);
    return jsonError("Login failed", 500);
  }
}
