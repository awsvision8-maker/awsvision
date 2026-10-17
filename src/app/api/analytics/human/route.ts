import { jsonError, jsonOk } from "@/lib/server/api";
import {
  isHumanVerified,
  setHumanVerifiedCookie,
} from "@/lib/server/human-verify";
import { clientIpFromRequest, verifyRecaptchaToken } from "@/lib/server/verify-recaptcha";

export async function GET() {
  const verified = await isHumanVerified();
  return jsonOk({ verified });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { recaptchaToken?: string };
    const captcha = await verifyRecaptchaToken(
      body.recaptchaToken,
      clientIpFromRequest(request)
    );
    if (!captcha.ok) return jsonError(captcha.error, 400);

    await setHumanVerifiedCookie();
    return jsonOk({ verified: true });
  } catch (err) {
    console.error("Human verify error:", err);
    return jsonError("Verification failed", 500);
  }
}
