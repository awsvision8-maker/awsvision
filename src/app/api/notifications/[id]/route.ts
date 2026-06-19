import { markNotificationRead } from "@/lib/server/notification-service";
import { jsonError, jsonOk } from "@/lib/server/api";
import { getSessionUserId } from "@/lib/server/session";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getSessionUserId();
  if (!userId) return jsonError("Not authenticated", 401);

  try {
    const { id } = await params;
    const notification = await markNotificationRead(id, userId);
    return jsonOk({ notification });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Update failed";
    if (message.includes("not found")) return jsonError(message, 404);
    console.error("Mark notification read error:", err);
    return jsonError("Failed to update notification", 500);
  }
}
