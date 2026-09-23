/**
 * Server-side Google reCAPTCHA v2 verification.
 * Env: RECAPTCHA_SECRET_KEY (+ NEXT_PUBLIC_RECAPTCHA_SITE_KEY on the client)
 */

export type RecaptchaVerifyResult =
  | { ok: true; skipped?: boolean }
  | { ok: false; error: string };

export async function verifyRecaptchaToken(
  token: string | undefined | null,
  remoteIp?: string | null
): Promise<RecaptchaVerifyResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY?.trim();

  if (!secret) {
    // Local/dev without keys — allow so forms still work
    if (process.env.NODE_ENV !== "production") {
      console.warn("[recaptcha] RECAPTCHA_SECRET_KEY missing — skipping verify (non-production)");
      return { ok: true, skipped: true };
    }
    console.error("[recaptcha] RECAPTCHA_SECRET_KEY is not set in production");
    return { ok: false, error: "Security check is temporarily unavailable. Please try again later." };
  }

  if (!token?.trim()) {
    return { ok: false, error: "Please complete the reCAPTCHA checkbox" };
  }

  try {
    const params = new URLSearchParams({
      secret,
      response: token.trim(),
    });
    if (remoteIp) params.set("remoteip", remoteIp);

    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
      cache: "no-store",
    });

    const data = (await res.json()) as {
      success?: boolean;
      "error-codes"?: string[];
    };

    if (!data.success) {
      console.warn("[recaptcha] verify failed", data["error-codes"]);
      return { ok: false, error: "reCAPTCHA verification failed. Please try again." };
    }

    return { ok: true };
  } catch (err) {
    console.error("[recaptcha] verify error", err);
    return { ok: false, error: "Could not verify reCAPTCHA. Please try again." };
  }
}

export function clientIpFromRequest(request: Request): string | undefined {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || undefined;
  return request.headers.get("x-real-ip") ?? undefined;
}
