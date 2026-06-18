import {
  getConversationForVisitor,
  getVisitorConversationId,
  maybeAutoReplyAsBot,
  sendAgentWelcomeMessage,
  sendVisitorMessage,
  setVisitorConversationCookie,
  startConversation,
} from "@/lib/server/chat-service";
import {
  getVisitorSessionToken,
  upsertVisitorPresence,
} from "@/lib/server/presence-service";
import { getClientGeo } from "@/lib/request-geo";
import { getSessionUserId } from "@/lib/server/session";
import { jsonError, jsonOk } from "@/lib/server/api";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      visitorName?: string;
      visitorEmail?: string;
      message?: string;
    };

    if (!body.visitorName?.trim() || !body.visitorEmail?.trim()) {
      return jsonError("Name and email are required", 400);
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.visitorEmail)) {
      return jsonError("Enter a valid email", 400);
    }

    const userId = await getSessionUserId();
    const geo = await getClientGeo(request);
    const sessionToken = await getVisitorSessionToken();
    const existingId = await getVisitorConversationId();
    if (existingId) {
      const existing = await getConversationForVisitor(existingId);
      if (existing && existing.status === "open") {
        if (body.message?.trim()) {
          await sendVisitorMessage(existingId, body.message, body.visitorName.trim());
          await maybeAutoReplyAsBot(existingId, body.message, body.visitorName.trim());
        }
        await upsertVisitorPresence({
          sessionToken,
          geo,
          currentPath: "/",
          status: "chat",
          userId,
          visitorName: body.visitorName.trim(),
          visitorEmail: body.visitorEmail.trim(),
          conversationId: existingId,
        });
        return jsonOk({ conversationId: existingId });
      }
    }

    const conversation = await startConversation({
      visitorName: body.visitorName.trim(),
      visitorEmail: body.visitorEmail.trim(),
      userId: userId ?? undefined,
      initialMessage: body.message?.trim(),
      geo,
    });

    await setVisitorConversationCookie(conversation.id);

    await upsertVisitorPresence({
      sessionToken,
      geo,
      currentPath: "/",
      status: "chat",
      userId,
      visitorName: body.visitorName.trim(),
      visitorEmail: body.visitorEmail.trim(),
      conversationId: conversation.id,
    });

    if (!body.message?.trim()) {
      await sendAgentWelcomeMessage(conversation.id, body.visitorName.trim());
    } else {
      await maybeAutoReplyAsBot(conversation.id, body.message, body.visitorName.trim());
    }

    return jsonOk({ conversationId: conversation.id });
  } catch (err) {
    console.error("Chat start error:", err);
    return jsonError("Failed to start chat", 500);
  }
}
