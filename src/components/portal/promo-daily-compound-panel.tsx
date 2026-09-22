"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
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
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  Clock,
  Landmark,
  LineChart,
  Minus,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import {
  computePromoBankMarketLive,
  type MarketDayPoint,
  type PromoBankMarketLiveResult,
} from "@/lib/promo-bank-market-live";
import type { PromoDailyCompoundResult } from "@/lib/promo-daily-compound";
import { FD_PROMO_DEFAULTS } from "@/lib/promotions";

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

function signedCurrency(n: number) {
  const abs = formatCurrency(Math.abs(n));
  if (n > 0) return `+${abs}`;
  if (n < 0) return `−${abs}`;
  return abs;
}

type ChartPoint = {
  day: number;
  label: string;
  balance: number;
  profit: number;
  cumulativeProfit: number;
  growthPercent: number;
  date: string;
  positive: boolean;
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
        <span
          className={cn(
            "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
            p.positive
              ? "bg-emerald-500/15 text-emerald-300"
              : "bg-rose-500/15 text-rose-300"
          )}
        >
          {p.positive ? "+" : ""}
          {p.growthPercent.toFixed(2)}% cum.
        </span>
      </div>
      <div className="space-y-1.5 text-xs text-slate-300">
        <div className="flex justify-between gap-6">
          <span>Mark balance</span>
          <span className="font-semibold tabular-nums text-teal-300">
            {formatCurrency(p.balance)}
          </span>
        </div>
        <div className="flex justify-between gap-6">
          <span>Day P&amp;L</span>
          <span
            className={cn(
              "font-medium tabular-nums",
              p.profit >= 0 ? "text-emerald-400" : "text-rose-400"
            )}
          >
            {signedCurrency(p.profit)}
          </span>
        </div>
        <div className="flex justify-between gap-6">
          <span>Total P&amp;L</span>
          <span
            className={cn(
              "font-medium tabular-nums",
              p.cumulativeProfit >= 0 ? "text-amber-300" : "text-rose-300"
            )}
          >
            {signedCurrency(p.cumulativeProfit)}
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
  const [overlays, setOverlays] = useState<Record<string, number>>({});
  const [tickTrail, setTickTrail] = useState<{ t: number; v: number }[]>([]);
  const barGradientUp = useId().replace(/:/g, "") + "-up";
  const barGradientDown = useId().replace(/:/g, "") + "-dn";
  const prevBalance = useRef<number | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/promo/market-live");
        const json = await res.json();
        if (!cancelled && json?.overlays) setOverlays(json.overlays);
      } catch {
        /* offline — synthetic macros still run */
      }
    };
    load();
    const id = window.setInterval(load, 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  const live: PromoBankMarketLiveResult = useMemo(
    () =>
      computePromoBankMarketLive({
        principal: seed.principal,
        startDate: seed.startDate,
        endDate: seed.endDate,
        active: seed.active,
        dailyRatePercent: seed.dailyRatePercent,
        asOf: now,
        programReturnPercent: FD_PROMO_DEFAULTS.returnPercent,
        termMonths: FD_PROMO_DEFAULTS.termMonths,
        marketOverlays: overlays,
      }),
    [seed, now, overlays]
  );

  useEffect(() => {
    setTickTrail((prev) => {
      const next = [...prev, { t: now.getTime(), v: live.secondDelta }];
      return next.slice(-48);
    });
    prevBalance.current = live.displayBalance;
  }, [now, live.displayBalance, live.secondDelta]);

  const chartData = useMemo<ChartPoint[]>(() => {
    return live.history.map((h: MarketDayPoint) => {
      const growthPercent =
        live.program.principal > 0
          ? Math.round((h.cumulativeProfit / live.program.principal) * 10000) / 100
          : 0;
      return {
        day: h.day,
        label: `${h.day}`,
        balance: h.markBalance,
        profit: h.dayProfit,
        cumulativeProfit: h.cumulativeProfit,
        growthPercent,
        date: h.date,
        positive: h.dayProfit >= 0,
      };
    });
  }, [live.history, live.program.principal]);

  const yDomain = useMemo(() => {
    if (chartData.length === 0) return [0, 1] as [number, number];
    const values = chartData.map((d) => d.balance);
    const min = Math.min(live.program.principal, ...values);
    const max = Math.max(...values);
    const span = Math.max(max - min, live.program.principal * 0.004);
    const pad = span * 0.35;
    return [Math.max(0, min - pad), max + pad] as [number, number];
  }, [chartData, live.program.principal]);

  const growthPct =
    live.program.principal > 0
      ? Math.round((live.displayProfit / live.program.principal) * 10000) / 100
      : 0;

  if (!seed.active) return null;

  const waiting = !live.program.started;
  const lastPoint = chartData[chartData.length - 1];
  const tickUp = live.secondDelta > 0;
  const tickDown = live.secondDelta < 0;

  return (
    <Card className="relative overflow-hidden border-teal-900/40 bg-gradient-to-br from-[#07131a] via-[#0a1620] to-[#0c1f24] text-white shadow-[0_24px_80px_-32px_rgba(13,148,136,0.45)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />
      <CardHeader className="relative pb-2">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-400/20 bg-teal-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-teal-300">
              <Sparkles className="h-3 w-3" />
              Wealth Accelerator · Bank treasury book
            </div>
            <CardTitle className="mt-2.5 text-xl font-semibold tracking-tight text-white sm:text-2xl">
              {accountLabel ?? "Promo FD"}
              <span className="ml-2 text-base font-normal text-teal-300/90">
                {live.programReturnPercent}% / {live.termMonths} mo target
              </span>
            </CardTitle>
            <p className="mt-1.5 max-w-xl text-sm text-slate-400">
              {waiting
                ? `First mark on ${formatDate(live.program.firstProfitDate)} — capital staged like a bank book (yields, Treasuries, bonds, indices, RE).`
                : `Day ${live.program.dayNumber}${
                    live.program.totalProgramDays
                      ? ` of ${live.program.totalProgramDays}`
                      : ""
                  } · Live +/− marks on bank investment sleeves · Program settles to ${live.programReturnPercent}% by term end`}
              {live.program.endDate ? ` · Ends ${formatDate(live.program.endDate)}` : ""}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center shadow-inner backdrop-blur">
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-400">
              <Clock className="h-3.5 w-3.5 text-amber-300/90" />
              {waiting
                ? "Until first mark"
                : live.program.liveAccruing
                  ? "Live market clock"
                  : "Next session"}
            </div>
            <p className="mt-1 font-mono text-2xl font-semibold tracking-tight text-amber-300 tabular-nums sm:text-[1.7rem]">
              {formatCountdown(live.program.msUntilNextCredit)}
            </p>
            <p className="mt-1 text-[10px] font-medium text-slate-400">
              Target path {live.program.dailyRatePercent}%/day compound
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-5">
        {/* Hero KPIs */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent px-4 py-3.5 sm:col-span-2 lg:col-span-1">
            <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Live mark
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
            </p>
            <p
              className={cn(
                "mt-1 text-2xl font-semibold tracking-tight tabular-nums sm:text-[1.65rem]",
                tickUp && "text-emerald-300",
                tickDown && "text-rose-300",
                !tickUp && !tickDown && "text-white"
              )}
            >
              {formatCurrency(live.displayBalance)}
            </p>
            <p
              className={cn(
                "mt-0.5 flex items-center gap-1 text-xs font-semibold tabular-nums",
                tickUp && "text-emerald-400",
                tickDown && "text-rose-400",
                !tickUp && !tickDown && "text-slate-500"
              )}
            >
              {tickUp ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : tickDown ? (
                <ArrowDownRight className="h-3.5 w-3.5" />
              ) : (
                <Minus className="h-3.5 w-3.5" />
              )}
              {signedCurrency(live.secondDelta)} this second
            </p>
          </div>

          <div
            className={cn(
              "rounded-2xl border px-4 py-3.5",
              live.displayProfit >= 0
                ? "border-emerald-500/15 bg-gradient-to-b from-emerald-500/10 to-transparent"
                : "border-rose-500/15 bg-gradient-to-b from-rose-500/10 to-transparent"
            )}
          >
            <p
              className={cn(
                "text-[11px] font-medium uppercase tracking-wide",
                live.displayProfit >= 0 ? "text-emerald-300/80" : "text-rose-300/80"
              )}
            >
              Mark P&amp;L
            </p>
            <p
              className={cn(
                "mt-1 text-2xl font-semibold tracking-tight tabular-nums sm:text-[1.65rem]",
                live.displayProfit >= 0 ? "text-emerald-400" : "text-rose-400"
              )}
            >
              {signedCurrency(live.displayProfit)}
            </p>
            {!waiting && (
              <p
                className={cn(
                  "mt-0.5 text-xs font-medium",
                  growthPct >= 0 ? "text-emerald-300/70" : "text-rose-300/70"
                )}
              >
                {growthPct >= 0 ? "+" : ""}
                {growthPct.toFixed(2)}% on capital
              </p>
            )}
          </div>

          <div
            className={cn(
              "rounded-2xl border px-4 py-3.5",
              live.dayMarkPnl >= 0
                ? "border-teal-500/15 bg-gradient-to-b from-teal-500/10 to-transparent"
                : "border-rose-500/20 bg-gradient-to-b from-rose-500/10 to-transparent"
            )}
          >
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Today&apos;s session
            </p>
            <p
              className={cn(
                "mt-1 text-2xl font-semibold tracking-tight tabular-nums sm:text-[1.65rem]",
                live.dayMarkPnl >= 0 ? "text-teal-300" : "text-rose-300"
              )}
            >
              {signedCurrency(live.dayMarkPnl)}
            </p>
            <p className="mt-0.5 text-xs font-medium text-slate-500">
              Plus &amp; minus vs open mark
            </p>
          </div>

          <div className="rounded-2xl border border-amber-500/15 bg-gradient-to-b from-amber-500/10 to-transparent px-4 py-3.5">
            <p className="text-[11px] font-medium uppercase tracking-wide text-amber-300/80">
              Program target
            </p>
            <p className="mt-1 text-2xl font-semibold tracking-tight tabular-nums text-amber-200 sm:text-[1.65rem]">
              {formatCurrency(live.targetBalance)}
            </p>
            <p className="mt-0.5 text-xs font-medium text-amber-300/70">
              Settles to +{live.programReturnPercent}% by month {live.termMonths}
            </p>
          </div>
        </div>

        {/* Second tick sparkline */}
        {tickTrail.length > 2 && (
          <div className="flex h-8 items-end gap-0.5 rounded-lg border border-white/5 bg-black/20 px-2 py-1.5">
            {tickTrail.map((p) => {
              const h = Math.min(100, Math.abs(p.v) * 40 + 8);
              return (
                <div
                  key={p.t}
                  className={cn(
                    "flex-1 rounded-sm",
                    p.v >= 0 ? "bg-emerald-400/70" : "bg-rose-400/70"
                  )}
                  style={{ height: `${h}%` }}
                  title={signedCurrency(p.v)}
                />
              );
            })}
            <span className="ml-2 self-center text-[10px] uppercase tracking-wide text-slate-500">
              /sec
            </span>
          </div>
        )}

        {/* Bank investment sleeves */}
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-100">
            <Landmark className="h-4 w-4 text-teal-400" />
            How banks deploy this capital
          </div>
          <p className="mb-3 text-xs text-slate-500">
            Live marks across yields, government securities, bonds, equity indices, and real
            estate — the same sleeves large banks use for treasury investment books.
          </p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {live.sleeves.map((s) => (
              <div
                key={s.id}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5"
              >
                <div className="flex items-center justify-between gap-1">
                  <p className="text-[11px] font-semibold text-slate-200">{s.shortName}</p>
                  <span className="text-[10px] text-slate-500">
                    {(s.weight * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="mt-1 text-sm font-semibold tabular-nums text-white">
                  {formatCurrency(s.value)}
                </p>
                <p
                  className={cn(
                    "mt-0.5 text-[11px] font-medium tabular-nums",
                    s.secondDelta >= 0 ? "text-emerald-400" : "text-rose-400"
                  )}
                >
                  {signedCurrency(s.secondDelta)}/s · {signedCurrency(s.pnl)} vs target
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Live yields */}
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-100">
            <Activity className="h-4 w-4 text-amber-300" />
            Live yields
          </div>
          <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {live.yields.map((y) => (
              <div
                key={y.id}
                className="rounded-xl border border-white/10 bg-black/20 px-3 py-2.5"
              >
                <p className="text-[10px] uppercase tracking-wide text-slate-500">{y.label}</p>
                <p className="mt-0.5 text-lg font-semibold tabular-nums text-amber-200">
                  {y.rate.toFixed(2)}%
                </p>
                <p
                  className={cn(
                    "text-[11px] tabular-nums",
                    y.delta >= 0 ? "text-emerald-400" : "text-rose-400"
                  )}
                >
                  {y.delta >= 0 ? "+" : ""}
                  {y.delta.toFixed(3)} · {y.source}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Economic indicators */}
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-100">
            <Building2 className="h-4 w-4 text-sky-300" />
            Economic factors (live)
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {live.economics.map((e) => (
              <div
                key={e.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5"
              >
                <div>
                  <p className="text-[11px] font-medium text-slate-300">{e.label}</p>
                  <p className="mt-0.5 text-[10px] text-slate-500">{e.note}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold tabular-nums text-sky-200">
                    {e.value.toFixed(2)}
                    {e.unit === "%" ? "%" : ""}
                  </p>
                  <p
                    className={cn(
                      "text-[11px] font-medium tabular-nums",
                      e.trend === "up" && "text-rose-400",
                      e.trend === "down" && "text-emerald-400",
                      e.trend === "flat" && "text-slate-500"
                    )}
                  >
                    {e.delta >= 0 ? "+" : ""}
                    {e.delta.toFixed(3)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#050d12]/80 p-3 sm:p-5">
          <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-teal-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-10 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                <TrendingUp className="h-4 w-4 text-teal-400" />
                Daily mark trajectory (green = up day, red = down day)
              </div>
              <p className="mt-0.5 text-xs text-slate-500">
                Daily +/− from sleeve marks · program path still converges to +
                {live.programReturnPercent}% at month {live.termMonths}
              </p>
            </div>
            {lastPoint && (
              <div className="flex items-center gap-3 text-right">
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-500">Mark</p>
                  <p className="font-semibold tabular-nums text-teal-300">
                    {formatCurrency(lastPoint.balance)}
                  </p>
                </div>
                <div className="h-8 w-px bg-white/10" />
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-500">Day</p>
                  <p
                    className={cn(
                      "font-semibold tabular-nums",
                      lastPoint.positive ? "text-emerald-400" : "text-rose-400"
                    )}
                  >
                    {signedCurrency(lastPoint.profit)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {chartData.length === 0 ? (
            <div className="relative flex h-56 items-center justify-center text-sm text-slate-400">
              Chart unlocks when the first daily mark posts
              {waiting ? ` on ${formatDate(live.program.firstProfitDate)}` : ""}.
            </div>
          ) : (
            <div className="relative h-64 w-full sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={chartData}
                  margin={{ top: 12, right: 12, left: 4, bottom: 4 }}
                >
                  <defs>
                    <linearGradient id={barGradientUp} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#5eead4" stopOpacity={1} />
                      <stop offset="100%" stopColor="#0f766e" stopOpacity={0.75} />
                    </linearGradient>
                    <linearGradient id={barGradientDown} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#fb7185" stopOpacity={1} />
                      <stop offset="100%" stopColor="#9f1239" stopOpacity={0.75} />
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
                    y={live.program.principal}
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
                    radius={[6, 6, 2, 2]}
                    maxBarSize={36}
                    isAnimationActive={false}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`bar-${entry.day}`}
                        fill={
                          entry.positive
                            ? `url(#${barGradientUp})`
                            : `url(#${barGradientDown})`
                        }
                        fillOpacity={index === chartData.length - 1 ? 1 : 0.78}
                        stroke={
                          index === chartData.length - 1
                            ? entry.positive
                              ? "#99f6e4"
                              : "#fecdd3"
                            : "transparent"
                        }
                        strokeWidth={index === chartData.length - 1 ? 1.5 : 0}
                      />
                    ))}
                  </Bar>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="relative mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-3 text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1">
              <LineChart className="h-3 w-3" />
              Mark can rise or fall with yields / rates / RE · settlement path still ends at +
              {live.programReturnPercent}%
            </span>
            {live.program.msUntilEnd != null && live.program.endsAt && (
              <span>
                Program ends in{" "}
                <span className="font-mono font-medium text-slate-300">
                  {formatCountdown(live.program.msUntilEnd)}
                </span>
              </span>
            )}
          </div>
        </div>

        <p className="text-[10px] leading-relaxed text-slate-500">
          Illustrative bank-treasury mark-to-market overlay for Wealth Accelerator accounts.
          Second-by-second +/− reflects yields, government securities, bonds, indices, and real
          estate marks plus macro factors (Fed, CPI, PPI, unemployment). Program accounting still
          compounds toward the contracted {live.programReturnPercent}% over {live.termMonths}{" "}
          months — live marks converge to that target near term end. Not a brokerage statement;
          not investment advice.
        </p>
      </CardContent>
    </Card>
  );
}
