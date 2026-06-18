"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  DollarSign,
  Clock,
  Link2,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface MonthlyTargetClient {
  id: string;
  name: string;
  email: string;
  firstDepositApprovedAt: string;
  profitWithdrawnAt?: string | null;
  profitWithdrawnAmount?: number;
  reason?: string;
}

interface DashboardData {
  ambassador: {
    referralCode: string;
    referralUrl: string;
    firstName: string;
  };
  monthlyTarget: {
    requiredPerMonth: number;
    rules: string[];
  };
  currentMonth: {
    label: string;
    target: number;
    qualified: number;
    met: boolean;
    qualifiedClients: MonthlyTargetClient[];
    pendingClients: MonthlyTargetClient[];
  } | null;
  monthlyTargets: {
    key: string;
    label: string;
    target: number;
    qualified: number;
    met: boolean;
    isCurrentMonth: boolean;
    qualifiedClients: MonthlyTargetClient[];
    pendingClients: MonthlyTargetClient[];
  }[];
  stats: {
    totalReferrals: number;
    activeClients: number;
    totalFirstDeposits: number;
    totalCommissionEarned: number;
    totalCommissionPending: number;
    totalCommission: number;
  };
  referrals: {
    id: string;
    name: string;
    email: string;
    kycStatus: string;
    createdAt: string;
    firstDepositAmount: number;
    firstDepositStatus: string;
    commissionAmount: number;
    commissionEarned: number;
    commissionPending: number;
    commissionStatus: string;
    commissionPayableOn: string | null;
    firstDepositApprovedAt: string | null;
    countsTowardCurrentMonthTarget: boolean;
    pendingCurrentMonthTarget: boolean;
    isActiveInvestor: boolean;
  }[];
}

function commissionStatusLabel(status: string, payableOn: string | null) {
  switch (status) {
    case "earned":
      return "Earned (month closed)";
    case "pending_month_end":
      return payableOn
        ? `Payable ${new Date(payableOn).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`
        : "Payable after month end";
    case "awaiting_approval":
      return "Awaiting deposit approval";
    case "awaiting_deposit":
      return "Awaiting first deposit";
    default:
      return status;
  }
}

function depositStatusLabel(status: string) {
  switch (status) {
    case "approved":
      return "First deposit approved";
    case "deposit_pending":
      return "Deposit pending review";
    case "awaiting_deposit":
      return "No deposit yet";
    default:
      return status;
  }
}

