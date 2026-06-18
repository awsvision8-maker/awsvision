import { getClientGeo } from "@/lib/request-geo";
import {
  getVisitorSessionToken,
  upsertVisitorPresence,
} from "@/lib/server/presence-service";
import { getSessionUserId } from "@/lib/server/session";
import { jsonError, jsonOk } from "@/lib/server/api";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      currentPath?: string;
      chatActive?: boolean;
      conversationId?: string | null;
      visitorName?: string;
      visitorEmail?: string;
    };

    const geo = await getClientGeo(request);
    const sessionToken = await getVisitorSessionToken();
    const userId = await getSessionUserId();

    const { sessionToken: token } = await upsertVisitorPresence({
      sessionToken,
      geo,
      currentPath: body.currentPath?.trim() || "/",
      status: body.chatActive ? "chat" : "website",
      userId,
      visitorName: body.visitorName?.trim() || null,
      visitorEmail: body.visitorEmail?.trim() || null,
      conversationId: body.chatActive ? body.conversationId ?? null : null,
    });

    return jsonOk({ ok: true, sessionToken: token });
  } catch (err) {
    console.error("Presence heartbeat error:", err);
    return jsonError("Failed to update presence", 500);
  }
}
