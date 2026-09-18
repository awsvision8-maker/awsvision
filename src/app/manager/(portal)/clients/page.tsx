"use client";

import { Eye, Link2, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import {
  commissionStatusLabel,
  depositStatusLabel,
} from "@/lib/manager-dashboard-types";
import { useManagerDashboard } from "@/lib/use-manager-dashboard";

export default function ManagerClientsPage() {
  const { data, loading } = useManagerDashboard();

  if (loading || !data) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Client book</h1>
        <p className="mt-1 text-sm text-slate-600">
          Clients enrolled with your referral code, deposit status, and commission. Open any
          client&apos;s portal in view-only mode.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/80 px-5 py-4">
          <div>
            <h2 className="font-semibold text-slate-900">Referred clients</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Commission equals {data.ambassador.commissionRatePercent}% of each client&apos;s first
              approved deposit, payable after that month closes.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <TrendingUp className="h-3.5 w-3.5 text-teal-600" />
            <span>
              Accrued commission {formatCurrency(data.stats.totalCommission)} (earned + pending)
            </span>
            <Link2 className="ml-2 h-3.5 w-3.5" />
          </div>
        </div>
        {data.referrals.length === 0 ? (
          <p className="p-10 text-center text-sm text-slate-500">
            No referred clients are linked to this account yet. Clients who enroll with your referral
            code will appear here after registration.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-left text-[11px] uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3 font-semibold">Client</th>
                  <th className="px-5 py-3 font-semibold">KYC</th>
                  <th className="px-5 py-3 font-semibold">First deposit</th>
                  <th className="px-5 py-3 font-semibold">
                    Commission ({data.ambassador.commissionRatePercent}%)
                  </th>
                  <th className="px-5 py-3 font-semibold">Monthly target</th>
                  <th className="px-5 py-3 font-semibold">Joined</th>
                  <th className="px-5 py-3 font-semibold">Portal</th>
                </tr>
              </thead>
              <tbody>
                {data.referrals.map((r) => (
                  <tr key={r.id} className="border-b border-slate-100 hover:bg-teal-50/30">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-slate-900">{r.name}</p>
                      <p className="text-xs text-slate-500">{r.email}</p>
                    </td>
                    <td className="px-5 py-3.5 capitalize text-slate-700">{r.kycStatus}</td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium tabular-nums">
                        {r.firstDepositAmount > 0 ? formatCurrency(r.firstDepositAmount) : "—"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {depositStatusLabel(r.firstDepositStatus)}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      {r.commissionAmount > 0 ? (
                        <>
                          <p className="font-semibold tabular-nums text-teal-800">
                            {formatCurrency(r.commissionAmount)}
                          </p>
                          <p className="text-xs text-slate-500">
                            {commissionStatusLabel(r.commissionStatus, r.commissionPayableOn)}
                          </p>
                        </>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-xs">
                      {r.countsTowardCurrentMonthTarget ? (
                        <span className="font-medium text-emerald-700">Counts this month</span>
                      ) : r.pendingCurrentMonthTarget ? (
                        <span className="text-amber-700">Needs profit withdrawal</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <a
                        href={`/api/manager/clients/${r.id}/preview`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-2.5 py-1.5 text-xs font-semibold text-teal-800 hover:bg-teal-100"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View dashboard
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
