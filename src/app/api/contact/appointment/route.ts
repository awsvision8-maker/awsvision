import { saveAppointment } from "@/lib/server/form-service";
import { jsonError, jsonOk } from "@/lib/server/api";
import { notifyAppointment } from "@/lib/server/notifications";
import { clientIpFromRequest, verifyRecaptchaToken } from "@/lib/server/verify-recaptcha";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      fullName?: string;
      email?: string;
      phone?: string;
      preferredDate?: string;
      topic?: string;
      recaptchaToken?: string;
    };

    const captcha = await verifyRecaptchaToken(body.recaptchaToken, clientIpFromRequest(request));
    if (!captcha.ok) return jsonError(captcha.error, 400);

    if (!body.fullName?.trim() || !body.email?.trim() || !body.topic?.trim()) {
      return jsonError("Please fill in all required fields", 400);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return jsonError("Enter a valid email address", 400);
    }

    const data = {
      fullName: body.fullName.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone?.trim() || undefined,
      preferredDate: body.preferredDate || undefined,
      topic: body.topic.trim(),
    };

    await saveAppointment(data);
    notifyAppointment(data);

    return jsonOk({ ok: true });
  } catch (err) {
    console.error("Appointment error:", err);
    return jsonError("Failed to request appointment", 500);
  }
}
