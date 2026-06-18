import { listConversations, isBotActive } from "@/lib/server/chat-service";
import { isRecentlyLive } from "@/lib/server/presence-service";
import { getAdminId } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";

export async function GET(request: Request) {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? undefined;

  try {
    const conversations = await listConversations(status || undefined);
    return jsonOk({
      conversations: conversations.map((c) => ({
        id: c.id,
        visitorName: c.visitorName,
        visitorEmail: c.visitorEmail,
        userId: c.userId,
        status: c.status,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
        messageCount: c._count.messages,
        lastMessage: c.messages[0]
          ? {
              body: c.messages[0].body,
              senderType: c.messages[0].senderType,
              createdAt: c.messages[0].createdAt.toISOString(),
            }
          : null,
        assignedTo: c.assignedTo,
        visitorIp: c.visitorIp,
        visitorLocation: c.visitorLocation,
        lastSeenAt: c.lastSeenAt?.toISOString() ?? null,
        isLive: isRecentlyLive(c.lastSeenAt),
        liveLabel: isRecentlyLive(c.lastSeenAt) ? "Live on chat" : null,
        botActive: isBotActive(c),
      })),
    });
  } catch (err) {
    console.error("Admin chats list error:", err);
    return jsonError("Failed to load chats", 500);
  }
}
