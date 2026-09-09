import type {
  MarketNewsItem,
  MarketTicker,
  MarketUpdatePayload,
} from "@/lib/market-news-types";

export type { MarketNewsItem, MarketTicker, MarketUpdatePayload };

const YAHOO_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/** Homepage only shows news fresher than this (old stories vanish) */
const MAX_NEWS_AGE_MS = 24 * 60 * 60 * 1000;
/** If fewer than this after 24h filter, allow up to 48h so the desk is never empty */
const FALLBACK_NEWS_AGE_MS = 48 * 60 * 60 * 1000;
const MIN_HEADLINES = 4;
const HOMEPAGE_NEWS_LIMIT = 6;

/** Yahoo fetch cache — refresh through the day so yesterday’s stories drop off */
const YAHOO_FETCH_REVALIDATE_SECONDS = 3600;

const TICKER_SYMBOLS = [
  { symbol: "SPY", label: "S&P 500 ETF" },
  { symbol: "QQQ", label: "Nasdaq 100" },
  { symbol: "DIA", label: "Dow Jones" },
  { symbol: "AAPL", label: "Apple" },
  { symbol: "MSFT", label: "Microsoft" },
  { symbol: "NVDA", label: "NVIDIA" },
] as const;

const NEWS_QUERIES = [
  "stock market today",
  "Wall Street",
  "S&P 500",
  "Federal Reserve",
  "earnings stocks",
];

const MAJOR_TICKERS = new Set([
  "SPY",
  "QQQ",
  "DIA",
  "IWM",
  "AAPL",
  "MSFT",
  "NVDA",
  "AMZN",
  "GOOGL",
  "GOOG",
  "META",
  "TSLA",
  "JPM",
  "XOM",
  "BRK-B",
  "^GSPC",
  "^DJI",
  "^IXIC",
]);

const PRIORITY_PUBLISHERS = [
  "reuters",
  "bloomberg",
  "associated press",
  "ap finance",
  "yahoo finance",
  "cnbc",
  "wall street journal",
  "wsj",
  "financial times",
  "marketwatch",
  "barron",
];

function formatRelativeTime(unixSeconds: number) {
  const published = new Date(unixSeconds * 1000);
  const diffMs = Date.now() - published.getTime();
  if (!Number.isFinite(diffMs) || diffMs < 0) {
    return published.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 60) return `${Math.max(1, mins)}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return "Yesterday";
}

async function yahooJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": YAHOO_UA,
        Accept: "application/json",
      },
      next: { revalidate: YAHOO_FETCH_REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function yahooText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": YAHOO_UA,
        Accept: "application/rss+xml, application/xml, text/xml, */*",
      },
      next: { revalidate: YAHOO_FETCH_REVALIDATE_SECONDS },
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

type SparkResponse = {
  spark?: {
    result?: Array<{
      symbol: string;
      response?: Array<{
        meta?: {
          regularMarketPrice?: number;
          previousClose?: number;
          chartPreviousClose?: number;
        };
        indicators?: {
          quote?: Array<{ close?: Array<number | null> }>;
        };
      }>;
    }>;
  };
};

type SearchNewsResponse = {
  news?: Array<{
    uuid?: string;
    title?: string;
    publisher?: string;
    link?: string;
    providerPublishTime?: number;
    thumbnail?: { resolutions?: Array<{ url?: string; width?: number; tag?: string }> };
    relatedTickers?: string[];
  }>;
};

type ScoredNews = MarketNewsItem & { score: number; publishedUnix: number };

function decodeXml(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function importanceScore(item: {
  title: string;
  publisher: string;
  relatedTickers: string[];
  publishedUnix: number;
  fromTopStories?: boolean;
}) {
  const ageHours = Math.max(0, (Date.now() - item.publishedUnix * 1000) / 3_600_000);
  let score = 100 - ageHours * 4; // fresher wins

  if (item.fromTopStories) score += 40;

  const publisher = item.publisher.toLowerCase();
  if (PRIORITY_PUBLISHERS.some((p) => publisher.includes(p))) score += 25;

  const majorHits = item.relatedTickers.filter((t) => MAJOR_TICKERS.has(t.toUpperCase())).length;
  score += majorHits * 8;

  const title = item.title.toLowerCase();
  if (
    /\b(fed|federal reserve|inflation|jobs report|cpi|fomc|earnings|s&p|nasdaq|dow|rate cut|rate hike|treasury)\b/.test(
      title
    )
  ) {
    score += 20;
  }

  return score;
}

function withinAge(publishedUnix: number, maxAgeMs: number) {
  if (!publishedUnix) return false;
  const age = Date.now() - publishedUnix * 1000;
  return age >= 0 && age <= maxAgeMs;
}

function pickFreshImportant(items: ScoredNews[], limit: number): MarketNewsItem[] {
  const last24h = items.filter((i) => withinAge(i.publishedUnix, MAX_NEWS_AGE_MS));
  const pool =
    last24h.length >= MIN_HEADLINES
      ? last24h
      : items.filter((i) => withinAge(i.publishedUnix, FALLBACK_NEWS_AGE_MS));

  return pool
    .sort((a, b) => b.score - a.score || b.publishedUnix - a.publishedUnix)
    .slice(0, limit)
    .map(({ score: _s, publishedUnix: _u, ...item }) => item);
}

export async function fetchMarketTickers(): Promise<MarketTicker[]> {
  const symbols = TICKER_SYMBOLS.map((t) => t.symbol).join(",");
  const data = await yahooJson<SparkResponse>(
    `https://query1.finance.yahoo.com/v7/finance/spark?symbols=${encodeURIComponent(symbols)}&range=1d&interval=5m`
  );

  const bySymbol = new Map(
    (data?.spark?.result ?? []).map((row) => [row.symbol, row] as const)
  );

  return TICKER_SYMBOLS.map(({ symbol, label }) => {
    const row = bySymbol.get(symbol)?.response?.[0];
    const meta = row?.meta;
    const price = meta?.regularMarketPrice ?? 0;
    const previousClose = meta?.previousClose ?? meta?.chartPreviousClose ?? price;
    const change = price - previousClose;
    const changePercent = previousClose ? (change / previousClose) * 100 : 0;
    const closes = (row?.indicators?.quote?.[0]?.close ?? []).filter(
      (v): v is number => typeof v === "number" && Number.isFinite(v)
    );
    const sparkline =
      closes.length > 2
        ? closes.filter((_, i) => i % Math.max(1, Math.floor(closes.length / 24)) === 0 || i === closes.length - 1)
        : undefined;
    return {
      symbol,
      label,
      price,
      previousClose,
      change,
      changePercent,
      sparkline,
    };
  }).filter((t) => t.price > 0);
}

