import { getAdminId } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";
import { deleteAdminNotificationBroadcast } from "@/lib/server/notification-service";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const { id } = await context.params;
    if (!id?.trim()) return jsonError("Notification id is required", 400);

    const deleted = await deleteAdminNotificationBroadcast(id);
    return jsonOk({
      success: true,
      ...deleted,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete notification";
    console.error("Admin notification delete error:", err);
    return jsonError(message, message === "Notification not found" ? 404 : 400);
  }
}
