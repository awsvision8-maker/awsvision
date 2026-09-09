import { getManagerAmbassadorId } from "@/lib/server/manager-session";
import { jsonError, jsonOk } from "@/lib/server/api";
import {
  issueAmbassadorNotifications,
  listAmbassadorNotificationBroadcasts,
  listAmbassadorReferredClients,
  type NotificationType,
} from "@/lib/server/notification-service";

export async function GET() {
  const ambassadorId = await getManagerAmbassadorId();
  if (!ambassadorId) return jsonError("Unauthorized", 401);

  try {
    const [broadcasts, clients] = await Promise.all([
      listAmbassadorNotificationBroadcasts(ambassadorId),
      listAmbassadorReferredClients(ambassadorId),
    ]);
    return jsonOk({ broadcasts, clients });
  } catch (err) {
    console.error("Manager notifications list error:", err);
    return jsonError("Failed to load notifications", 500);
  }
}

export async function POST(request: Request) {
  const ambassadorId = await getManagerAmbassadorId();
  if (!ambassadorId) return jsonError("Unauthorized", 401);

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
    const result = await issueAmbassadorNotifications({
      ambassadorId,
      title: body.title,
      message: body.message,
      type: body.type ?? "info",
      scope,
      userIds: body.userIds,
      durationDays: body.durationDays ?? 7,
      durationHours: body.durationHours ?? 0,
    });

    return jsonOk({ success: true, ...result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send notification";
    console.error("Manager notification send error:", err);
    return jsonError(message, 400);
  }
}