async function fetchYahooTopStoriesRss(): Promise<ScoredNews[]> {
  const xml = await yahooText("https://finance.yahoo.com/rss/topstories");
  if (!xml) return [];

  const blocks = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)];
  const items: ScoredNews[] = [];

  for (const match of blocks) {
    const block = match[1];
    const titleRaw =
      block.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i)?.[1] ??
      block.match(/<title>([\s\S]*?)<\/title>/i)?.[1];
    const linkRaw = block.match(/<link>([\s\S]*?)<\/link>/i)?.[1];
    const pubRaw = block.match(/<pubDate>([\s\S]*?)<\/pubDate>/i)?.[1];
    const title = titleRaw ? decodeXml(titleRaw) : "";
    const link = linkRaw ? decodeXml(linkRaw) : "";
    if (!title || !link) continue;

    const published = pubRaw ? new Date(decodeXml(pubRaw)) : null;
    const publishedUnix = published && !Number.isNaN(published.getTime())
      ? Math.floor(published.getTime() / 1000)
      : 0;
    if (!publishedUnix) continue;

    const relatedTickers: string[] = [];
    const tickersMatch = block.match(/<media:category[^>]*>([\s\S]*?)<\/media:category>/gi);
    if (tickersMatch) {
      for (const cat of tickersMatch) {
        const val = decodeXml(cat.replace(/<\/?media:category[^>]*>/gi, ""));
        if (/^[A-Z.^]{1,6}$/i.test(val)) relatedTickers.push(val.toUpperCase());
      }
    }

    items.push({
      id: link,
      title,
      publisher: "Yahoo Finance",
      link,
      publishedAt: new Date(publishedUnix * 1000).toISOString(),
      publishedLabel: formatRelativeTime(publishedUnix),
      relatedTickers: relatedTickers.slice(0, 4),
      score: importanceScore({
        title,
        publisher: "Yahoo Finance",
        relatedTickers,
        publishedUnix,
        fromTopStories: true,
      }),
      publishedUnix,
    });
  }

  return items;
}

async function fetchSearchNews(): Promise<ScoredNews[]> {
  const results = await Promise.all(
    NEWS_QUERIES.map((q) =>
      yahooJson<SearchNewsResponse>(
        `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&quotesCount=0&newsCount=12`
      )
    )
  );

  const items: ScoredNews[] = [];
  const seen = new Set<string>();

  for (const payload of results) {
    for (const article of payload?.news ?? []) {
      const id = article.uuid || article.link || article.title;
      if (!id || seen.has(id) || !article.title || !article.link) continue;
      seen.add(id);

      const publishedUnix = article.providerPublishTime ?? 0;
      if (!publishedUnix) continue;

      const thumbs = article.thumbnail?.resolutions ?? [];
      const thumb =
        thumbs.find((r) => r.tag === "140x140")?.url ||
        [...thumbs].sort((a, b) => (a.width ?? 0) - (b.width ?? 0))[0]?.url;

      const relatedTickers = (article.relatedTickers ?? []).slice(0, 4);
      const publisher = article.publisher || "Yahoo Finance";

      items.push({
        id,
        title: article.title,
        publisher,
        link: article.link,
        publishedAt: new Date(publishedUnix * 1000).toISOString(),
        publishedLabel: formatRelativeTime(publishedUnix),
        thumbnail: thumb,
        relatedTickers,
        score: importanceScore({
          title: article.title,
          publisher,
          relatedTickers,
          publishedUnix,
          fromTopStories: false,
        }),
        publishedUnix,
      });
    }
  }

  return items;
}

export async function fetchStockNews(limit = HOMEPAGE_NEWS_LIMIT): Promise<MarketNewsItem[]> {
  const [topStories, searchNews] = await Promise.all([
    fetchYahooTopStoriesRss(),
    fetchSearchNews(),
  ]);

  const merged = new Map<string, ScoredNews>();
  for (const item of [...topStories, ...searchNews]) {
    const key = item.link.split("?")[0];
    const existing = merged.get(key);
    if (!existing || item.score > existing.score) {
      merged.set(key, item);
    }
  }

  return pickFreshImportant([...merged.values()], limit);
}

export async function getMarketUpdatePayload(): Promise<MarketUpdatePayload> {
  const [tickers, news] = await Promise.all([
    fetchMarketTickers(),
    fetchStockNews(HOMEPAGE_NEWS_LIMIT),
  ]);
  return {
    tickers,
    news,
    fetchedAt: new Date().toISOString(),
    source: "Yahoo Finance",
  };
}
