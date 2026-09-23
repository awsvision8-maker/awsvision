"use client";

import { useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { MarketNewsItem, MarketTicker, MarketUpdatePayload } from "@/lib/market-news-types";

const DISPLAY_NEWS = 6;

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function Sparkline({ values, up }: { values: number[]; up: boolean }) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const w = 48;
  const h = 18;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / span) * h;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0 opacity-80" aria-hidden>
      <polyline
        fill="none"
        stroke={up ? "#34d399" : "#fb7185"}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={pts}
      />
    </svg>
  );
}

function TickerPill({ ticker }: { ticker: MarketTicker }) {
  const up = ticker.change >= 0;
  return (
    <div className="flex shrink-0 items-center gap-2.5 border-r border-white/10 px-3 py-1.5 last:border-r-0">
      <div className="min-w-0">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          {ticker.symbol}
        </p>
        <p className="font-mono text-xs font-semibold tabular-nums text-white">
          {formatPrice(ticker.price)}
        </p>
      </div>
      {ticker.sparkline && ticker.sparkline.length > 1 ? (
        <Sparkline values={ticker.sparkline} up={up} />
      ) : null}
      <span
        className={cn(
          "inline-flex items-center gap-0.5 font-mono text-[10px] font-bold tabular-nums",
          up ? "text-emerald-400" : "text-rose-400"
        )}
      >
        {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
        {up ? "+" : ""}
        {ticker.changePercent.toFixed(2)}%
      </span>
    </div>
  );
}

function NewsRow({ item, index }: { item: MarketNewsItem; index: number }) {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group grid grid-cols-[auto_1fr_auto] items-start gap-3 border-b border-white/[0.06] px-1 py-2.5 transition hover:bg-white/[0.03] sm:gap-4 sm:px-2"
    >
      <span className="mt-0.5 w-5 font-mono text-[10px] tabular-nums text-slate-600 group-hover:text-teal-500/80">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-slate-500">
          <span className="font-medium text-teal-400/90">{item.publisher}</span>
          <span className="text-slate-700">·</span>
          <time dateTime={item.publishedAt} className="tabular-nums">
            {item.publishedLabel}
          </time>
          {item.relatedTickers.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded border border-white/10 bg-white/[0.04] px-1 py-px font-mono text-[9px] font-semibold tracking-wide text-slate-400"
            >
              {t}
            </span>
          ))}
        </div>
        <h3 className="mt-1 line-clamp-2 text-[13px] font-medium leading-snug text-slate-200 transition group-hover:text-white sm:line-clamp-1 sm:text-sm">
          {item.title}
        </h3>
      </div>
      <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0 text-slate-600 opacity-0 transition group-hover:opacity-100 group-hover:text-teal-400" />
    </a>
  );
}

export function MarketNewsSection() {
  const [data, setData] = useState<MarketUpdatePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch("/api/market-news", { cache: "no-store" });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load");
        if (!cancelled) {
          setData(json);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load market updates");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    const interval = window.setInterval(() => void load(), 60 * 60 * 1000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <section className="border-y border-slate-800 bg-slate-950 py-6" aria-busy="true">
        <div className="page-container flex items-center justify-center gap-2 text-xs text-slate-500">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Market desk…
        </div>
      </section>
    );
  }

  if (error || !data || (data.news.length === 0 && data.tickers.length === 0)) {
    return null;
  }

  const headlines = data.news.slice(0, DISPLAY_NEWS);

  return (
    <section className="border-y border-slate-800 bg-slate-950 text-white">
      {/* Compact desk header + tickers */}
      <div className="border-b border-white/10 bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950/30">
        <div className="page-container flex flex-col gap-0 lg:flex-row lg:items-stretch">
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 py-2.5 lg:w-56 lg:flex-col lg:items-start lg:justify-center lg:border-b-0 lg:border-r lg:py-3 lg:pr-5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-300/90">
                  Market desk
                </p>
                <h2 className="text-sm font-semibold tracking-tight text-white">Live indices</h2>
              </div>
            </div>
            <a
              href="https://finance.yahoo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500 transition hover:text-teal-300"
            >
              Yahoo
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {data.tickers.length > 0 ? (
            <div className="min-w-0 flex-1 overflow-x-auto">
              <div className="flex min-w-max items-center py-1">
                {data.tickers.map((t) => (
                  <TickerPill key={t.symbol} ticker={t} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Dense headline wire */}
      <div className="page-container py-4 sm:py-5">
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
            Top headlines · last 24h
          </p>
          <p className="hidden text-[10px] text-slate-600 sm:block">
            Importance-ranked · auto-refreshed
          </p>
        </div>

        {headlines.length > 0 ? (
          <div className="rounded-lg border border-white/[0.08] bg-white/[0.02]">
            {headlines.map((item, i) => (
              <NewsRow key={item.id} item={item} index={i} />
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-white/10 px-3 py-4 text-xs text-slate-500">
            Fresh headlines will appear as they publish today.
          </p>
        )}

        <p className="mt-3 text-[10px] leading-relaxed text-slate-600">
          Curated from {data.source}. Delayed quotes possible. Not investment advice — AWS Vision
          programs are separate from listed equities.
        </p>
      </div>
    </section>
  );
}
