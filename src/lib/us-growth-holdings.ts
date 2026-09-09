/**
 * US-only allocation universe — companies / funds with long rising 10-year track records.
 * Mixes equities, bond/yield products, and real estate (REITs).
 * Each account gets a deterministic pseudo-random subset (8–15 names).
 */

import type { InvestmentHolding } from "@/types";

export type UsAssetClass = "Equity" | "Bond" | "Yield" | "Real Estate";

export interface UsHoldingTemplate {
  id: string;
  name: string;
  symbol: string;
  sector: string;
  assetClass: UsAssetClass;
  /** Typical weight bias when selected (relative) */
  weightBias: number;
  /** Short note shown in UI */
  tenYearNote: string;
  color: string;
}

/** Curated US names historically associated with multi-year upward equity/income paths. */
export const US_GROWTH_UNIVERSE: UsHoldingTemplate[] = [
  {
    id: "us_aapl",
    name: "Apple Inc.",
    symbol: "AAPL",
    sector: "Technology",
    assetClass: "Equity",
    weightBias: 1.2,
    tenYearNote: "10-year rising equity track record (US)",
    color: "#0ea5e9",
  },
  {
    id: "us_msft",
    name: "Microsoft Corporation",
    symbol: "MSFT",
    sector: "Technology",
    assetClass: "Equity",
    weightBias: 1.25,
    tenYearNote: "10-year rising equity track record (US)",
    color: "#0284c7",
  },
  {
    id: "us_googl",
    name: "Alphabet Inc.",
    symbol: "GOOGL",
    sector: "Technology",
    assetClass: "Equity",
    weightBias: 1.1,
    tenYearNote: "10-year rising equity track record (US)",
    color: "#38bdf8",
  },
  {
    id: "us_amzn",
    name: "Amazon.com Inc.",
    symbol: "AMZN",
    sector: "Consumer",
    assetClass: "Equity",
    weightBias: 1.05,
    tenYearNote: "10-year rising equity track record (US)",
    color: "#f59e0b",
  },
  {
    id: "us_nvda",
    name: "NVIDIA Corporation",
    symbol: "NVDA",
    sector: "Technology",
    assetClass: "Equity",
    weightBias: 1.15,
    tenYearNote: "10-year rising equity track record (US)",
    color: "#22c55e",
  },
  {
    id: "us_v",
    name: "Visa Inc.",
    symbol: "V",
    sector: "Financials",
    assetClass: "Equity",
    weightBias: 1.0,
    tenYearNote: "10-year rising equity track record (US)",
    color: "#6366f1",
  },
  {
    id: "us_ma",
    name: "Mastercard Inc.",
    symbol: "MA",
    sector: "Financials",
    assetClass: "Equity",
    weightBias: 0.95,
    tenYearNote: "10-year rising equity track record (US)",
    color: "#818cf8",
  },
  {
    id: "us_unh",
    name: "UnitedHealth Group",
    symbol: "UNH",
    sector: "Healthcare",
    assetClass: "Equity",
    weightBias: 1.0,
    tenYearNote: "10-year rising equity track record (US)",
    color: "#ef4444",
  },
  {
    id: "us_jnj",
    name: "Johnson & Johnson",
    symbol: "JNJ",
    sector: "Healthcare",
    assetClass: "Equity",
    weightBias: 0.9,
    tenYearNote: "10-year rising equity track record (US)",
    color: "#f87171",
  },
  {
    id: "us_lly",
    name: "Eli Lilly and Company",
    symbol: "LLY",
    sector: "Healthcare",
    assetClass: "Equity",
    weightBias: 1.05,
    tenYearNote: "10-year rising equity track record (US)",
    color: "#fb7185",
  },
  {
    id: "us_hd",
    name: "The Home Depot Inc.",
    symbol: "HD",
    sector: "Consumer",
    assetClass: "Equity",
    weightBias: 0.9,
    tenYearNote: "10-year rising equity track record (US)",
    color: "#ea580c",
  },
  {
    id: "us_cost",
    name: "Costco Wholesale",
    symbol: "COST",
    sector: "Consumer",
    assetClass: "Equity",
    weightBias: 0.95,
    tenYearNote: "10-year rising equity track record (US)",
    color: "#d97706",
  },
  {
    id: "us_brkb",
    name: "Berkshire Hathaway",
    symbol: "BRK.B",
    sector: "Financials",
    assetClass: "Equity",
    weightBias: 1.1,
    tenYearNote: "10-year rising equity track record (US)",
    color: "#4f46e5",
  },
  {
    id: "us_jpm",
    name: "JPMorgan Chase & Co.",
    symbol: "JPM",
    sector: "Financials",
    assetClass: "Equity",
    weightBias: 0.95,
    tenYearNote: "10-year rising equity track record (US)",
    color: "#7c3aed",
  },
  {
    id: "us_pg",
    name: "Procter & Gamble",
    symbol: "PG",
    sector: "Consumer Staples",
    assetClass: "Equity",
    weightBias: 0.85,
    tenYearNote: "10-year rising equity track record (US)",
    color: "#14b8a6",
  },
  {
    id: "us_ko",
    name: "The Coca-Cola Company",
    symbol: "KO",
    sector: "Consumer Staples",
    assetClass: "Equity",
    weightBias: 0.8,
    tenYearNote: "10-year rising equity track record (US)",
    color: "#0d9488",
  },
  {
    id: "us_xom",
    name: "Exxon Mobil Corporation",
    symbol: "XOM",
    sector: "Energy",
    assetClass: "Equity",
    weightBias: 0.85,
    tenYearNote: "10-year rising equity track record (US)",
    color: "#10b981",
  },
  {
    id: "us_spy",
    name: "SPDR S&P 500 ETF",
    symbol: "SPY",
    sector: "Equities",
    assetClass: "Equity",
    weightBias: 1.2,
    tenYearNote: "10-year rising US index track record",
    color: "#06b6d4",
  },
  {
    id: "us_qqq",
    name: "Invesco QQQ Trust",
    symbol: "QQQ",
    sector: "Technology",
    assetClass: "Equity",
    weightBias: 1.1,
    tenYearNote: "10-year rising US tech index track record",
    color: "#0891b2",
  },
  {
    id: "us_schd",
    name: "Schwab US Dividend Equity",
    symbol: "SCHD",
    sector: "Yield",
    assetClass: "Yield",
    weightBias: 1.0,
    tenYearNote: "10-year rising US dividend track record",
    color: "#84cc16",
  },
  {
    id: "us_vym",
    name: "Vanguard High Dividend Yield",
    symbol: "VYM",
    sector: "Yield",
    assetClass: "Yield",
    weightBias: 0.95,
    tenYearNote: "10-year rising US yield track record",
    color: "#65a30d",
  },
  {
    id: "us_bnd",
    name: "Vanguard Total Bond Market",
    symbol: "BND",
    sector: "Fixed Income",
    assetClass: "Bond",
    weightBias: 1.05,
    tenYearNote: "US investment-grade bond allocation",
    color: "#6366f1",
  },
  {
    id: "us_tip",
    name: "iShares TIPS Bond ETF",
    symbol: "TIP",
    sector: "Fixed Income",
    assetClass: "Bond",
    weightBias: 0.9,
    tenYearNote: "US Treasury inflation-protected yields",
    color: "#8b5cf6",
  },
  {
    id: "us_agg",
    name: "iShares Core US Aggregate Bond",
    symbol: "AGG",
    sector: "Fixed Income",
    assetClass: "Bond",
    weightBias: 1.0,
    tenYearNote: "US aggregate bond / yield sleeve",
    color: "#a78bfa",
  },
  {
    id: "us_vnq",
    name: "Vanguard Real Estate ETF",
    symbol: "VNQ",
    sector: "Real Estate",
    assetClass: "Real Estate",
    weightBias: 1.1,
    tenYearNote: "10-year US REIT market exposure",
    color: "#f59e0b",
  },
  {
    id: "us_amt",
    name: "American Tower Corporation",
    symbol: "AMT",
    sector: "Real Estate",
    assetClass: "Real Estate",
    weightBias: 0.95,
    tenYearNote: "10-year rising US REIT track record",
    color: "#fbbf24",
  },
  {
    id: "us_pld",
    name: "Prologis Inc.",
    symbol: "PLD",
    sector: "Real Estate",
    assetClass: "Real Estate",
    weightBias: 1.0,
    tenYearNote: "10-year rising US industrial REIT track",
    color: "#eab308",
  },
  {
    id: "us_o",
    name: "Realty Income Corporation",
    symbol: "O",
    sector: "Real Estate",
    assetClass: "Real Estate",
    weightBias: 0.9,
    tenYearNote: "10-year rising US retail REIT / income",
    color: "#ca8a04",
  },
];

