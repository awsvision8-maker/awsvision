import { listContactMessages } from "@/lib/server/admin-service";
import { getAdminId } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";

export async function GET() {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const messages = await listContactMessages();
    return jsonOk({
      messages: messages.map((m) => ({
        ...m,
        createdAt: m.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    console.error("Admin messages error:", err);
    return jsonError("Failed to load messages", 500);
  }
}
