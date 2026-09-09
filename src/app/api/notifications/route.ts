import {
  countUnreadNotifications,
  listUserNotifications,
  markAllNotificationsRead,
} from "@/lib/server/notification-service";
import { jsonError, jsonOk } from "@/lib/server/api";
import {
  getPortalUserId,
  rejectIfAdminPreview,
} from "@/lib/server/admin-preview-session";

export async function GET() {
  const userId = await getPortalUserId();
  if (!userId) return jsonError("Not authenticated", 401);

  try {
    const [notifications, unreadCount] = await Promise.all([
      listUserNotifications(userId),
      countUnreadNotifications(userId),
    ]);
    return jsonOk({ notifications, unreadCount });
  } catch (err) {
    console.error("User notifications error:", err);
    return jsonError("Failed to load notifications", 500);
  }
}

export async function PATCH() {
  const blocked = await rejectIfAdminPreview();
  if (blocked) return blocked;

  const userId = await getPortalUserId();
  if (!userId) return jsonError("Not authenticated", 401);

  try {
    const unreadCount = await markAllNotificationsRead(userId);
    return jsonOk({ success: true, unreadCount });
  } catch (err) {
    console.error("Mark all read error:", err);
    return jsonError("Failed to update notifications", 500);
  }
}
