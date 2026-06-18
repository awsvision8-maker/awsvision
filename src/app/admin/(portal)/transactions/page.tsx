"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  AdminEmptyState,
  AdminLoading,
  AdminPageHeader,
  AdminStatusBadge,
} from "@/components/admin/admin-ui";
import { getAccountLabel } from "@/lib/portfolio-engine";
import { formatCurrency, formatDate } from "@/lib/utils";

interface TxRow {
  id: string;
  type: string;
  amount: number;
  description: string;
  status: string;
  date: string;
  user: { id: string; email: string; firstName: string; lastName: string };
  account: {
    id: string;
    accountNumber: string;
    type: string;
    investmentPlanId: string | null;
  };
}

export default function AdminTransactionsPage() {
  const searchParams = useSearchParams();
  const [rows, setRows] = useState<TxRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(searchParams.get("status") ?? "all");
  const [type, setType] = useState(searchParams.get("type") ?? "all");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/transactions?status=${status}&type=${type}`);
    const data = await res.json();
    if (res.ok) setRows(data.transactions ?? []);
    setLoading(false);
  }, [status, type]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="p-4 sm:p-8">
      <AdminPageHeader
        title="Transaction Ledger"
        description="All deposits, withdrawals, and fees across client accounts."
      >
        <div className="flex flex-wrap gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="all">All types</option>
            <option value="deposit">Deposits</option>
            <option value="withdrawal">Withdrawals</option>
            <option value="profit">Profit</option>
            <option value="fee">Fees</option>
          </select>
        </div>
      </AdminPageHeader>

      {loading ? (
        <AdminLoading />
      ) : rows.length === 0 ? (
        <AdminEmptyState title="No transactions found" />
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs uppercase text-slate-500">
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Client</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Account</th>
                <th className="px-6 py-3">Description</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="px-6 py-3 text-slate-500">{formatDate(t.date)}</td>
                  <td className="px-6 py-3">
                    <Link href={`/admin/users/${t.user.id}`} className="font-medium text-teal-700 hover:underline">
                      {t.user.firstName} {t.user.lastName}
                    </Link>
                    <p className="text-xs text-slate-400">{t.user.email}</p>
                  </td>
                  <td className="px-6 py-3 capitalize">{t.type}</td>
                  <td className="px-6 py-3 font-semibold">{formatCurrency(t.amount)}</td>
                  <td className="px-6 py-3">
                    <AdminStatusBadge status={t.status} />
                  </td>
                  <td className="px-6 py-3 text-slate-600">
                    {getAccountLabel({
                      type: t.account.type as "savings",
                      investmentPlanId: t.account.investmentPlanId ?? undefined,
                    })}
                  </td>
                  <td className="px-6 py-3 max-w-xs text-slate-600">{t.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