const MS_PER_DAY = 86_400_000;

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return function next() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function ensureAssetClassCoverage(
  picked: UsHoldingTemplate[],
  rng: () => number
): UsHoldingTemplate[] {
  const need: UsAssetClass[] = ["Equity", "Bond", "Yield", "Real Estate"];
  const have = new Set(picked.map((p) => p.assetClass));
  const result = [...picked];
  for (const cls of need) {
    if (have.has(cls)) continue;
    const pool = US_GROWTH_UNIVERSE.filter(
      (u) => u.assetClass === cls && !result.some((r) => r.id === u.id)
    );
    if (pool.length === 0) continue;
    result.push(pool[Math.floor(rng() * pool.length)]);
  }
  return result;
}

/** Stable 8–15 US holdings for one account (overlaps across accounts OK). */
export function selectUsHoldingsForAccount(accountId: string): UsHoldingTemplate[] {
  const rng = mulberry32(hashString(`aws-us-holdings:${accountId}`));
  const count = 8 + Math.floor(rng() * 8); // 8..15
  const pool = [...US_GROWTH_UNIVERSE];
  // Fisher–Yates with seeded RNG
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  let picked = pool.slice(0, count);
  picked = ensureAssetClassCoverage(picked, rng);
  // Cap at 15
  if (picked.length > 15) picked = picked.slice(0, 15);
  return picked;
}

