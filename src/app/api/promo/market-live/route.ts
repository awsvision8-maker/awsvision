import { NextResponse } from "next/server";
import { overlaysFromTickers } from "@/lib/promo-bank-market-live";

export const revalidate = 60;

const SYMBOLS = ["SPY", "QQQ", "TLT", "VNQ", "SHV", "^TNX", "^IRX", "^FVX"] as const;

type SparkResponse = {
  spark?: {
    result?: {
      symbol: string;
      response?: {
        meta?: {
          regularMarketPrice?: number;
          previousClose?: number;
          chartPreviousClose?: number;
        };
      }[];
    }[];
  };
};

/**
 * Live yield / index overlays for the $50k bank-market dashboard.
 * Falls back gracefully if Yahoo is unreachable.
 */
export async function GET() {
  try {
    const symbols = SYMBOLS.join(",");
    // yahooJson may not be exported — check
    const data = await fetchYahooSpark(symbols);
    const tickers = SYMBOLS.map((symbol) => {
      const row = data?.get(symbol);
      const price = row?.price ?? 0;
      const previousClose = row?.previousClose ?? price;
      const changePercent = previousClose
        ? ((price - previousClose) / previousClose) * 100
        : 0;
      return { symbol, price, changePercent };
    }).filter((t) => t.price > 0);

    return NextResponse.json({
      ok: true,
      asOf: new Date().toISOString(),
      tickers,
      overlays: overlaysFromTickers(tickers),
    });
  } catch (err) {
    console.error("promo market-live error", err);
    return NextResponse.json({
      ok: false,
      asOf: new Date().toISOString(),
      tickers: [],
      overlays: {},
    });
  }
}

async function fetchYahooSpark(symbols: string) {
  try {
    const url = `https://query1.finance.yahoo.com/v7/finance/spark?symbols=${encodeURIComponent(symbols)}&range=1d&interval=5m`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 AWSVision/1.0" },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as SparkResponse;
    const map = new Map<
      string,
      { price: number; previousClose: number }
    >();
    for (const row of json.spark?.result ?? []) {
      const meta = row.response?.[0]?.meta;
      const price = meta?.regularMarketPrice ?? 0;
      const previousClose =
        meta?.previousClose ?? meta?.chartPreviousClose ?? price;
      map.set(row.symbol, { price, previousClose });
    }
    return map;
  } catch {
    return null;
  }
}
