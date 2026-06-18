import {
  claimHumanTakeover,
  getConversationWithMessages,
  markMessagesRead,
  sendAdminMessage,
  updateConversationStatus,
} from "@/lib/server/chat-service";
import { isRecentlyLive } from "@/lib/server/presence-service";
import { getAdminSession } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";

type RouteCtx = { params: Promise<{ id: string }> };

export async function GET(request: Request, ctx: RouteCtx) {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);

  const { id } = await ctx.params;
  const { searchParams } = new URL(request.url);
  const sinceParam = searchParams.get("since");
  const since = sinceParam ? new Date(sinceParam) : undefined;

  try {
    const conversation = await getConversationWithMessages(id, since);
    if (!conversation) return jsonError("Not found", 404);

    if (!since) {
      await markMessagesRead(id, "visitor");
      await claimHumanTakeover(id, session.adminId);
    }

    const refreshed = since ? conversation : await getConversationWithMessages(id, since);
    const active = refreshed ?? conversation;

    return jsonOk({
      conversation: {
        id: active.id,
        visitorName: active.visitorName,
        visitorEmail: active.visitorEmail,
        userId: active.userId,
        status: active.status,
        assignedTo: active.assignedTo,
        visitorIp: active.visitorIp,
        visitorLocation: active.visitorLocation,
        lastSeenAt: active.lastSeenAt?.toISOString() ?? null,
        isLive: isRecentlyLive(active.lastSeenAt),
        liveLabel: isRecentlyLive(active.lastSeenAt) ? "Live on chat" : null,
        botActive: !active.humanTakeoverAt,
        humanTakeoverAt: active.humanTakeoverAt?.toISOString() ?? null,
        messages: active.messages.map((m) => ({
          id: m.id,
          senderType: m.senderType,
          senderName: m.senderName,
          body: m.body,
          createdAt: m.createdAt.toISOString(),
          readAt: m.readAt?.toISOString() ?? null,
        })),
      },
    });
  } catch (err) {
    console.error("Admin chat get error:", err);
    return jsonError("Failed to load chat", 500);
  }
}

export async function POST(request: Request, ctx: RouteCtx) {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);

  const { id } = await ctx.params;
  const { body } = (await request.json()) as { body?: string };

  if (!body?.trim()) return jsonError("Message is required", 400);

  try {
    const message = await sendAdminMessage(id, session.adminId, body);
    return jsonOk({
      message: {
        id: message.id,
        senderType: message.senderType,
        senderName: message.senderName,
        body: message.body,
        createdAt: message.createdAt.toISOString(),
      },
    });
  } catch (err) {
    console.error("Admin chat send error:", err);
    return jsonError("Failed to send message", 500);
  }
}

export async function PATCH(request: Request, ctx: RouteCtx) {
  const session = await getAdminSession();
  if (!session) return jsonError("Unauthorized", 401);

  const { id } = await ctx.params;
  const { status } = (await request.json()) as { status?: string };

  if (status !== "open" && status !== "closed") {
    return jsonError("Invalid status", 400);
  }

  try {
    const updated = await updateConversationStatus(id, status, session.adminId);
    return jsonOk({ conversation: { id: updated.id, status: updated.status } });
  } catch (err) {
    console.error("Admin chat patch error:", err);
    return jsonError("Failed to update chat", 500);
  }
}