export default function ManagerDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/manager/dashboard");
    if (res.ok) setData(await res.json());
  }, []);

  useEffect(() => {
    void load();
    const interval = setInterval(() => void load(), 30000);
    return () => clearInterval(interval);
  }, [load]);

  const copyLink = async () => {
    if (!data) return;
    await navigator.clipboard.writeText(data.ambassador.referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!data) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-600 border-t-transparent" />
      </div>
    );
  }

  const current = data.currentMonth;
  const progressPct = current
    ? Math.min(100, (current.qualified / current.target) * 100)
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome back, {data.ambassador.firstName}</h1>
        <p className="mt-1 text-slate-600">
          Share your referral link, hit your monthly onboarding target, and track commissions from referred
          clients.
        </p>
      </div>

      {/* Monthly target — compulsory */}
      {current && (
        <div
          className={cn(
            "rounded-xl border-2 p-6",
            current.met
              ? "border-emerald-300 bg-gradient-to-r from-emerald-50 to-white"
              : "border-amber-300 bg-gradient-to-r from-amber-50 to-white"
          )}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-3">
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                  current.met ? "bg-emerald-600 text-white" : "bg-amber-500 text-white"
                )}
              >
                {current.met ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  <Target className="h-6 w-6" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Compulsory monthly target
                </p>
                <h2 className="text-xl font-bold text-slate-900">{current.label}</h2>
                <p className="mt-1 text-sm text-slate-600">
                  {current.qualified} of {current.target} qualified client
                  {current.target === 1 ? "" : "s"} onboarded
                  {current.met ? " — target achieved" : " — action required"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-slate-900">
                {current.qualified}/{current.target}
              </p>
              <p className="text-xs text-slate-500">Qualified this month</p>
            </div>
          </div>

          <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/80">
            <div
              className={cn("h-full rounded-full transition-all", current.met ? "bg-emerald-500" : "bg-amber-500")}
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <ul className="mt-5 space-y-2 text-sm text-slate-700">
            {data.monthlyTarget.rules.map((rule) => (
              <li key={rule} className="flex gap-2">
                <span className="text-violet-600">•</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>

          {current.pendingClients.length > 0 && (
            <div className="mt-5 rounded-lg border border-amber-200 bg-white/80 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-amber-900">
                <AlertTriangle className="h-4 w-4" />
                Funded but not yet qualified ({current.pendingClients.length})
              </p>
              <p className="mt-1 text-xs text-amber-800">
                These clients deposited this month but have not completed an approved profit withdrawal yet.
                They will not count toward your target until they withdraw profit in the same calendar month.
              </p>
              <ul className="mt-3 space-y-2">
                {current.pendingClients.map((c) => (
                  <li key={c.id} className="text-sm text-slate-700">
                    <strong>{c.name}</strong> — deposited{" "}
                    {new Date(c.firstDepositApprovedAt).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {current.qualifiedClients.length > 0 && (
            <div className="mt-4 rounded-lg border border-emerald-200 bg-white/80 p-4">
              <p className="text-sm font-semibold text-emerald-900">Qualified for {current.label}</p>
              <ul className="mt-2 space-y-2">
                {current.qualifiedClients.map((c) => (
                  <li key={c.id} className="text-sm text-slate-700">
                    <strong>{c.name}</strong> — deposit + profit withdrawal in month
                    {c.profitWithdrawnAmount
                      ? ` (${formatCurrency(c.profitWithdrawnAmount)} withdrawn)`
                      : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="rounded-xl border border-violet-200 bg-gradient-to-r from-violet-50 to-white p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-violet-800">Your referral link</p>
            <p className="mt-1 break-all text-sm text-slate-700">{data.ambassador.referralUrl}</p>
            <p className="mt-2 text-xs text-slate-500">
              Your code: <strong className="text-violet-800">{data.ambassador.referralCode}</strong>
            </p>
          </div>
          <Button type="button" onClick={() => void copyLink()} className="shrink-0 bg-violet-600 hover:bg-violet-500">
            <Copy className="mr-2 h-4 w-4" />
            {copied ? "Copied!" : "Copy Link"}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Total Referrals", value: data.stats.totalReferrals, icon: Users },
          { label: "Funded Clients", value: data.stats.activeClients, icon: TrendingUp },
          { label: "First Deposits", value: formatCurrency(data.stats.totalFirstDeposits), icon: DollarSign },
          { label: "Commission Earned", value: formatCurrency(data.stats.totalCommissionEarned), icon: Link2 },
          { label: "Pending (Month End)", value: formatCurrency(data.stats.totalCommissionPending), icon: Clock },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <stat.icon className="h-5 w-5 text-violet-600" />
            <p className="mt-3 text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-xs text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Monthly history */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-900">Monthly target history</h2>
          <p className="mt-1 text-xs text-slate-500">
            Each month requires at least {data.monthlyTarget.requiredPerMonth} qualified client with same-month
            deposit approval and profit withdrawal.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs text-slate-500">
                <th className="px-5 py-3">Month</th>
                <th className="px-5 py-3">Target</th>
                <th className="px-5 py-3">Qualified</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {[...data.monthlyTargets].reverse().map((m) => (
                <tr
                  key={m.key}
                  className={cn("border-b border-slate-100", m.isCurrentMonth && "bg-violet-50/50")}
                >
                  <td className="px-5 py-3 font-medium text-slate-900">
                    {m.label}
                    {m.isCurrentMonth && (
                      <span className="ml-2 rounded-full bg-violet-100 px-2 py-0.5 text-xs text-violet-700">
                        Current
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3">{m.target}</td>
                  <td className="px-5 py-3">{m.qualified}</td>
                  <td className="px-5 py-3">
                    {m.met ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Met
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-700">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        {m.isCurrentMonth ? "In progress" : "Not met"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-900">Your Referred Clients</h2>
          <p className="mt-1 text-xs text-slate-500">
            Commission is 3% of the first approved opening deposit, payable after that month ends. Monthly
            target requires same-month profit withdrawal.
          </p>
        </div>
        {data.referrals.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-500">
            No referrals yet. Clients must sign up with your code or link to appear here.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs text-slate-500">
                  <th className="px-5 py-3">Client</th>
                  <th className="px-5 py-3">KYC</th>
                  <th className="px-5 py-3">First Deposit</th>
                  <th className="px-5 py-3">Commission (3%)</th>
                  <th className="px-5 py-3">Monthly target</th>
                  <th className="px-5 py-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {data.referrals.map((r) => (
                  <tr key={r.id} className="border-b border-slate-100">
                    <td className="px-5 py-3">
                      <p className="font-medium text-slate-900">{r.name}</p>
                      <p className="text-xs text-slate-500">{r.email}</p>
                    </td>
                    <td className="px-5 py-3 capitalize">{r.kycStatus}</td>
                    <td className="px-5 py-3">
                      <p>{r.firstDepositAmount > 0 ? formatCurrency(r.firstDepositAmount) : "—"}</p>
                      <p className="text-xs text-slate-500">{depositStatusLabel(r.firstDepositStatus)}</p>
                    </td>
                    <td className="px-5 py-3">
                      {r.commissionAmount > 0 ? (
                        <>
                          <p className="font-medium text-violet-700">{formatCurrency(r.commissionAmount)}</p>
                          <p className="text-xs text-slate-500">
                            {commissionStatusLabel(r.commissionStatus, r.commissionPayableOn)}
                          </p>
                        </>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-xs">
                      {r.countsTowardCurrentMonthTarget ? (
                        <span className="font-medium text-emerald-700">Counts this month</span>
                      ) : r.pendingCurrentMonthTarget ? (
                        <span className="text-amber-700">Needs profit withdrawal</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-slate-500">{new Date(r.createdAt).toLocaleDateString()}</td>
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
