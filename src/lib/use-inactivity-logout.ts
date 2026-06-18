"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

/** Portal auto-logout after 1 minute without user activity */
export const PORTAL_INACTIVITY_MS = 60_000;

const ACTIVITY_EVENTS = [
  "mousedown",
  "keydown",
  "scroll",
  "touchstart",
  "click",
  "mousemove",
] as const;

export function useInactivityLogout(
  logout: () => Promise<void>,
  enabled: boolean,
  redirectTo = "/login?timeout=1"
) {
  const router = useRouter();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loggingOutRef = useRef(false);

  const handleLogout = useCallback(async () => {
    if (loggingOutRef.current) return;
    loggingOutRef.current = true;
    try {
      await logout();
      router.replace(redirectTo);
    } finally {
      loggingOutRef.current = false;
    }
  }, [logout, redirectTo, router]);

  const resetTimer = useCallback(() => {
    if (!enabled || loggingOutRef.current) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      void handleLogout();
    }, PORTAL_INACTIVITY_MS);
  }, [enabled, handleLogout]);

  useEffect(() => {
    if (!enabled) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }

    const onActivity = () => resetTimer();

    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, onActivity, { passive: true });
    });

    resetTimer();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, onActivity);
      });
    };
  }, [enabled, resetTimer]);
}
