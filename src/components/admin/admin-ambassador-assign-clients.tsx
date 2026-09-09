"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminStatusBadge } from "@/components/admin/admin-ui";

interface AssignableUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  onlineId: string | null;
  kycStatus: string;
  profileType: string;
  createdAt: string;
  ambassadorId: string | null;
  isLinkedHere: boolean;
  ambassador: {
    id: string;
    name: string;
    referralCode: string;
  } | null;
}

interface AdminAmbassadorAssignClientsProps {
  ambassadorId: string;
  ambassadorName: string;
  referralCode: string;
  onAssigned: () => void;
}

export function AdminAmbassadorAssignClients({
  ambassadorId,
  ambassadorName,
  referralCode,
  onAssigned,
}: AdminAmbassadorAssignClientsProps) {
  const [users, setUsers] = useState<AssignableUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unassigned" | "other" | "here">("unassigned");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/ambassadors/profile/${ambassadorId}/assign`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load clients");
      setUsers(data.users ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ambassadorId]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      if (filter === "unassigned" && u.ambassadorId) return false;
      if (filter === "other" && (!u.ambassadorId || u.isLinkedHere)) return false;
      if (filter === "here" && !u.isLinkedHere) return false;

      if (!q) return true;
      const hay = `${u.firstName} ${u.lastName} ${u.email} ${u.onlineId ?? ""} ${u.phone}`.toLowerCase();
      return hay.includes(q);
    });
  }, [users, search, filter]);

  const selectable = filtered.filter((u) => !u.isLinkedHere);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllVisible = () => {
    const ids = selectable.map((u) => u.id);
    const allSelected = ids.length > 0 && ids.every((id) => selected.has(id));
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        ids.forEach((id) => next.delete(id));
      } else {
        ids.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const assignSelected = async () => {
    const userIds = [...selected];
    if (userIds.length === 0) return;

    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/ambassadors/profile/${ambassadorId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Assign failed");
      setMessage(
        `${data.assignedCount} client${data.assignedCount === 1 ? "" : "s"} linked under ${ambassadorName} (${referralCode})`
      );
      setSelected(new Set());
      await load();
      onAssigned();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Assign failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mt-8 rounded-xl border border-violet-200 bg-violet-50/30 p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <UserPlus className="h-5 w-5 text-violet-700" />
            Add clients to this ambassador
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Select existing users below. They will appear under{" "}
            <strong>{ambassadorName}</strong> ({referralCode}) — same as signing up with this
            referral code.
          </p>
        </div>
        <Button
          size="sm"
          disabled={saving || selected.size === 0}
          onClick={() => void assignSelected()}
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
          Assign selected ({selected.size})
        </Button>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, Online ID…"
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["unassigned", "Unassigned"],
              ["all", "All users"],
              ["other", "Other BA"],
              ["here", "Already here"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium ${
                filter === key ? "bg-violet-600 text-white" : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {message && <p className="mt-3 text-sm font-medium text-emerald-700">{message}</p>}
      {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}

      {loading ? (
        <p className="mt-6 text-sm text-slate-500">Loading clients…</p>
      ) : filtered.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
          No clients match this filter.
        </p>
      ) : (
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-2 text-xs text-slate-600">
            <label className="inline-flex cursor-pointer items-center gap-2 font-medium">
              <input
                type="checkbox"
                checked={
                  selectable.length > 0 && selectable.every((u) => selected.has(u.id))
                }
                onChange={toggleAllVisible}
                className="rounded border-slate-300"
              />
              Select all visible ({selectable.length})
            </label>
            <span>
              Showing {filtered.length} of {users.length}
            </span>
          </div>
          <ul className="max-h-[28rem] divide-y divide-slate-100 overflow-y-auto">
            {filtered.map((u) => {
              const disabled = u.isLinkedHere;
              const checked = selected.has(u.id) || u.isLinkedHere;
              return (
                <li key={u.id}>
                  <label
                    className={`flex cursor-pointer items-start gap-3 px-4 py-3 hover:bg-slate-50 ${
                      disabled ? "cursor-default bg-violet-50/40" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="mt-1 rounded border-slate-300"
                      disabled={disabled}
                      checked={checked}
                      onChange={() => toggle(u.id)}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-slate-900">
                          {u.firstName} {u.lastName}
                        </p>
                        <AdminStatusBadge status={u.kycStatus} />
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase text-slate-600">
                          {u.profileType}
                        </span>
                      </div>
                      <p className="truncate text-sm text-slate-600">{u.email}</p>
                      <p className="text-xs text-slate-400">
                        {u.onlineId ? `Online ID ${u.onlineId} · ` : ""}
                        Joined {new Date(u.createdAt).toLocaleDateString()}
                      </p>
                      {u.isLinkedHere ? (
                        <p className="mt-1 text-xs font-medium text-violet-700">
                          Already under this ambassador
                        </p>
                      ) : u.ambassador ? (
                        <p className="mt-1 text-xs text-amber-700">
                          Currently under {u.ambassador.name} ({u.ambassador.referralCode}) — assigning
                          will move them here
                        </p>
                      ) : (
                        <p className="mt-1 text-xs text-slate-500">Not linked to any ambassador</p>
                      )}
                    </div>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
