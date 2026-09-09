import { getPortalUserId } from "@/lib/server/admin-preview-session";
import { jsonError, jsonOk } from "@/lib/server/api";
import { listUnreadAlertNotifications } from "@/lib/server/notification-service";

export async function GET() {
  const userId = await getPortalUserId();
  if (!userId) return jsonError("Not authenticated", 401);

  try {
    const alerts = await listUnreadAlertNotifications(userId);
    return jsonOk({ alerts });
  } catch (err) {
    console.error("Alerts fetch error:", err);
    return jsonError("Failed to load alerts", 500);
  }
}