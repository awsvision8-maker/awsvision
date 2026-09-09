"use client";

import { useEffect, useState } from "react";
import { Activity, Newspaper, TrendingDown, TrendingUp } from "lucide-react";
import type { MarketNewsItem, MarketTicker } from "@/lib/market-news-types";
import { cn } from "@/lib/utils";

function MiniSpark({ values, up }: { values: number[]; up: boolean }) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(max - min, 0.0001);
  const w = 72;
  const h = 28;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / span) * h;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} className="overflow-visible" aria-hidden>
      <polyline
        fill="none"
        stroke={up ? "#14b8a6" : "#fb7185"}
        strokeWidth="1.75"
        points={points}
      />
    </svg>
  );
}

export function ManagerMarketTicker() {
  const [tickers, setTickers] = useState<MarketTicker[]>([]);
  const [news, setNews] = useState<MarketNewsItem[]>([]);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/market-news");
        if (!res.ok) return;
        const data = await res.json();
        setTickers(data.tickers ?? []);
        setNews((data.news ?? []).slice(0, 5));
        setFetchedAt(data.fetchedAt ?? new Date().toISOString());
      } catch {
        /* ignore */
      }
    };
    void load();
    const id = setInterval(() => void load(), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5 sm:px-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-300">
            <Activity className="h-3.5 w-3.5 animate-pulse" />
            Live U.S. market quotes
          </div>
          <p className="text-[11px] text-slate-400">
            {fetchedAt
              ? `As of ${new Date(fetchedAt).toLocaleTimeString()}`
              : "Loading market data…"}
          </p>
        </div>
        <div className="grid gap-px bg-white/5 sm:grid-cols-2 lg:grid-cols-3">
          {tickers.length === 0 && (
            <p className="col-span-full px-4 py-8 text-center text-sm text-slate-400">
              Market quotes are loading. This panel refreshes automatically.
            </p>
          )}
          {tickers.map((t) => {
            const up = t.changePercent >= 0;
            return (
              <div
                key={t.symbol}
                className="flex items-center justify-between gap-3 bg-slate-950/80 px-4 py-3.5"
              >
                <div>
                  <p className="text-sm font-bold tracking-wide text-white">{t.symbol}</p>
                  <p className="text-[11px] text-slate-500">{t.label}</p>
                  <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-white">
                    {t.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <p
                    className={cn(
                      "mt-0.5 flex items-center gap-1 font-mono text-xs tabular-nums",
                      up ? "text-emerald-400" : "text-rose-400"
                    )}
                  >
                    {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {up ? "+" : ""}
                    {t.change.toFixed(2)} ({up ? "+" : ""}
                    {t.changePercent.toFixed(2)}%)
                  </p>
                </div>
                {t.sparkline && t.sparkline.length > 2 ? (
                  <MiniSpark values={t.sparkline} up={up} />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {news.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Newspaper className="h-4 w-4 text-teal-700" />
            Market headlines
          </div>
          <ul className="space-y-3">
            {news.map((n) => (
              <li key={n.id} className="border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                <a
                  href={n.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <p className="text-sm font-medium leading-snug text-slate-800 group-hover:text-teal-700">
                    {n.title}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    {n.publisher} · {n.publishedLabel}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
