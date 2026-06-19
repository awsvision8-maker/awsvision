"use client";

import { useCallback, useEffect, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { PortalHeader } from "@/components/portal/sidebar";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  readAt: string | null;
  createdAt: string;
  expiresAt: string;
}

function formatTimeRemaining(expiresAt: string) {
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return "Expired";
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  if (days > 0) {
    const remHours = hours % 24;
    return remHours > 0 ? `${days}d ${remHours}h left` : `${days} day${days === 1 ? "" : "s"} left`;
  }
  if (hours > 0) return `${hours} hour${hours === 1 ? "" : "s"} left`;
  const minutes = Math.max(1, Math.floor(ms / (1000 * 60)));
  return `${minutes} min left`;
}

const TYPE_STYLES: Record<string, string> = {
  info: "border-sky-200 bg-sky-50",
  success: "border-emerald-200 bg-emerald-50",
  warning: "border-amber-200 bg-amber-50",
  action: "border-violet-200 bg-violet-50",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (res.ok) {
        setNotifications(data.notifications ?? []);
        setUnreadCount(data.unreadCount ?? 0);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const markRead = async (id: string) => {
    const res = await fetch(`/api/notifications/${id}`, { method: "PATCH" });
    if (res.ok) {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, readAt: n.readAt ?? new Date().toISOString() } : n
        )
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    }
  };

  const markAllRead = async () => {
    const res = await fetch("/api/notifications", { method: "PATCH" });
    if (res.ok) {
      const now = new Date().toISOString();
      setNotifications((prev) => prev.map((n) => ({ ...n, readAt: n.readAt ?? now })));
      setUnreadCount(0);
    }
  };

  return (
    <>
      <PortalHeader
        title="Notifications"
        subtitle={
          unreadCount > 0
            ? `${unreadCount} unread message${unreadCount === 1 ? "" : "s"}`
            : "Updates from AWS Vision"
        }
      />
      <div className="p-4 sm:p-6 lg:p-8">
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={() => void markAllRead()}
            className="mb-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </button>
        )}

        {loading ? (
          <p className="text-sm text-slate-500">Loading notifications…</p>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
            <Bell className="h-10 w-10 text-slate-300" />
            <p className="mt-3 font-medium text-slate-700">No notifications yet</p>
            <p className="mt-1 text-sm text-slate-500">
              Important updates from your account team will appear here.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {notifications.map((n) => {
              const unread = !n.readAt;
              return (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => unread && void markRead(n.id)}
                    className={cn(
                      "w-full rounded-xl border p-4 text-left transition-shadow",
                      TYPE_STYLES[n.type] ?? "border-slate-200 bg-white",
                      unread && "ring-2 ring-teal-500/30 shadow-sm cursor-pointer",
                      !unread && "opacity-80"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn("font-semibold text-slate-900", unread && "text-teal-900")}>
                        {n.title}
                        {unread && (
                          <span className="ml-2 inline-block h-2 w-2 rounded-full bg-teal-500 align-middle" />
                        )}
                      </p>
                      <span className="shrink-0 text-xs capitalize text-slate-500">{n.type}</span>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{n.message}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      {formatDate(n.createdAt)} · {formatTimeRemaining(n.expiresAt)}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
