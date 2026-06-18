"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { AdminLoading, AdminPageHeader, AdminStatusBadge } from "@/components/admin/admin-ui";
import { formatCurrency } from "@/lib/utils";

interface AdminUserRow {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  onlineId: string | null;
  kycStatus: string;
  profileType: string;
  createdAt: string;
  accounts: { id: string; type: string; principal: number; status: string }[];
  transactionCount: number;
  withdrawalCount: number;
  nonprofit: {
    organizationLegalName: string;
    ein: string;
    fundCapital: number;
    monthlyRate: number;
  } | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => setUsers(d.users ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) => {
    if (filter === "nonprofit") return u.profileType === "nonprofit";
    if (filter === "pending") return u.kycStatus !== "verified";
    return true;
  });

  if (loading) return <AdminLoading />;

  return (
    <div className="p-4 sm:p-8">
      <AdminPageHeader title="Client Users" description={`${users.length} registered accounts`}>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="all">All users</option>
          <option value="nonprofit">Non-profit only</option>
          <option value="pending">Pending KYC</option>
        </select>
      </AdminPageHeader>

      <div className="mt-6 space-y-4">
        {filtered.map((u) => (
          <div key={u.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-slate-900">
                  {u.firstName} {u.lastName}
                </h2>
                <p className="text-sm text-slate-600">{u.email}</p>
                <p className="text-sm text-slate-500">{u.phone}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium capitalize">
                  {u.profileType}
                </span>
                <AdminStatusBadge status={u.kycStatus} />
                <Link
                  href={`/admin/users/${u.id}`}
                  className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-800 hover:bg-teal-200"
                >
                  View profile <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>

            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs text-slate-500">Online ID</p>
                <p className="font-medium">{u.onlineId ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Registered</p>
                <p className="font-medium">{new Date(u.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Transactions</p>
                <p className="font-medium">{u.transactionCount}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Withdrawals</p>
                <p className="font-medium">{u.withdrawalCount}</p>
              </div>
            </div>

            {u.accounts.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase text-slate-500">Accounts</p>
                <ul className="mt-2 space-y-1">
                  {u.accounts.map((a) => (
                    <li key={a.id} className="text-sm text-slate-700">
                      <span className="capitalize">{a.type.replace(/_/g, " ")}</span>
                      {" — "}
                      {formatCurrency(a.principal)}
                      <span className="text-slate-400"> ({a.status})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {u.nonprofit && (
              <div className="mt-4 rounded-lg bg-violet-50 p-3 text-sm">
                <p className="font-semibold text-violet-900">{u.nonprofit.organizationLegalName}</p>
                <p className="text-violet-700">EIN: {u.nonprofit.ein}</p>
                <p className="text-violet-700">
                  Fund: {formatCurrency(u.nonprofit.fundCapital)} · {u.nonprofit.monthlyRate}% monthly
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
