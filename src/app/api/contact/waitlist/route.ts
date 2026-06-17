import { saveWaitlistEntry } from "@/lib/server/form-service";
import { jsonError, jsonOk } from "@/lib/server/api";
import { notifyWaitlist } from "@/lib/server/notifications";

const VALID_TYPES = ["newsletter", "products", "credit_cards", "loans"] as const;

export async function POST(request: Request) {
  try {
    const { email, listType } = (await request.json()) as {
      email?: string;
      listType?: string;
    };

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
