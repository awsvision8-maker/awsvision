"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  DollarSign,
  Clock,
  Target,
  Users,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ManagerGrowthCharts } from "@/components/manager/manager-growth-charts";
import { formatCurrency, cn } from "@/lib/utils";
import { useManagerDashboard } from "@/lib/use-manager-dashboard";

export default function ManagerDashboardPage() {
  const { data, loading } = useManagerDashboard();
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const copyLink = async () => {
    if (!data) return;
    await navigator.clipboard.writeText(data.ambassador.referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || !data) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  const current = data.currentMonth;
  const progressPct = current
    ? Math.min(100, (current.qualified / Math.max(current.target, 1)) * 100)
    : 0;

  const kpis = [
    {
      label: "Referred clients",
      value: String(data.stats.totalReferrals),
      hint: `${data.stats.activeClients} with approved deposits`,
      icon: Users,
      accent: "from-teal-600 to-teal-800",
    },
    {
      label: "Opening deposits",
      value: formatCurrency(data.stats.totalFirstDeposits),
      hint: "Total first deposits approved",
      icon: Wallet,
      accent: "from-slate-700 to-slate-900",
    },
    {
      label: "Commission earned",
      value: formatCurrency(data.stats.totalCommissionEarned),
      hint: `Rate ${data.ambassador.commissionRatePercent}% · month closed`,
      icon: DollarSign,
      accent: "from-emerald-600 to-emerald-800",
    },
    {
      label: "Commission pending",
      value: formatCurrency(data.stats.totalCommissionPending),
      hint: "Payable after deposit month ends",
      icon: Clock,
      accent: "from-sky-700 to-sky-900",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 p-6 text-white shadow-xl sm:p-8">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(45,212,191,0.25), transparent 40%), radial-gradient(circle at 80% 0%, rgba(14,165,233,0.2), transparent 35%)",
          }}
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">
              Account overview
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              {data.ambassador.firstName} {data.ambassador.lastName ?? ""}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">
              Portfolio summary for your referral book — deposits, commission status, and monthly
              qualification progress.
            </p>
            <p className="mt-4 font-mono text-xs text-slate-400">
              {now.toLocaleString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:min-w-[280px]">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-300">
              Referral enrollment link
            </p>
            <p className="mt-2 break-all text-xs text-slate-200">{data.ambassador.referralUrl}</p>
            <p className="mt-2 text-sm">
              Code{" "}
              <strong className="font-mono text-teal-300">{data.ambassador.referralCode}</strong>
              <span className="text-slate-500"> · </span>
              <span className="text-slate-300">
                {data.ambassador.commissionRatePercent}% of first approved deposit
              </span>
            </p>
            <Button
              type="button"
              size="sm"
              className="mt-3 bg-teal-500 text-slate-950 hover:bg-teal-400"
              onClick={() => void copyLink()}
            >
              <Copy className="h-4 w-4" />
              {copied ? "Copied" : "Copy enrollment link"}
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <div className={cn("h-1.5 bg-gradient-to-r", kpi.accent)} />
            <div className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {kpi.label}
                </p>
                <kpi.icon className="h-4 w-4 text-teal-700" />
              </div>
              <p className="mt-2 text-2xl font-bold tabular-nums text-slate-900">{kpi.value}</p>
              <p className="mt-1 text-xs text-slate-500">{kpi.hint}</p>
            </div>
          </div>
        ))}
      </div>

      {current && (
        <div
          className={cn(
            "rounded-2xl border-2 p-6 shadow-sm",
            current.met
              ? "border-emerald-300 bg-gradient-to-br from-emerald-50 to-white"
              : "border-amber-300 bg-gradient-to-br from-amber-50 to-white"
          )}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-3">
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white",
                  current.met ? "bg-emerald-600" : "bg-amber-500"
                )}
              >
                {current.met ? <CheckCircle2 className="h-6 w-6" /> : <Target className="h-6 w-6" />}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Monthly qualification target
                </p>
                <h2 className="text-xl font-bold text-slate-900">{current.label}</h2>
                <p className="mt-1 text-sm text-slate-600">
                  {current.qualified} of {current.target} client
                  {current.target === 1 ? "" : "s"} qualified
                  {current.met
                    ? ". Target met for this period."
                    : ". Additional qualified activity required."}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black tabular-nums text-slate-900">
                {current.qualified}/{current.target}
              </p>
              <p className="text-xs text-slate-500">Qualified this month</p>
            </div>
          </div>

          <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/80">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                current.met ? "bg-emerald-500" : "bg-amber-500"
              )}
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <ul className="mt-5 space-y-2 text-sm text-slate-700">
            {data.monthlyTarget.rules.map((rule) => (
              <li key={rule} className="flex gap-2">
                <span className="text-teal-600">•</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>

          {current.pendingClients.length > 0 && (
            <div className="mt-5 rounded-xl border border-amber-200 bg-white/90 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-amber-900">
                <AlertTriangle className="h-4 w-4" />
                Deposit approved — pending qualification ({current.pendingClients.length})
              </p>
              <p className="mt-1 text-xs text-amber-800">
                These clients completed an opening deposit this month. They count toward the monthly
                target only after an approved profit withdrawal in the same calendar month.
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
            <div className="mt-4 rounded-xl border border-emerald-200 bg-white/90 p-4">
              <p className="text-sm font-semibold text-emerald-900">
                Qualified for {current.label}
              </p>
              <ul className="mt-2 space-y-2">
                {current.qualifiedClients.map((c) => (
                  <li key={c.id} className="text-sm text-slate-700">
                    <strong>{c.name}</strong>
                    {c.profitWithdrawnAmount
                      ? ` · ${formatCurrency(c.profitWithdrawnAmount)} withdrawn`
                      : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <ManagerGrowthCharts referrals={data.referrals} monthlyTargets={data.monthlyTargets} />
    </div>
  );
}
