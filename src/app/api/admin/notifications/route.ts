import { getAdminId } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";
import {
  issueAdminNotifications,
  listAdminNotificationBroadcasts,
  type NotificationType,
} from "@/lib/server/notification-service";

export async function GET() {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const broadcasts = await listAdminNotificationBroadcasts();
    return jsonOk({ broadcasts });
  } catch (err) {
    console.error("Admin notifications list error:", err);
    return jsonError("Failed to load notifications", 500);
  }
}

export async function POST(request: Request) {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const body = (await request.json()) as {
      title?: string;
      message?: string;
      type?: NotificationType;
      scope?: "all" | "selected";
      userIds?: string[];
      durationDays?: number;
      durationHours?: number;
    };

    if (!body.title?.trim() || !body.message?.trim()) {
      return jsonError("Title and message are required", 400);
    }

    const scope = body.scope === "selected" ? "selected" : "all";

    const result = await issueAdminNotifications({
      title: body.title,
      message: body.message,
      type: body.type ?? "info",
      scope,
      userIds: body.userIds,
      adminId,
      durationDays: body.durationDays ?? 0,
      durationHours: body.durationHours ?? 0,
    });

    return jsonOk({ success: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send notification";
    console.error("Admin notification send error:", err);
    return jsonError(message, 400);
  }
}
