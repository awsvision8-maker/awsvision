import { jsonError, jsonOk } from "@/lib/server/api";
import { requestPasswordReset } from "@/lib/server/password-reset-service";
import { clientIpFromRequest, verifyRecaptchaToken } from "@/lib/server/verify-recaptcha";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      identifier?: string;
      recaptchaToken?: string;
    };

    const captcha = await verifyRecaptchaToken(body.recaptchaToken, clientIpFromRequest(request));
    if (!captcha.ok) return jsonError(captcha.error, 400);

    const identifier = body.identifier?.trim() ?? "";
    if (!identifier) {
      return jsonError("Enter your email or Online ID", 400);
    }

    await requestPasswordReset(identifier);

    // Always the same message — do not reveal whether the account exists
    return jsonOk({
      ok: true,
      message:
        "If an account matches that email or Online ID, we sent password reset instructions. Check your inbox and spam folder.",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return jsonError("Could not process password reset request. Please try again.", 500);
  }
}
