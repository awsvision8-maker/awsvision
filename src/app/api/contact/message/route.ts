import { saveContactMessage } from "@/lib/server/form-service";
import { jsonError, jsonOk } from "@/lib/server/api";
import { notifyContact } from "@/lib/server/notifications";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      topic?: string;
      message?: string;
    };

    if (!body.firstName?.trim() || !body.lastName?.trim() || !body.email?.trim() || !body.message?.trim()) {
      return jsonError("Please fill in all required fields", 400);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return jsonError("Enter a valid email address", 400);
    }

    const data = {
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone?.trim() || undefined,
      topic: body.topic?.trim() || "General Inquiry",
      message: body.message.trim(),
    };

    await saveContactMessage(data);
    notifyContact(data);

    return jsonOk({ ok: true });
  } catch (err) {
    console.error("Contact message error:", err);
    return jsonError("Failed to send message", 500);
  }
}
