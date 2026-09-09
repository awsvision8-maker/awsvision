"use client";

import { useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  Loader2,
  Newspaper,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { MarketNewsItem, MarketTicker, MarketUpdatePayload } from "@/lib/market-news-types";

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function TickerChip({ ticker }: { ticker: MarketTicker }) {
  const up = ticker.change >= 0;
  return (
    <div className="flex min-w-[148px] shrink-0 items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 backdrop-blur-sm">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {ticker.symbol}
        </p>
        <p className="text-sm font-semibold text-white tabular-nums">{formatPrice(ticker.price)}</p>
      </div>
      <div
        className={cn(
          "ml-auto flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-bold tabular-nums",
          up ? "bg-emerald-500/15 text-emerald-300" : "bg-rose-500/15 text-rose-300"
        )}
      >
        {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
        {up ? "+" : ""}
        {ticker.changePercent.toFixed(2)}%
      </div>
    </div>
  );
}

function NewsCard({ item, featured = false }: { item: MarketNewsItem; featured?: boolean }) {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-teal-300 hover:shadow-md sm:p-5",
        featured && "sm:col-span-2 lg:flex-col"
      )}
    >
      {item.thumbnail ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.thumbnail}
          alt=""
          className={cn(
            "h-20 w-28 shrink-0 rounded-lg object-cover bg-slate-100",
            featured && "sm:h-44 sm:w-full"
          )}
        />
      ) : (
        <div
          className={cn(
            "flex h-20 w-28 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-teal-700",
            featured && "sm:h-44 sm:w-full"
          )}
        >
          <Newspaper className="h-7 w-7" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-slate-500">
          <span className="text-teal-700">{item.publisher}</span>
          <span aria-hidden>·</span>
          <time dateTime={item.publishedAt}>{item.publishedLabel}</time>
        </div>
        <h3
          className={cn(
            "mt-1.5 font-semibold text-slate-900 leading-snug group-hover:text-teal-800",
            featured ? "text-lg sm:text-xl" : "text-sm sm:text-base"
          )}
        >
          {item.title}
        </h3>
        {item.relatedTickers.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {item.relatedTickers.map((t) => (
              <span
                key={t}
                className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-slate-600"
              >
                {t}
              </span>
            ))}
          </div>
        )}
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-teal-700 opacity-0 transition group-hover:opacity-100">
          Read on Yahoo Finance
          <ExternalLink className="h-3 w-3" />
        </span>
      </div>
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
    // Re-check through the day so stories older than 24h leave the homepage
    const interval = window.setInterval(() => void load(), 60 * 60 * 1000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <section className="border-y border-slate-200 bg-slate-950 py-12 sm:py-16" aria-busy="true">
        <div className="page-container flex items-center justify-center gap-3 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading today’s market updates…
        </div>
      </section>
    );
  }

  if (error || !data || (data.news.length === 0 && data.tickers.length === 0)) {
    return null;
  }

  const [featured, ...rest] = data.news;

  return (
    <section className="border-y border-slate-800 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-white">
      <div className="border-b border-white/10 bg-teal-950/40">
        <div className="page-container flex flex-wrap items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-200">
              Today&apos;s market desk
            </p>
          </div>
          <p className="text-[11px] text-slate-400">
            Top headlines from the last 24 hours · {data.source}
          </p>
        </div>
      </div>

      {data.tickers.length > 0 && (
        <div className="border-b border-white/10">
          <div className="page-container overflow-x-auto py-4">
            <div className="flex min-w-max gap-3">
              {data.tickers.map((t) => (
                <TickerChip key={t.symbol} ticker={t} />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="page-container py-12 sm:py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-teal-300">
              <TrendingUp className="h-3.5 w-3.5" />
              Today&apos;s top finance updates
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              Markets &amp; stock news
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
              Only the most important stock-market headlines from today stay here. Older stories are
              removed automatically as the day rolls forward.
            </p>
          </div>
          <a
            href="https://finance.yahoo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-300 hover:text-teal-200"
          >
            Yahoo Finance
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {data.news.length > 0 ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured && <NewsCard item={featured} featured />}
            {rest.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="mt-8 rounded-xl border border-white/10 bg-white/5 px-4 py-6 text-sm text-slate-400">
            Fresh market headlines will appear here as they publish today.
          </p>
        )}

        <p className="mt-6 text-[11px] leading-relaxed text-slate-500">
          Headlines are curated from Yahoo Finance (last 24 hours, importance-ranked) and may be
          delayed. Not investment advice. AWS Vision programs are separate from listed equities.
        </p>
      </div>
    </section>
  );
}
