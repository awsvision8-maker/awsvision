import { saveAmbassadorApplication } from "@/lib/server/ambassador-service";
import { jsonError, jsonOk } from "@/lib/server/api";
import { notifyAmbassadorApplication } from "@/lib/server/notifications";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      city?: string;
      state?: string;
      linkedin?: string;
      experience?: string;
      message?: string;
    };

    if (!body.firstName?.trim() || !body.lastName?.trim() || !body.email?.trim() || !body.phone?.trim() || !body.message?.trim()) {
      return jsonError("Please complete all required fields", 400);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return jsonError("Enter a valid email address", 400);
    }

    const data = {
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      email: body.email.trim(),
      phone: body.phone.trim(),
      city: body.city?.trim(),
      state: body.state?.trim(),
      linkedin: body.linkedin?.trim(),
      experience: body.experience?.trim(),
      message: body.message.trim(),
    };

    await saveAmbassadorApplication(data);
    notifyAmbassadorApplication(data);

    return jsonOk({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to submit application";
    return jsonError(message, 400);
  }
}
