"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const HEARTBEAT_MS = 15_000;
const SKIP_PREFIXES = ["/admin", "/api", "/portal"];

function shouldSkip(path: string) {
  return SKIP_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));
}

async function postTrack(body: Record<string, unknown>, keepalive = false) {
  try {
    await fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "same-origin",
      keepalive,
    });
  } catch {
    /* ignore network errors */
  }
}

/**
 * Records page path, dwell time, and ties visits to the visitor session cookie.
 * Geo/IP are resolved server-side from request headers.
 */
export function SiteVisitorTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pageViewIdRef = useRef<string | null>(null);
  const enteredAtRef = useRef<number>(Date.now());
  const pathKey = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ""}`;

  useEffect(() => {
    if (shouldSkip(pathname)) return;

    let cancelled = false;
    let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
    pageViewIdRef.current = null;
    enteredAtRef.current = Date.now();

    const start = async () => {
      try {
        const res = await fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({
            event: "pageview",
            path: pathKey || pathname || "/",
            title: typeof document !== "undefined" ? document.title : undefined,
            referrer: typeof document !== "undefined" ? document.referrer || null : null,
          }),
        });
        const data = (await res.json()) as { pageViewId?: string; skipped?: boolean };
        if (cancelled || data.skipped || !data.pageViewId) return;
        pageViewIdRef.current = data.pageViewId;

        heartbeatTimer = setInterval(() => {
          const id = pageViewIdRef.current;
          if (!id) return;
          void postTrack({ event: "heartbeat", pageViewId: id });
        }, HEARTBEAT_MS);
      } catch {
        /* ignore */
      }
    };

    void start();

    const onLeave = () => {
      const id = pageViewIdRef.current;
      if (!id) return;
      const durationMs = Date.now() - enteredAtRef.current;
      void postTrack({ event: "leave", pageViewId: id, durationMs }, true);
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") onLeave();
    };

    window.addEventListener("pagehide", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      if (heartbeatTimer) clearInterval(heartbeatTimer);
      onLeave();
      window.removeEventListener("pagehide", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [pathname, pathKey]);

  return null;
}