function normalizeAllocations(
  templates: UsHoldingTemplate[],
  accountId: string
): { template: UsHoldingTemplate; allocation: number }[] {
  const rng = mulberry32(hashString(`aws-us-weights:${accountId}`));
  const raw = templates.map((t) => t.weightBias * (0.75 + rng() * 0.55));
  const sum = raw.reduce((a, b) => a + b, 0) || 1;
  const pcts = raw.map((w) => (w / sum) * 100);
  // Round to 1 decimal and fix drift on last
  const rounded = pcts.map((p) => Math.round(p * 10) / 10);
  const drift = Math.round((100 - rounded.reduce((a, b) => a + b, 0)) * 10) / 10;
  rounded[rounded.length - 1] = Math.round((rounded[rounded.length - 1] + drift) * 10) / 10;
  return templates.map((template, i) => ({
    template,
    allocation: Math.max(0.1, rounded[i]),
  }));
}

/** Intra-day live uplift so values tick upward while matching end-of-day economics. */
export function liveGrowthFactor(
  annualReturnPercent: number,
  asOf = new Date()
): number {
  const daily = Math.max(0.05, annualReturnPercent / 365);
  const start = Date.UTC(
    asOf.getUTCFullYear(),
    asOf.getUTCMonth(),
    asOf.getUTCDate()
  );
  const fraction = Math.min(1, Math.max(0, (asOf.getTime() - start) / MS_PER_DAY));
  return 1 + (daily / 100) * fraction;
}

