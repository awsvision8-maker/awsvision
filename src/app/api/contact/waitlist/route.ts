import { saveWaitlistEntry } from "@/lib/server/form-service";
import { jsonError, jsonOk } from "@/lib/server/api";
import { notifyWaitlist } from "@/lib/server/notifications";
import { clientIpFromRequest, verifyRecaptchaToken } from "@/lib/server/verify-recaptcha";

const VALID_TYPES = ["newsletter", "products", "credit_cards", "loans"] as const;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      listType?: string;
      recaptchaToken?: string;
    };

    const captcha = await verifyRecaptchaToken(body.recaptchaToken, clientIpFromRequest(request));
    if (!captcha.ok) return jsonError(captcha.error, 400);

    const { email, listType } = body;

    if (!email?.trim() || !listType || !VALID_TYPES.includes(listType as (typeof VALID_TYPES)[number])) {
      return jsonError("Invalid waitlist request", 400);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonError("Enter a valid email address", 400);
    }

    await saveWaitlistEntry(listType, email.trim());
    notifyWaitlist(email.trim().toLowerCase(), listType);

    return jsonOk({ ok: true });
  } catch (err) {
    console.error("Waitlist error:", err);
    return jsonError("Failed to join waitlist", 500);
  }
}
