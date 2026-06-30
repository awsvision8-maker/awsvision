"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AdminEmptyState,
  AdminLoading,
  AdminPageHeader,
  AdminStatusBadge,
} from "@/components/admin/admin-ui";
import { formatDate } from "@/lib/utils";

interface SignupLogRow {
  id: string;
  profileType: string;
  status: string;
  email: string | null;
  onlineId: string | null;
  firstName: string | null;
  lastName: string | null;
  orgName: string | null;
  errorMessage: string | null;
  errorCode: string | null;
  source: string;
  ipAddress: string | null;
  userAgent: string | null;
  payloadKb: number | null;
  createdAt: string;
}

export default function AdminSignupLogsPage() {
  const [logs, setLogs] = useState<SignupLogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("failed");
  const [profileType, setProfileType] = useState("all");
  const [selected, setSelected] = useState<SignupLogRow | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ status, profileType, limit: "200" });
    const res = await fetch(`/api/admin/signup-logs?${params.toString()}`);
    const data = await res.json();
    if (res.ok) setLogs(data.logs ?? []);
    setLoading(false);
  }, [status, profileType]);

  useEffect(() => {
    void load();
  }, [load]);

  const failedInView = logs.filter((l) => l.status === "failed").length;

  if (loading) return <AdminLoading />;

  return (
    <div className="p-4 sm:p-8">
      <AdminPageHeader
        title="Signup Logs"
        description="Every signup attempt — successes and failures with error details."
      >
        <div className="flex flex-wrap gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="all">All statuses</option>
            <option value="failed">Failed only</option>
            <option value="success">Success only</option>
          </select>
          <select
            value={profileType}
            onChange={(e) => setProfileType(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="all">All types</option>
            <option value="individual">Individual</option>
            <option value="nonprofit">Non-profit</option>
          </select>
          <button
            type="button"
            onClick={() => void load()}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer"
          >
            Refresh
          </button>
        </div>
      </AdminPageHeader>

      {status === "failed" && failedInView > 0 && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {failedInView} failed signup attempt{failedInView === 1 ? "" : "s"} in this view. Review
          errors below to help users complete enrollment.
        </p>
      )}

      {logs.length === 0 ? (
        <AdminEmptyState
          title="No signup logs yet"
          description="Failed and successful signup attempts will appear here."
        />
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-left text-xs uppercase text-slate-500">
                  <th className="px-4 py-2">Time</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">User</th>
                  <th className="px-4 py-2">Error</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => setSelected(log)}
                    className={`cursor-pointer border-b border-slate-50 hover:bg-slate-50 ${
                      selected?.id === log.id ? "bg-teal-50" : ""
                    }`}
                  >
                    <td className="px-4 py-2 whitespace-nowrap text-xs text-slate-500">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="px-4 py-2">
                      <AdminStatusBadge status={log.status === "success" ? "verified" : "failed"} />
                    </td>
                    <td className="px-4 py-2">
                      <p className="font-medium text-slate-900 truncate max-w-[140px]">
                        {log.email ?? log.onlineId ?? "—"}
                      </p>
                      <p className="text-xs text-slate-500 capitalize">{log.profileType}</p>
                    </td>
                    <td className="px-4 py-2 text-xs text-red-700 truncate max-w-[160px]">
                      {log.errorMessage ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 min-h-[280px]">
            {selected ? (
              <div className="space-y-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <AdminStatusBadge
                    status={selected.status === "success" ? "verified" : "failed"}
                  />
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs capitalize text-slate-600">
                    {selected.profileType}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                    {selected.source}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{formatDate(selected.createdAt)}</p>

                {selected.status === "failed" && selected.errorMessage && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                    <p className="text-xs font-semibold uppercase text-red-800">Error</p>
                    <p className="mt-1 text-sm text-red-900">{selected.errorMessage}</p>
                    {selected.errorCode && (
                      <p className="mt-2 text-xs text-red-700">Code: {selected.errorCode}</p>
                    )}
                  </div>
                )}

                <dl className="grid gap-2 text-sm">
                  {[
                    ["Email", selected.email],
                    ["Online ID", selected.onlineId],
                    [
                      "Name",
                      selected.firstName || selected.lastName
                        ? `${selected.firstName ?? ""} ${selected.lastName ?? ""}`.trim()
                        : null,
                    ],
                    ["Organization", selected.orgName],
                    ["IP address", selected.ipAddress],
                    ["Payload", selected.payloadKb ? `${selected.payloadKb} KB` : null],
                  ].map(([label, value]) =>
                    value ? (
                      <div key={label} className="flex gap-2">
                        <dt className="w-28 shrink-0 text-slate-500">{label}</dt>
                        <dd className="font-medium text-slate-900 break-all">{value}</dd>
                      </div>
                    ) : null
                  )}
                </dl>

                {selected.userAgent && (
                  <p className="text-xs text-slate-500 break-all">
                    <span className="font-medium text-slate-700">User agent:</span>{" "}
                    {selected.userAgent}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-500">Select a log entry to view full details.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
