"use client";

import { useEffect, useId, useMemo, useState } from "react";
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Clock, Sparkles, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  computePromoDailyCompound,
  type PromoDailyCompoundResult,
} from "@/lib/promo-daily-compound";
import { formatCurrency, formatDate } from "@/lib/utils";

function formatCountdown(ms: number | null): string {
  if (ms == null || ms <= 0) return "00:00:00";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  if (h >= 24) {
    const d = Math.floor(h / 24);
    return `${d}d ${pad(h % 24)}:${pad(m)}:${pad(s)}`;
  }
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function formatAxisCurrency(value: number) {
  const n = Number(value);
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(n >= 10_000 ? 1 : 2)}k`;
  return `$${n.toFixed(0)}`;
}

type ChartPoint = {
  day: number;
  label: string;
  balance: number;
  profit: number;
  cumulativeProfit: number;
  growthPercent: number;
  date: string;
};

function DailyGrowthTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: ChartPoint }[];
}) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;

  return (
    <div className="min-w-[220px] rounded-xl border border-white/10 bg-slate-950/95 px-3.5 py-3 shadow-2xl shadow-teal-950/40 backdrop-blur-md">
      <div className="mb-2 flex items-center justify-between gap-3 border-b border-white/10 pb-2">
        <p className="text-sm font-semibold text-white">Day {p.day}</p>
        <span className="rounded-md bg-teal-500/15 px-1.5 py-0.5 text-[10px] font-medium text-teal-300">
          +{p.growthPercent.toFixed(2)}%
        </span>
      </div>
      <div className="space-y-1.5 text-xs text-slate-300">
        <div className="flex justify-between gap-6">
          <span>Balance</span>
          <span className="font-semibold tabular-nums text-teal-300">
            {formatCurrency(p.balance)}
          </span>
        </div>
        <div className="flex justify-between gap-6">
          <span>Day profit</span>
          <span className="font-medium tabular-nums text-emerald-400">
            +{formatCurrency(p.profit)}
          </span>
        </div>
        <div className="flex justify-between gap-6">
          <span>Total profit</span>
          <span className="font-medium tabular-nums text-amber-300">
            +{formatCurrency(p.cumulativeProfit)}
          </span>
        </div>
        <p className="pt-1 text-[10px] text-slate-500">{formatDate(p.date)}</p>
      </div>
    </div>
  );
}

interface PromoDailyCompoundPanelProps {
  seed: PromoDailyCompoundResult;
  accountLabel?: string;
}

export function PromoDailyCompoundPanel({
  seed,
  accountLabel,
}: PromoDailyCompoundPanelProps) {
  const [now, setNow] = useState(() => new Date());
  const barGradientId = useId().replace(/:/g, "");

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const live = useMemo(
    () =>
      computePromoDailyCompound({
        principal: seed.principal,
        startDate: seed.startDate,
        endDate: seed.endDate,
        active: seed.active,
        dailyRatePercent: seed.dailyRatePercent,
        asOf: now,
      }),
    [seed, now]
  );

  const chartData = useMemo<ChartPoint[]>(() => {
    return live.history.map((h) => {
      const cumulativeProfit = Math.round((h.endBalance - live.principal) * 100) / 100;
      const growthPercent =
        live.principal > 0
          ? Math.round((cumulativeProfit / live.principal) * 10000) / 100
          : 0;
      return {
        day: h.day,
        label: `${h.day}`,
        balance: h.endBalance,
        profit: h.profit,
        cumulativeProfit,
        growthPercent,
        date: h.date,
      };
    });
  }, [live.history, live.principal]);

  const yDomain = useMemo(() => {
    if (chartData.length === 0) return [0, 1] as [number, number];
    const values = chartData.map((d) => d.balance);
    const min = Math.min(live.principal, ...values);
    const max = Math.max(...values);
    const span = Math.max(max - min, live.principal * 0.004);
    const pad = span * 0.35;
    return [Math.max(0, min - pad), max + pad] as [number, number];
  }, [chartData, live.principal]);

  const growthPct =
    live.principal > 0
      ? Math.round((live.totalProfit / live.principal) * 10000) / 100
      : 0;

  if (!seed.active) return null;

  const waiting = !live.started;
  const lastPoint = chartData[chartData.length - 1];

  return (
    <Card className="relative overflow-hidden border-teal-900/40 bg-gradient-to-br from-[#07131a] via-[#0a1620] to-[#0c1f24] text-white shadow-[0_24px_80px_-32px_rgba(13,148,136,0.45)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />
      <CardHeader className="relative pb-2">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/20 bg-teal-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-teal-300">
              <Sparkles className="h-3 w-3" />
              Wealth Accelerator
            </div>
            <CardTitle className="mt-2.5 text-xl font-semibold tracking-tight text-white sm:text-2xl">
              {accountLabel ?? "Promo FD"}
              <span className="ml-2 text-base font-normal text-teal-300/90">
                {live.dailyRatePercent}% daily compound
              </span>
            </CardTitle>
            <p className="mt-1.5 text-sm text-slate-400">
              {waiting
                ? `First profit credits on ${formatDate(live.firstProfitDate)} (day after start)`
                : `Day ${live.dayNumber}${
                    live.totalProgramDays ? ` of ${live.totalProgramDays}` : ""
                  } · Started ${formatDate(live.startDate)}`}
              {live.endDate ? ` · Ends ${formatDate(live.endDate)}` : ""}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center shadow-inner backdrop-blur">
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-400">
              <Clock className="h-3.5 w-3.5 text-amber-300/90" />
              {waiting
                ? "Until first profit"
                : live.liveAccruing
                  ? "Live accruing"
                  : "Next daily credit"}
            </div>
            <p className="mt-1 font-mono text-2xl font-semibold tracking-tight text-amber-300 tabular-nums sm:text-[1.7rem]">
              {formatCountdown(live.msUntilNextCredit)}
            </p>
            {live.liveAccruing && live.perMinuteProfit > 0 && (
              <p className="mt-1 text-[10px] font-medium text-teal-300/80">
                ~{formatCurrency(live.perMinuteProfit)}/min today
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent px-4 py-3.5">
            <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Live balance
              {live.liveAccruing && (
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
              )}
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums text-white sm:text-[1.65rem]">
              {formatCurrency(live.balance)}
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-500/15 bg-gradient-to-b from-emerald-500/10 to-transparent px-4 py-3.5">
            <p className="text-[11px] font-medium uppercase tracking-wide text-emerald-300/80">
              Total profit
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums text-emerald-400 sm:text-[1.65rem]">
              +{formatCurrency(live.totalProfit)}
            </p>
            {!waiting && (
              <p className="mt-0.5 text-xs font-medium text-emerald-300/70">
                +{growthPct.toFixed(2)}% on capital
              </p>
            )}
          </div>
          <div className="rounded-2xl border border-teal-500/15 bg-gradient-to-b from-teal-500/10 to-transparent px-4 py-3.5">
            <p className="text-[11px] font-medium uppercase tracking-wide text-teal-300/80">
              {waiting
                ? "Principal"
                : live.liveAccruing
                  ? "Accruing today"
                  : "Latest day profit"}
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums text-teal-300 sm:text-[1.65rem]">
              {waiting
                ? formatCurrency(live.principal)
                : `+${formatCurrency(live.liveAccruing ? live.accruedToday : live.latestDayProfit)}`}
            </p>
            {live.liveAccruing && live.dayTargetProfit > 0 && (
              <p className="mt-0.5 text-xs font-medium text-teal-300/70">
                of {formatCurrency(live.dayTargetProfit)} today
              </p>
            )}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#050d12]/80 p-3 sm:p-5">
          <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-teal-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                <TrendingUp className="h-4 w-4 text-teal-400" />
                Compounding trajectory
              </div>
              <p className="mt-0.5 text-xs text-slate-500">
                {live.liveAccruing
                  ? `Live minute accrual of today's ${live.dailyRatePercent}% · settles at day end`
                  : `Daily balance blocks at ${live.dailyRatePercent}% · scale zoomed to growth`}
              </p>
            </div>
            {lastPoint && (
              <div className="flex items-center gap-3 text-right">
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-500">
                    Current
                  </p>
                  <p className="font-semibold tabular-nums text-teal-300">
                    {formatCurrency(lastPoint.balance)}
                  </p>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-500">
                    Growth
                  </p>
                  <p className="font-semibold tabular-nums text-emerald-400">
                    +{lastPoint.growthPercent.toFixed(2)}%
                  </p>
                </div>
              </div>
            )}
          </div>

          {chartData.length === 0 ? (
            <div className="relative flex h-56 items-center justify-center text-sm text-slate-400">
              Chart unlocks when the first daily profit credits
              {waiting ? ` on ${formatDate(live.firstProfitDate)}` : ""}.
            </div>
          ) : (
            <div className="relative h-64 w-full sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={chartData}
                  margin={{ top: 12, right: 12, left: 4, bottom: 4 }}
                >
                  <defs>
                    <linearGradient id={barGradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#5eead4" stopOpacity={1} />
                      <stop offset="55%" stopColor="#14b8a6" stopOpacity={0.92} />
                      <stop offset="100%" stopColor="#0f766e" stopOpacity={0.75} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="2 8"
                    stroke="#1e293b"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: "#1e293b" }}
                    tickFormatter={(v) => `D${v}`}
                    interval="preserveStartEnd"
                    minTickGap={28}
                  />
                  <YAxis
                    domain={yDomain}
                    tickFormatter={formatAxisCurrency}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    width={58}
                    tickCount={5}
                  />
                  <Tooltip
                    content={<DailyGrowthTooltip />}
                    cursor={{ fill: "rgba(45, 212, 191, 0.08)" }}
                  />
                  <ReferenceLine
                    y={live.principal}
                    stroke="#64748b"
                    strokeDasharray="5 5"
                    strokeOpacity={0.55}
                    label={{
                      value: "Principal",
                      position: "insideTopLeft",
                      fill: "#94a3b8",
                      fontSize: 10,
                    }}
                  />
                  <Bar
                    dataKey="balance"
                    fill={`url(#${barGradientId})`}
                    radius={[6, 6, 2, 2]}
                    maxBarSize={36}
                    isAnimationActive={!live.liveAccruing}
                    animationDuration={800}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`bar-${entry.day}`}
                        fillOpacity={index === chartData.length - 1 ? 1 : 0.78}
                        stroke={index === chartData.length - 1 ? "#99f6e4" : "transparent"}
                        strokeWidth={index === chartData.length - 1 ? 1.5 : 0}
                      />
                    ))}
                  </Bar>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="relative mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-3 text-[11px] text-slate-500">
            <span>
              Principal baseline {formatCurrency(live.principal)}
              {live.liveAccruing
                ? ` · settled ${formatCurrency(live.settledBalance)} + live today`
                : " · compound daily"}
            </span>
            {live.msUntilEnd != null && live.endsAt && (
              <span>
                Program ends in{" "}
                <span className="font-mono font-medium text-slate-300">
                  {formatCountdown(live.msUntilEnd)}
                </span>
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
