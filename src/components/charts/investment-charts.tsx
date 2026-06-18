"use client";

import { useId } from "react";
import {
  Area,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  MonthlyProfitChartPoint,
  PortfolioGrowthChartPoint,
} from "@/lib/portfolio-engine";
import { cn, formatCurrency } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

function formatAxisCurrency(value: number) {
  const n = Number(value);
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `$${(n / 1_000).toFixed(0)}k`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}k`;
  return `$${n}`;
}

function ChartCard({ title, description, children, className }: ChartCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        {description && <p className="text-sm text-slate-500">{description}</p>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function ChartEmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-72 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50 px-6 text-center">
      <TrendingUp className="mb-3 h-10 w-10 text-slate-300" />
      <p className="text-sm font-medium text-slate-600">{message}</p>
      <p className="mt-1 max-w-xs text-xs text-slate-400">
        Charts populate after your first deposit is approved by admin.
      </p>
    </div>
  );
}

const tooltipStyle = {
  backgroundColor: "#0f172a",
  border: "none",
  borderRadius: "10px",
  boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.25)",
  color: "#f8fafc",
  padding: "12px 14px",
};

function GrowthTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { payload: PortfolioGrowthChartPoint }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  const growthPct =
    point.deposited > 0
      ? (((point.value - point.deposited) / point.deposited) * 100).toFixed(1)
      : "0.0";

  return (
    <div style={tooltipStyle} className="min-w-[200px] text-xs">
      <p className="mb-2 font-semibold text-white">
        {label}
        {point.projected && (
          <span className="ml-1.5 rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-medium text-amber-300">
            Projected
          </span>
        )}
      </p>
      <div className="space-y-1.5 text-slate-300">
        <div className="flex justify-between gap-6">
          <span>Portfolio value</span>
          <span className="font-semibold text-teal-300">{formatCurrency(point.value)}</span>
        </div>
        <div className="flex justify-between gap-6">
          <span>Deposited capital</span>
          <span className="font-medium text-slate-200">{formatCurrency(point.deposited)}</span>
        </div>
        <div className="flex justify-between gap-6">
          <span>Profit earned</span>
          <span className="font-medium text-emerald-400">{formatCurrency(point.profitGain)}</span>
        </div>
        <div className="flex justify-between gap-6">
          <span>Month profit</span>
          <span className="font-medium text-amber-300">{formatCurrency(point.monthProfit)}</span>
        </div>
        <div className="mt-1 border-t border-slate-700 pt-1.5 flex justify-between gap-6">
          <span>Total growth</span>
          <span className="font-semibold text-white">+{growthPct}%</span>
        </div>
      </div>
    </div>
  );
}

function ProfitTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { payload: MonthlyProfitChartPoint }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;

  return (
    <div style={tooltipStyle} className="min-w-[180px] text-xs">
      <p className="mb-2 font-semibold text-white">
        {label}
        {point.projected && (
          <span className="ml-1.5 rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-medium text-amber-300">
            Est.
          </span>
        )}
      </p>
      <div className="space-y-1.5 text-slate-300">
        <div className="flex justify-between gap-6">
          <span>Monthly profit</span>
          <span className="font-semibold text-emerald-400">{formatCurrency(point.profit)}</span>
        </div>
        <div className="flex justify-between gap-6">
          <span>Portfolio balance</span>
          <span className="font-medium text-teal-300">{formatCurrency(point.balance)}</span>
        </div>
      </div>
    </div>
  );
}

function BalanceTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name?: string; value?: number; color?: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div style={tooltipStyle} className="min-w-[160px] text-xs">
      <p className="mb-2 font-semibold text-white">{label}</p>
      <div className="space-y-1.5">
        {payload.map((entry) => (
          <div key={entry.name} className="flex justify-between gap-6 text-slate-300">
            <span style={{ color: entry.color }}>{entry.name}</span>
            <span className="font-semibold text-white">
              {formatCurrency(Number(entry.value))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PortfolioGrowthChart({ data }: { data: PortfolioGrowthChartPoint[] }) {
  const gradientId = useId().replace(/:/g, "");
  const actualData = data.filter((d) => !d.projected);
  const hasData = actualData.some((d) => d.value > 0);

  if (!hasData) {
    return (
      <ChartCard
        title="Portfolio Growth"
        description="Total value over time — deposits plus compounded profit"
      >
        <ChartEmptyState message="No growth history yet" />
      </ChartCard>
    );
  }

  const yMax = Math.max(...data.map((d) => d.value), 1);
  const yPad = yMax * 0.08;

  return (
    <ChartCard
      title="Portfolio Growth"
      description="Total value over time — deposits plus compounded profit"
      className="border-teal-100/80"
    >
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.45} />
                <stop offset="50%" stopColor="#0d9488" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#0d9488" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatAxisCurrency}
              domain={[0, yMax + yPad]}
              width={52}
            />
            <Tooltip content={<GrowthTooltip />} cursor={{ stroke: "#94a3b8", strokeDasharray: "4 4" }} />
            <Legend
              verticalAlign="top"
              height={28}
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span className="text-xs text-slate-600">{value}</span>
              )}
            />
            <Area
              type="monotone"
              dataKey="value"
              name="Portfolio value"
              stroke="#0d9488"
              strokeWidth={2.5}
              fill={`url(#${gradientId})`}
              dot={(props) => {
                const { cx, cy, payload } = props as {
                  cx: number;
                  cy: number;
                  payload: PortfolioGrowthChartPoint;
                };
                if (payload.projected) return null;
                return (
                  <circle
                    key={payload.key}
                    cx={cx}
                    cy={cy}
                    r={4}
                    fill="#0d9488"
                    stroke="#fff"
                    strokeWidth={2}
                  />
                );
              }}
              activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
            />
            <Line
              type="monotone"
              dataKey="deposited"
              name="Deposited capital"
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex flex-wrap gap-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded bg-teal-600" />
          Total portfolio
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-0.5 w-4 rounded border-t-2 border-dashed border-slate-400" />
          Approved deposits
        </span>
        {data.some((d) => d.projected) && (
          <span className="text-amber-600">Dotted end point = next month estimate</span>
        )}
      </div>
    </ChartCard>
  );
}

