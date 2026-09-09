"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface ReferralPoint {
  createdAt: string;
  firstDepositAmount: number;
  firstDepositStatus: string;
  commissionAmount: number;
  commissionEarned: number;
  firstDepositApprovedAt: string | null;
}

interface ManagerGrowthChartsProps {
  referrals: ReferralPoint[];
  monthlyTargets: { key: string; label: string; qualified: number; target: number; met: boolean }[];
}

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
}

export function ManagerGrowthCharts({ referrals, monthlyTargets }: ManagerGrowthChartsProps) {
  const growthSeries = useMemo(() => {
    const map = new Map<
      string,
      { key: string; referrals: number; deposits: number; commission: number }
    >();

    for (const r of referrals) {
      const joinKey = monthKey(new Date(r.createdAt));
      const join = map.get(joinKey) ?? {
        key: joinKey,
        referrals: 0,
        deposits: 0,
        commission: 0,
      };
      join.referrals += 1;
      map.set(joinKey, join);

      if (r.firstDepositStatus === "approved" && r.firstDepositApprovedAt) {
        const depKey = monthKey(new Date(r.firstDepositApprovedAt));
        const dep = map.get(depKey) ?? {
          key: depKey,
          referrals: 0,
          deposits: 0,
          commission: 0,
        };
        dep.deposits += r.firstDepositAmount;
        dep.commission += r.commissionAmount;
        map.set(depKey, dep);
      }
    }

    const keys = [...map.keys()].sort();
    // Ensure at least last 6 months for empty charts
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const k = monthKey(d);
      if (!map.has(k)) {
        map.set(k, { key: k, referrals: 0, deposits: 0, commission: 0 });
        keys.push(k);
      }
    }

    const sorted = [...new Set(keys)].sort();
    let cumClients = 0;
    let cumCommission = 0;
    return sorted.map((key) => {
      const row = map.get(key)!;
      cumClients += row.referrals;
      cumCommission += row.commission;
      return {
        label: monthLabel(key),
        referrals: row.referrals,
        deposits: Math.round(row.deposits),
        commission: Math.round(row.commission * 100) / 100,
        cumulativeClients: cumClients,
        cumulativeCommission: Math.round(cumCommission * 100) / 100,
      };
    });
  }, [referrals]);

  const targetBars = useMemo(
    () =>
      [...monthlyTargets].map((m) => ({
        label: m.label.replace(/(\w+)\s+(\d{4})/, (_, month, year) => `${month.slice(0, 3)} '${String(year).slice(2)}`),
        qualified: m.qualified,
        target: m.target,
        met: m.met ? 1 : 0,
      })),
    [monthlyTargets]
  );

  const tipStyle = {
    backgroundColor: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: 8,
    fontSize: 12,
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="font-semibold text-slate-900">Client and commission growth</h3>
          <p className="text-xs text-slate-500">
            Cumulative referred clients and commission accrued by month
          </p>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={growthSeries}>
              <defs>
                <linearGradient id="baClients" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0d9488" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#0d9488" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="baComm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0369a1" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#0369a1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#64748b" }} allowDecimals={false} />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11, fill: "#64748b" }}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip
                contentStyle={tipStyle}
                labelStyle={{ color: "#94a3b8" }}
                formatter={(value, name) => {
                  const n = Number(value ?? 0);
                  if (String(name).toLowerCase().includes("commission")) {
                    return [formatCurrency(n), "Cumulative commission"];
                  }
                  return [n, "Cumulative clients"];
                }}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="cumulativeClients"
                name="Clients"
                stroke="#0d9488"
                fill="url(#baClients)"
                strokeWidth={2}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="cumulativeCommission"
                name="Commission"
                stroke="#0369a1"
                fill="url(#baComm)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="font-semibold text-slate-900">Monthly qualification results</h3>
          <p className="text-xs text-slate-500">
            Qualified clients against the required monthly target
          </p>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={targetBars}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} allowDecimals={false} />
              <Tooltip contentStyle={tipStyle} labelStyle={{ color: "#94a3b8" }} />
              <Bar dataKey="target" name="Target" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="qualified" name="Qualified" fill="#0d9488" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
        <div className="mb-4">
          <h3 className="font-semibold text-slate-900">Opening deposits by month</h3>
          <p className="text-xs text-slate-500">
            First approved deposits from clients under this referral code
          </p>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={growthSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis
                tick={{ fontSize: 11, fill: "#64748b" }}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={tipStyle}
                labelStyle={{ color: "#94a3b8" }}
                formatter={(value) => [formatCurrency(Number(value ?? 0)), "Deposits"]}
              />
              <Bar dataKey="deposits" name="Deposits" fill="#0f766e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
