"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Bell, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

type NotificationType = "info" | "success" | "warning" | "action" | "alert";

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

interface ClientOption {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
}

const TYPE_OPTIONS: { value: NotificationType; label: string }[] = [
  { value: "info", label: "Info" },
  { value: "success", label: "Success" },
  { value: "warning", label: "Warning" },
  { value: "action", label: "Action required" },
  { value: "alert", label: "Alert" },
];

export default function ManagerNotificationsPage() {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<NotificationType>("info");
  const [scope, setScope] = useState<"all" | "selected">("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [durationDays, setDurationDays] = useState(7);
  const [durationHours, setDurationHours] = useState(0);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/manager/notifications");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load");
      setBroadcasts(data.broadcasts ?? []);
      setClients(data.clients ?? []);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredClients = useMemo(() => {
    const q = userSearch.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(
      (c) =>
        c.email.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(q)
    );
  }, [clients, userSearch]);

  const toggleClient = (id: string) => {
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
      const res = await fetch("/api/manager/notifications", {
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
        `Sent to ${data.recipientCount} client${data.recipientCount === 1 ? "" : "s"}. Visible for ${durationDays} day${durationDays === 1 ? "" : "s"}${durationHours > 0 ? ` and ${durationHours} hour${durationHours === 1 ? "" : "s"}` : ""}.`
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

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
        <p className="mt-1 text-sm text-slate-600">
          Message your referred clients only — they will see it in their portal.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {success}
        </div>
      )}

      <form
        onSubmit={(e) => void handleSend(e)}
        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <div className="flex items-center gap-2 text-teal-700">
          <Bell className="h-5 w-5" />
          <h2 className="text-lg font-semibold text-slate-900">Compose</h2>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Title</span>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              placeholder="e.g. Reminder: complete KYC"
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="text-sm font-medium text-slate-700">Message</span>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              placeholder="Write a clear message for your clients…"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Type</span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as NotificationType)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500"
            >
              {TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Audience</span>
            <select
              value={scope}
              onChange={(e) => setScope(e.target.value as "all" | "selected")}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500"
            >
              <option value="all">All my referred clients ({clients.length})</option>
              <option value="selected">Selected clients only</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Visible days</span>
            <input
              type="number"
              min={0}
              max={90}
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value) || 0)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Extra hours</span>
            <input
              type="number"
              min={0}
              max={23}
              value={durationHours}
              onChange={(e) => setDurationHours(Number(e.target.value) || 0)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500"
            />
          </label>
        </div>

        {scope === "selected" && (
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium text-slate-800">
                Select clients ({selectedIds.length} selected)
              </p>
              <input
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search name or email…"
                className="w-full max-w-xs rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-teal-500 sm:w-auto"
              />
            </div>
            {clients.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">No referred clients yet.</p>
            ) : (
              <ul className="mt-3 max-h-56 space-y-1 overflow-y-auto">
                {filteredClients.map((c) => (
                  <li key={c.id}>
                    <label className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-white">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(c.id)}
                        onChange={() => toggleClient(c.id)}
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-sm text-slate-800">
                        <span className="font-medium">{c.name}</span>
                        <span className="text-slate-500"> · {c.email}</span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button
            type="submit"
            disabled={sending || (scope === "selected" && selectedIds.length === 0)}
            className="bg-teal-700 hover:bg-teal-800"
          >
            <Send className="h-4 w-4" />
            {sending ? "Sending…" : "Send notification"}
          </Button>
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50/80 px-5 py-4">
          <h2 className="font-semibold text-slate-900">Sent history</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Notifications you sent to your referral book.
          </p>
        </div>
        {broadcasts.length === 0 ? (
          <p className="p-10 text-center text-sm text-slate-500">
            No notifications sent yet.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {broadcasts.map((b) => (
              <li key={b.id} className="px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-slate-900">{b.title}</p>
                    <p className="mt-1 text-sm text-slate-600 whitespace-pre-wrap">{b.message}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      {formatDate(b.createdAt)} · {b.recipientCount} recipient
                      {b.recipientCount === 1 ? "" : "s"} ·{" "}
                      {b.scope === "ambassador_all" ? "All clients" : "Selected"} ·{" "}
                      {b.expired ? "Expired" : `Expires ${formatDate(b.expiresAt)}`}
                    </p>
                  </div>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                    {b.type}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
