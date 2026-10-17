import { jsonError, jsonOk } from "@/lib/server/api";
import { resetPasswordWithToken } from "@/lib/server/password-reset-service";
import { clientIpFromRequest, verifyRecaptchaToken } from "@/lib/server/verify-recaptcha";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      token?: string;
      password?: string;
      confirmPassword?: string;
      recaptchaToken?: string;
    };

    const captcha = await verifyRecaptchaToken(body.recaptchaToken, clientIpFromRequest(request));
    if (!captcha.ok) return jsonError(captcha.error, 400);

    const token = body.token?.trim() ?? "";
    const password = body.password ?? "";
    const confirmPassword = body.confirmPassword ?? "";

    if (!token) {
      return jsonError("Reset link is missing or invalid", 400);
    }
    if (password !== confirmPassword) {
      return jsonError("Passwords do not match", 400);
    }

    const result = await resetPasswordWithToken(token, password);
    if (!result.ok) {
      return jsonError(result.error, 400);
    }

    return jsonOk({
      ok: true,
      message: "Your password has been updated. You can sign in with your new password.",
    });
  } catch (err) {
    console.error("Reset password error:", err);
    return jsonError("Could not reset password. Please try again.", 500);
  }
}
