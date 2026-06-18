"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import {
  AdminActionButton,
  AdminEmptyState,
  AdminLoading,
  AdminPageHeader,
} from "@/components/admin/admin-ui";
import { getAccountLabel } from "@/lib/portfolio-engine";
import { formatCurrency, formatDate } from "@/lib/utils";

interface WithdrawalRow {
  id: string;
  amount: number;
  method: string;
  reference: string;
  createdAt: string;
  user: { id: string; email: string; firstName: string; lastName: string };
  account: {
    id: string;
    accountNumber: string;
    type: string;
    principal: number;
    investmentPlanId: string | null;
  } | null;
}

export default function AdminWithdrawalsPage() {
  const [rows, setRows] = useState<WithdrawalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/withdrawals");
    const data = await res.json();
    if (res.ok) setRows(data.withdrawals ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, [load]);

  const act = async (id: string, action: "approve" | "reject") => {
    setActing(id);
    try {
      const res = await fetch(`/api/admin/withdrawals/${id}/${action}`, { method: "POST" });
      if (res.ok) await load();
    } finally {
      setActing(null);
    }
  };

  if (loading) return <AdminLoading />;

  return (
    <div className="p-4 sm:p-8">
      <AdminPageHeader
        title="Withdrawal Approvals"
        description="Review client withdrawal requests. Approved withdrawals debit the account principal."
      />

      {rows.length === 0 ? (
        <AdminEmptyState title="No pending withdrawals" />
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs uppercase text-slate-500">
                <th className="px-6 py-3">Client</th>
                <th className="px-6 py-3">Account</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Method / Ref</th>
                <th className="px-6 py-3">Balance</th>
                <th className="px-6 py-3">Requested</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((w) => (
                <tr key={w.id} className="border-b border-slate-50">
                  <td className="px-6 py-4">
                    <p className="font-medium">{w.user.firstName} {w.user.lastName}</p>
                    <p className="text-xs text-slate-500">{w.user.email}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {w.account
                      ? getAccountLabel({
                          type: w.account.type as "savings",
                          investmentPlanId: w.account.investmentPlanId ?? undefined,
                        })
                      : "—"}
                  </td>
                  <td className="px-6 py-4 font-semibold">{formatCurrency(w.amount)}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {w.method}
                    <span className="block text-xs text-slate-400">{w.reference}</span>
                  </td>
                  <td className="px-6 py-4">
                    {w.account ? formatCurrency(w.account.principal) : "—"}
                  </td>
                  <td className="px-6 py-4 text-slate-500">{formatDate(w.createdAt)}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <AdminActionButton
                        variant="approve"
                        disabled={acting === w.id}
                        onClick={() => act(w.id, "approve")}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                      </AdminActionButton>
                      <AdminActionButton
                        variant="reject"
                        disabled={acting === w.id}
                        onClick={() => act(w.id, "reject")}
                      >
                        <XCircle className="h-3.5 w-3.5" /> Reject
                      </AdminActionButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
