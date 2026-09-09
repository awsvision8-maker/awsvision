export interface MarketTicker {
  symbol: string;
  label: string;
  price: number;
  previousClose: number;
  change: number;
  changePercent: number;
  /** Intraday closes for sparkline (optional) */
  sparkline?: number[];
}

export interface MarketNewsItem {
  id: string;
  title: string;
  publisher: string;
  link: string;
  publishedAt: string;
  publishedLabel: string;
  thumbnail?: string;
  relatedTickers: string[];
}

export interface MarketUpdatePayload {
  tickers: MarketTicker[];
  news: MarketNewsItem[];
  fetchedAt: string;
  source: "Yahoo Finance";
}
