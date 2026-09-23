import { cookies } from "next/headers";
import { getClientGeo } from "@/lib/request-geo";
import { jsonError, jsonOk } from "@/lib/server/api";
import { VISITOR_PRESENCE_COOKIE } from "@/lib/server/presence-service";
import {
  trackHeartbeat,
  trackLeave,
  trackPageView,
} from "@/lib/server/visitor-analytics-service";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      event?: string;
      path?: string;
      title?: string;
      referrer?: string;
      pageViewId?: string;
      durationMs?: number;
    };

    const event = body.event ?? "pageview";
    const jar = await cookies();
    const sessionToken = jar.get(VISITOR_PRESENCE_COOKIE)?.value ?? null;
    const userAgent = request.headers.get("user-agent");

    if (event === "heartbeat") {
      if (!body.pageViewId) return jsonError("pageViewId required", 400);
      const result = await trackHeartbeat({
        pageViewId: body.pageViewId,
        sessionToken,
      });
      if (!result) return jsonError("Not found", 404);
      return jsonOk(result);
    }

    if (event === "leave") {
      if (!body.pageViewId) return jsonError("pageViewId required", 400);
      const result = await trackLeave({
        pageViewId: body.pageViewId,
        durationMs: body.durationMs,
        sessionToken,
      });
      if (!result) return jsonError("Not found", 404);
      return jsonOk(result);
    }

    const path = (body.path ?? "/").trim() || "/";
    if (path.startsWith("/admin") || path.startsWith("/api")) {
      return jsonOk({ skipped: true });
    }

    const geo = await getClientGeo(request);
    const result = await trackPageView({
      sessionToken,
      path,
      title: body.title ?? null,
      referrer: body.referrer ?? null,
      userAgent,
      geo,
    });

    return jsonOk(result);
  } catch (err) {
    console.error("Analytics track error:", err);
    return jsonError("Failed to track", 500);
  }
}
