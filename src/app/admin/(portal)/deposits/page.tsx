"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Clock, ExternalLink, XCircle } from "lucide-react";
import { getAccountLabel } from "@/lib/portfolio-engine";
import { formatCurrency, formatDate } from "@/lib/utils";

interface PendingDeposit {
  id: string;
  amount: number;
  description: string;
  date: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profileType: string;
  };
  account: {
    id: string;
    accountNumber: string;
    type: string;
    investmentPlanId: string | null;
  };
}

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState<PendingDeposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/deposits");
      const data = await res.json();
      if (res.ok) setDeposits(data.deposits ?? []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, [load]);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setActing(id);
    try {
      const res = await fetch(`/api/admin/deposits/${id}/${action}`, { method: "POST" });
      if (res.ok) await load();
    } finally {
      setActing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      <h1 className="text-2xl font-bold text-slate-900">Deposit Approvals</h1>
      <p className="mt-1 text-sm text-slate-500">
        All client deposits stay <strong>pending</strong> until you approve them here. Approved funds
        credit the account balance; profit accrual starts 30 days after the first approval.
      </p>

      {deposits.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
          <Clock className="h-10 w-10 text-slate-400" />
          <p className="mt-4 font-medium text-slate-700">No pending deposits</p>
          <p className="mt-1 text-sm text-slate-500">New requests will appear here automatically.</p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs uppercase text-slate-500">
                <th className="px-6 py-3">Client</th>
                <th className="px-6 py-3">Account</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Details</th>
                <th className="px-6 py-3">Submitted</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deposits.map((d) => (
                <tr key={d.id} className="border-b border-slate-50 hover:bg-slate-50/80">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">
                      {d.user.firstName} {d.user.lastName}
                    </p>
                    <p className="text-xs text-slate-500">{d.user.email}</p>
                    <Link
                      href={`/admin/users/${d.user.id}`}
                      className="mt-1 inline-flex items-center gap-0.5 text-xs font-medium text-teal-600 hover:underline"
                    >
                      User profile <ExternalLink className="h-3 w-3" />
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {getAccountLabel({
                      type: d.account.type as "savings",
                      investmentPlanId: d.account.investmentPlanId ?? undefined,
                    })}
                    <span className="block text-xs text-slate-400">{d.account.accountNumber}</span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {formatCurrency(d.amount)}
                  </td>
                  <td className="px-6 py-4 max-w-xs text-slate-600">{d.description}</td>
                  <td className="px-6 py-4 text-slate-500">{formatDate(d.date)}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={acting === d.id}
                        onClick={() => handleAction(d.id, "approve")}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 cursor-pointer"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Approve
                      </button>
                      <button
                        type="button"
                        disabled={acting === d.id}
                        onClick={() => handleAction(d.id, "reject")}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50 cursor-pointer"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Reject
                      </button>
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
