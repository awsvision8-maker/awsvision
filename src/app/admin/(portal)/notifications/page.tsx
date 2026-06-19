"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Bell, Send, Users } from "lucide-react";
import {
  AdminEmptyState,
  AdminLoading,
  AdminPageHeader,
} from "@/components/admin/admin-ui";
import { formatDate } from "@/lib/utils";

type NotificationType = "info" | "success" | "warning" | "action";

interface Broadcast {
  id: string;
  title: string;
  message: string;
  type: string;
  scope: string;
  recipientCount: number;
  durationDays: number;
  durationHours: number;
  expiresAt: string;
  expired: boolean;
  createdAt: string;
}

interface UserOption {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

const TYPE_OPTIONS: { value: NotificationType; label: string }[] = [
  { value: "info", label: "Info" },
  { value: "success", label: "Success" },
  { value: "warning", label: "Warning" },
  { value: "action", label: "Action required" },
];

export default function AdminNotificationsPage() {
  const searchParams = useSearchParams();
  const preselectUserId = searchParams.get("userId");

  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<NotificationType>("info");
  const [scope, setScope] = useState<"all" | "selected">(
    preselectUserId ? "selected" : "all"
  );
  const [selectedIds, setSelectedIds] = useState<string[]>(
    preselectUserId ? [preselectUserId] : []
  );
  const [userSearch, setUserSearch] = useState("");
  const [durationDays, setDurationDays] = useState(7);
  const [durationHours, setDurationHours] = useState(0);

  const load = useCallback(async () => {
    const [notifRes, usersRes] = await Promise.all([
      fetch("/api/admin/notifications"),
      fetch("/api/admin/users"),
    ]);
    const notifData = await notifRes.json();
    const usersData = await usersRes.json();
    if (notifRes.ok) setBroadcasts(notifData.broadcasts ?? []);
    if (usersRes.ok) {
      setUsers(
        (usersData.users ?? []).map(
          (u: { id: string; email: string; firstName: string; lastName: string }) => ({
            id: u.id,
            email: u.email,
            firstName: u.firstName,
            lastName: u.lastName,
          })
        )
      );
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredUsers = useMemo(() => {
    const q = userSearch.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(q)
    );
  }, [users, userSearch]);

  const toggleUser = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSending(true);

    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          message,
          type,
          scope,
          userIds: scope === "selected" ? selectedIds : undefined,
          durationDays,
          durationHours,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to send notification");
        return;
      }

      setSuccess(
        `Notification sent to ${data.recipientCount} user${data.recipientCount === 1 ? "" : "s"}. Visible for ${durationDays} day${durationDays === 1 ? "" : "s"}${durationHours > 0 ? ` and ${durationHours} hour${durationHours === 1 ? "" : "s"}` : ""}.`
      );
      setTitle("");
      setMessage("");
      if (scope === "all") setSelectedIds([]);
      await load();
    } catch {
      setError("Failed to send notification");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <AdminLoading />;

  return (
    <div className="p-4 sm:p-8">
      <AdminPageHeader
        title="Issue Notifications"
        description="Send announcements or alerts to all clients or specific users."
      />

      <form
        onSubmit={(e) => void handleSend(e)}
        className="mt-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <div className="flex items-center gap-2 text-teal-700">
          <Bell className="h-5 w-5" />
          <h2 className="text-lg font-semibold text-slate-900">Compose notification</h2>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Title</span>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Scheduled maintenance"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Message</span>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write the notification body…"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Type</span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as NotificationType)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              {TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <fieldset>
            <legend className="text-sm font-medium text-slate-700">Recipients</legend>
            <div className="mt-2 flex flex-wrap gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="scope"
                  checked={scope === "all"}
                  onChange={() => setScope("all")}
                />
                All users ({users.length})
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="scope"
                  checked={scope === "selected"}
                  onChange={() => setScope("selected")}
                />
                Selected users
              </label>
            </div>
          </fieldset>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Visible for (days)</span>
            <input
              type="number"
              min={0}
              max={365}
              value={durationDays}
              onChange={(e) => setDurationDays(Math.max(0, Number(e.target.value) || 0))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Visible for (hours)</span>
            <input
              type="number"
              min={0}
              max={168}
              value={durationHours}
              onChange={(e) => setDurationHours(Math.max(0, Number(e.target.value) || 0))}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          Set how long clients can see this notification. After the limit, it disappears from their
          portal automatically. At least one of days or hours must be greater than zero.
        </p>

        {scope === "selected" && (
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-slate-700">
                <Users className="mr-1 inline h-4 w-4" />
                {selectedIds.length} selected
              </p>
              <input
                type="search"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search by name or email…"
                className="w-full max-w-xs rounded-lg border border-slate-200 px-3 py-1.5 text-sm"
              />
            </div>
            <div className="mt-3 max-h-48 space-y-1 overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <p className="text-sm text-slate-500">No users match your search.</p>
              ) : (
                filteredUsers.map((u) => (
                  <label
                    key={u.id}
                    className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-white"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(u.id)}
                      onChange={() => toggleUser(u.id)}
                    />
                    <span>
                      {u.firstName} {u.lastName}{" "}
                      <span className="text-slate-500">({u.email})</span>
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>
        )}

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}
        {success && (
          <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={sending}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50 cursor-pointer"
        >
          <Send className="h-4 w-4" />
          {sending ? "Sending…" : "Send notification"}
        </button>
      </form>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-900">Sent history</h2>
        {broadcasts.length === 0 ? (
          <AdminEmptyState
            title="No notifications sent yet"
            description="Issued notifications will appear here."
          />
        ) : (
          <div className="mt-4 space-y-3">
            {broadcasts.map((b) => (
              <article
                key={b.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-900">{b.title}</p>
                    <p className="mt-1 text-sm text-slate-600 whitespace-pre-wrap">{b.message}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium capitalize text-slate-700">
                    {b.type}
                  </span>
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  {formatDate(b.createdAt)} ·{" "}
                  {b.scope === "all" ? "All users" : "Selected users"} · {b.recipientCount}{" "}
                  recipient{b.recipientCount === 1 ? "" : "s"} · Visible{" "}
                  {b.durationDays > 0 ? `${b.durationDays}d` : ""}
                  {b.durationDays > 0 && b.durationHours > 0 ? " " : ""}
                  {b.durationHours > 0 ? `${b.durationHours}h` : ""}
                  {b.expired ? (
                    <span className="text-slate-400"> · Expired {formatDate(b.expiresAt)}</span>
                  ) : (
                    <span className="text-emerald-700"> · Expires {formatDate(b.expiresAt)}</span>
                  )}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