export function MonthlyProfitChart({ data }: { data: MonthlyProfitChartPoint[] }) {
  const hasData = data.length > 0;

  if (!hasData) {
    return (
      <ChartCard title="Monthly Profit" description="Profit credited each month after accrual">
        <ChartEmptyState message="Profit chart will appear after accrual begins" />
      </ChartCard>
    );
  }

  const yMax = Math.max(...data.map((d) => d.profit), 1);

  return (
    <ChartCard
      title="Monthly Profit"
      description="Profit credited each month after the 30-day hold"
    >
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatAxisCurrency}
              domain={[0, yMax * 1.15]}
              width={52}
            />
            <Tooltip content={<ProfitTooltip />} cursor={{ fill: "rgba(13, 148, 136, 0.06)" }} />
            <Bar dataKey="profit" name="Monthly profit" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {data.map((entry) => (
                <Cell
                  key={entry.key}
                  fill={entry.projected ? "#fcd34d" : entry.profit > 0 ? "#0d9488" : "#cbd5e1"}
                  fillOpacity={entry.projected ? 0.85 : 1}
                />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function SectorAllocationChart({
  data,
  invested = true,
}: {
  data: { name: string; value: number; color: string }[];
  invested?: boolean;
}) {
  if (!invested) {
    return (
      <ChartCard title="Sector Allocation" description="How your portfolio is diversified">
        <ChartEmptyState message="Allocation appears with approved balance" />
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Sector Allocation" description="How your portfolio is diversified">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={68}
              outerRadius={108}
              paddingAngle={3}
              dataKey="value"
              label={({ name, value }) => `${name} ${value}%`}
              labelLine={false}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} stroke="#fff" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value) => [`${value}%`, "Allocation"]}
            />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span className="text-xs text-slate-600">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function BalanceTrendChart({ data }: { data: MonthlyProfitChartPoint[] }) {
  const hasData = data.some((d) => d.balance > 0);

  if (!hasData) {
    return (
      <ChartCard title="Balance & Profit Trend" description="Portfolio balance vs monthly profit">
        <ChartEmptyState message="Trend lines appear after deposits are approved" />
      </ChartCard>
    );
  }

  const yMax = Math.max(...data.map((d) => Math.max(d.balance, d.profit)), 1);

  return (
    <ChartCard
      title="Balance & Profit Trend"
      description="Portfolio balance vs monthly profit"
      className="lg:col-span-2"
    >
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={{ stroke: "#e2e8f0" }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatAxisCurrency}
              domain={[0, yMax * 1.12]}
              width={52}
            />
            <Tooltip content={<BalanceTooltip />} />
            <Legend
              verticalAlign="top"
              height={28}
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span className="text-xs text-slate-600">{value}</span>
              )}
            />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="#0d9488"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#0d9488", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 5 }}
              name="Portfolio balance"
            />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ r: 3, fill: "#f59e0b", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 5 }}
              name="Monthly profit"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

export function RegionAllocationChart({
  data,
  invested = true,
}: {
  data: { name: string; value: number }[];
  invested?: boolean;
}) {
  const colors = ["#0d9488", "#0ea5e9", "#8b5cf6", "#f59e0b", "#ef4444"];

  if (!invested) {
    return (
      <ChartCard title="Geographic Distribution" description="Regional exposure of holdings">
        <ChartEmptyState message="Regional breakdown appears with approved balance" />
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Geographic Distribution" description="Regional exposure of holdings">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              unit="%"
              domain={[0, "dataMax + 5"]}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 11, fill: "#475569" }}
              axisLine={false}
              tickLine={false}
              width={88}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value) => [`${value}%`, "Allocation"]}
            />
            <Bar dataKey="value" name="Allocation" radius={[0, 6, 6, 0]} maxBarSize={28}>
              {data.map((_, i) => (
                <Cell key={i} fill={colors[i % colors.length]} />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
