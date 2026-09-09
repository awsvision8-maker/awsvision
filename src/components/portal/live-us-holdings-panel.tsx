"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, Landmark, LineChart, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MobileDataCard } from "@/components/ui/mobile-data-card";
import { SectorAllocationChart } from "@/components/charts/investment-charts";
import { buildUsHoldingsForPortfolio } from "@/lib/us-growth-holdings";
import { formatCurrency, formatPercent } from "@/lib/utils";

interface LiveAccountInput {
  id: string;
  label?: string;
  balance: number;
  annualReturnPercent: number;
}

interface LiveUsHoldingsPanelProps {
  accounts: LiveAccountInput[];
  invested: boolean;
}

export function LiveUsHoldingsPanel({ accounts, invested }: LiveUsHoldingsPanelProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const { holdings, sectorAllocation, assetClassAllocation, regionAllocation } =
    useMemo(
      () =>
        buildUsHoldingsForPortfolio({
          accounts: invested ? accounts.filter((a) => a.balance > 0) : [],
          asOf: now,
        }),
      [accounts, invested, now]
    );

  const liveTotal = holdings.reduce((s, h) => s + h.value, 0);
  const byAccount = useMemo(() => {
    const map = new Map<string, typeof holdings>();
    for (const h of holdings) {
      const key = h.accountId ?? "portfolio";
      const list = map.get(key) ?? [];
      list.push(h);
      map.set(key, list);
    }
    return [...map.entries()];
  }, [holdings]);

  if (!invested) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio holdings</CardTitle>
          <p className="text-sm text-slate-500">
            Holdings appear after your deposit is approved.
          </p>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-teal-200 bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 p-5 text-white sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-300">
              United States
            </p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
              Portfolio holdings
            </h3>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-right backdrop-blur">
            <p className="flex items-center justify-end gap-1.5 text-[11px] uppercase tracking-wide text-slate-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Invested value
            </p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-teal-300">
              {formatCurrency(liveTotal)}
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {[
            { icon: LineChart, label: "US equities", hint: "Blue-chip companies" },
            { icon: Landmark, label: "Bonds", hint: "US fixed income" },
            { icon: TrendingUp, label: "Yields", hint: "Dividend sleeves" },
            { icon: Building2, label: "Real estate", hint: "US REITs" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2"
            >
              <item.icon className="h-4 w-4 text-teal-300" />
              <div>
                <p className="text-xs font-semibold text-white">{item.label}</p>
                <p className="text-[10px] text-slate-400">{item.hint}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectorAllocationChart data={sectorAllocation} invested={invested} />
        </div>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Asset mix</CardTitle>
            <p className="text-sm text-slate-500">Equity · bond · yield · REIT</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {assetClassAllocation.map((row) => (
              <div key={row.name}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium text-slate-700">{row.name}</span>
                  <span className="tabular-nums text-slate-500">{row.value}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min(100, row.value)}%`,
                      backgroundColor: row.color,
                    }}
                  />
                </div>
              </div>
            ))}
            <p className="pt-2 text-xs text-slate-500">
              Geography: {regionAllocation.map((r) => `${r.name} ${r.value}%`).join(" · ")}
            </p>
          </CardContent>
        </Card>
      </div>

      {byAccount.map(([accountId, rows]) => {
        const label = rows[0]?.accountLabel ?? "Account";
        const subtotal = rows.reduce((s, h) => s + h.value, 0);
        return (
          <Card key={accountId}>
            <CardHeader>
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <CardTitle>Holdings · {label}</CardTitle>
                  <p className="text-sm text-slate-500">
                    {rows.length} positions · current market value
                  </p>
                </div>
                <p className="text-sm font-semibold tabular-nums text-teal-700">
                  {formatCurrency(subtotal)}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 md:hidden">
                {rows.map((h) => (
                  <MobileDataCard
                    key={h.id}
                    title={h.name}
                    badge={<Badge variant="default">{h.symbol}</Badge>}
                    fields={[
                      { label: "Class", value: h.assetClass ?? "Equity" },
                      { label: "Sector", value: h.sector },
                      { label: "Region", value: h.region },
                      { label: "Allocation", value: `${h.allocation}%` },
                      {
                        label: "Value",
                        value: formatCurrency(h.value),
                        highlight: true,
                      },
                      {
                        label: "Monthly",
                        value: `+${formatPercent(h.monthlyReturn)}`,
                        highlight: true,
                      },
                    ]}
                  />
                ))}
              </div>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[720px] text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left">
                      <th className="pb-3 pr-4 font-medium text-slate-500">Investment</th>
                      <th className="pb-3 pr-4 font-medium text-slate-500">Symbol</th>
                      <th className="pb-3 pr-4 font-medium text-slate-500">Class</th>
                      <th className="pb-3 pr-4 font-medium text-slate-500">Sector</th>
                      <th className="pb-3 pr-4 font-medium text-slate-500 text-right">
                        Allocation
                      </th>
                      <th className="pb-3 pr-4 font-medium text-slate-500 text-right">
                        Value
                      </th>
                      <th className="pb-3 font-medium text-slate-500 text-right">
                        Monthly
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((h) => (
                      <tr key={h.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="py-3.5 pr-4 font-medium text-slate-900">{h.name}</td>
                        <td className="py-3.5 pr-4">
                          <Badge variant="default">{h.symbol}</Badge>
                        </td>
                        <td className="py-3.5 pr-4 text-slate-600">{h.assetClass}</td>
                        <td className="py-3.5 pr-4 text-slate-600">{h.sector}</td>
                        <td className="py-3.5 pr-4 text-right font-medium">
                          {h.allocation}%
                        </td>
                        <td className="py-3.5 pr-4 text-right font-semibold tabular-nums text-teal-700">
                          {formatCurrency(h.value)}
                        </td>
                        <td className="py-3.5 text-right text-emerald-600">
                          +{formatPercent(h.monthlyReturn)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
