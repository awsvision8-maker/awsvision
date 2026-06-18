import {
  getConversationForVisitor,
  getVisitorConversationId,
  maybeAutoReplyAsBot,
  sendVisitorMessage,
} from "@/lib/server/chat-service";
import { touchConversationPresence } from "@/lib/server/presence-service";
import { jsonError, jsonOk } from "@/lib/server/api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let conversationId = searchParams.get("conversationId");
  const sinceParam = searchParams.get("since");
  const since = sinceParam ? new Date(sinceParam) : undefined;

  if (!conversationId) {
    conversationId = await getVisitorConversationId();
  }

  if (!conversationId) {
    return jsonOk({ conversation: null });
  }

  try {
    const conversation = await getConversationForVisitor(conversationId);
    if (!conversation) {
      return jsonOk({ conversation: null });
    }

    const messages = since
      ? conversation.messages.filter((m) => m.createdAt > since)
      : conversation.messages;

    await touchConversationPresence(conversationId);

    return jsonOk({
      conversation: {
        id: conversation.id,
        status: conversation.status,
        visitorName: conversation.visitorName,
        messages: messages.map((m) => ({
          id: m.id,
          senderType: m.senderType,
          senderName: m.senderName,
          body: m.body,
          createdAt: m.createdAt.toISOString(),
        })),
      },
    });
  } catch (err) {
    console.error("Chat messages error:", err);
    return jsonError("Failed to load messages", 500);
  }
}

export async function POST(request: Request) {
  try {
    const { conversationId, body, visitorName } = (await request.json()) as {
      conversationId?: string;
      body?: string;
      visitorName?: string;
    };

    const id = conversationId || (await getVisitorConversationId());
    if (!id || !body?.trim() || !visitorName?.trim()) {
      return jsonError("Invalid message", 400);
    }

    const message = await sendVisitorMessage(id, body, visitorName.trim());
    await touchConversationPresence(id);
    const botReply = await maybeAutoReplyAsBot(id, body, visitorName.trim());
    return jsonOk({
      message: {
        id: message.id,
        senderType: message.senderType,
        senderName: message.senderName,
        body: message.body,
        createdAt: message.createdAt.toISOString(),
      },
      botReply: botReply
        ? {
            id: botReply.id,
            senderType: botReply.senderType,
            senderName: botReply.senderName,
            body: botReply.body,
            createdAt: botReply.createdAt.toISOString(),
          }
        : null,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to send";
    return jsonError(msg, 400);
  }
}