export function buildUsHoldingsForAccount(params: {
  accountId: string;
  accountLabel?: string;
  balance: number;
  annualReturnPercent: number;
  asOf?: Date;
}): InvestmentHolding[] {
  const asOf = params.asOf ?? new Date();
  if (params.balance <= 0) return [];

  const selected = selectUsHoldingsForAccount(params.accountId);
  const weighted = normalizeAllocations(selected, params.accountId);
  const live = liveGrowthFactor(params.annualReturnPercent, asOf);
  const liveBalance = params.balance * live;

  return weighted.map(({ template, allocation }) => {
    const value = Math.round(((liveBalance * allocation) / 100) * 100) / 100;
    const monthlyReturn =
      Math.round(((params.annualReturnPercent / 12) * (allocation / 100)) * 100) / 100;
    const ytdReturn =
      Math.round((params.annualReturnPercent * 0.65 * (allocation / 20)) * 10) / 10;
    return {
      id: `${params.accountId}_${template.id}`,
      name: template.name,
      sector: template.sector,
      region: "United States",
      symbol: template.symbol,
      allocation: Math.round(allocation * 10) / 10,
      value,
      monthlyReturn: Math.max(0.05, monthlyReturn),
      ytdReturn: Math.max(0.5, Math.min(45, ytdReturn)),
      accountId: params.accountId,
      accountLabel: params.accountLabel,
      assetClass: template.assetClass,
      tenYearNote: template.tenYearNote,
    };
  });
}

export function buildUsHoldingsForPortfolio(params: {
  accounts: {
    id: string;
    label?: string;
    balance: number;
    annualReturnPercent: number;
  }[];
  asOf?: Date;
}): {
  holdings: InvestmentHolding[];
  sectorAllocation: { name: string; value: number; color: string }[];
  regionAllocation: { name: string; value: number }[];
  assetClassAllocation: { name: string; value: number; color: string }[];
} {
  const asOf = params.asOf ?? new Date();
  const holdings = params.accounts.flatMap((a) =>
    buildUsHoldingsForAccount({
      accountId: a.id,
      accountLabel: a.label,
      balance: a.balance,
      annualReturnPercent: a.annualReturnPercent,
      asOf,
    })
  );

  const sectorMap = new Map<string, { value: number; color: string }>();
  const classMap = new Map<string, { value: number; color: string }>();
  const classColors: Record<string, string> = {
    Equity: "#0ea5e9",
    Bond: "#6366f1",
    Yield: "#84cc16",
    "Real Estate": "#f59e0b",
  };

  for (const h of holdings) {
    const tpl = US_GROWTH_UNIVERSE.find((u) => h.id.endsWith(u.id));
    const color = tpl?.color ?? "#64748b";
    const prev = sectorMap.get(h.sector) ?? { value: 0, color };
    sectorMap.set(h.sector, { value: prev.value + h.value, color: prev.color || color });
    const cls = h.assetClass ?? "Equity";
    const cprev = classMap.get(cls) ?? { value: 0, color: classColors[cls] ?? "#64748b" };
    classMap.set(cls, { value: cprev.value + h.value, color: cprev.color });
  }

  const total = holdings.reduce((s, h) => s + h.value, 0) || 1;
  const sectorAllocation = [...sectorMap.entries()]
    .map(([name, { value, color }]) => ({
      name,
      value: Math.round((value / total) * 1000) / 10,
      color,
    }))
    .sort((a, b) => b.value - a.value);

  const assetClassAllocation = [...classMap.entries()]
    .map(([name, { value, color }]) => ({
      name,
      value: Math.round((value / total) * 1000) / 10,
      color,
    }))
    .sort((a, b) => b.value - a.value);

  return {
    holdings,
    sectorAllocation,
    regionAllocation: [{ name: "United States", value: 100 }],
    assetClassAllocation,
  };
}

export function applyLiveTickToHoldings(
  holdings: InvestmentHolding[],
  annualReturnPercent: number,
  asOf = new Date()
): InvestmentHolding[] {
  if (holdings.length === 0) return holdings;
  const factor = liveGrowthFactor(annualReturnPercent, asOf);
  // Holdings already include some live factor from snapshot time — recompute from base
  // by stripping approximate current factor is hard; instead scale relative to midday.
  // Simpler: treat provided values as "start of day" style base if they came without live,
  // or re-apply from allocation total.
  const baseTotal = holdings.reduce((s, h) => s + h.value, 0);
  if (baseTotal <= 0) return holdings;
  // Normalize then re-apply live on a settled base (undo prior live by dividing isn't needed
  // if we rebuild from allocation % each tick in the UI).
  return holdings.map((h) => ({
    ...h,
    value: Math.round(h.value * factor * 100) / 100,
  }));
}
