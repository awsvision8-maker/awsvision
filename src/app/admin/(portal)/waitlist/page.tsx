"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminEmptyState, AdminLoading, AdminPageHeader } from "@/components/admin/admin-ui";
import { formatDate } from "@/lib/utils";

interface WaitlistEntry {
  id: string;
  listType: string;
  email: string;
  createdAt: string;
}

export default function AdminWaitlistPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/admin/waitlist")
      .then((r) => r.json())
      .then((d) => setEntries(d.entries ?? []))
      .finally(() => setLoading(false));
  }, []);

  const listTypes = useMemo(
    () => [...new Set(entries.map((e) => e.listType))].sort(),
    [entries]
  );

  const filtered =
    filter === "all" ? entries : entries.filter((e) => e.listType === filter);

  if (loading) return <AdminLoading />;

  return (
    <div className="p-4 sm:p-8">
      <AdminPageHeader title="Waitlist" description={`${entries.length} email signups across product waitlists.`}>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="all">All lists</option>
          {listTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </AdminPageHeader>

      {filtered.length === 0 ? (
        <AdminEmptyState title="No waitlist entries" />
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs uppercase text-slate-500">
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">List</th>
                <th className="px-6 py-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} className="border-b border-slate-50">
                  <td className="px-6 py-4 font-medium">{e.email}</td>
                  <td className="px-6 py-4 capitalize">{e.listType.replace(/_/g, " ")}</td>
                  <td className="px-6 py-4 text-slate-500">{formatDate(e.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
