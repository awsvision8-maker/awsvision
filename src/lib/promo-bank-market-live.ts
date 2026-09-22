/**
 * $50k Wealth Accelerator — bank-style mark-to-market overlay.
 *
 * Program path (0.5%/day → ~90% / 6 mo) stays the settlement truth.
 * Live UI balance = that target ± sleeve moves (yields, Treasuries, bonds,
 * indices, real estate) so clients see daily +/− like a bank treasury book,
 * while end-of-program mark converges exactly onto the program ratio.
 */

import {
  computePromoDailyCompound,
  type PromoDailyCompoundResult,
} from "@/lib/promo-daily-compound";

export type BankSleeveId =
  | "yields"
  | "gov_securities"
  | "bonds"
  | "indices"
  | "real_estate";

export interface BankSleeveDef {
  id: BankSleeveId;
  name: string;
  shortName: string;
  /** Target portfolio weight (sums to 1) — how banks park deposits */
  weight: number;
  description: string;
  /** Relative volatility vs other sleeves */
  vol: number;
}

/** Typical bank / trust investment book for deposit capital */
export const BANK_INVESTMENT_SLEEVES: BankSleeveDef[] = [
  {
    id: "yields",
    name: "Cash & money-market yields",
    shortName: "Yields",
    weight: 0.15,
    description: "Fed funds / HYSA / overnight cash used by banks for liquidity",
    vol: 0.35,
  },
  {
    id: "gov_securities",
    name: "Government securities",
    shortName: "Treasuries",
    weight: 0.25,
    description: "T-bills, notes & bonds — duration mark-to-market",
    vol: 0.55,
  },
  {
    id: "bonds",
    name: "Agency & investment-grade bonds",
    shortName: "Bonds",
    weight: 0.2,
    description: "Corporate / agency credit the bank treasury desk holds",
    vol: 0.65,
  },
  {
    id: "indices",
    name: "Equity indices",
    shortName: "Indices",
    weight: 0.25,
    description: "S&P / Nasdaq-style index exposure in the growth sleeve",
    vol: 1.15,
  },
  {
    id: "real_estate",
    name: "Real estate (REIT / CRE)",
    shortName: "Real estate",
    weight: 0.15,
    description: "Property & REIT marks — rents, rates, and valuations",
    vol: 0.85,
  },
];

export interface EconomicIndicator {
  id: string;
  label: string;
  value: number;
  unit: "%" | "pts" | "index";
  /** Second-by-second change in displayed points */
  delta: number;
  /** Direction vs prior hour baseline */
  trend: "up" | "down" | "flat";
  note: string;
}

export interface LiveYieldQuote {
  id: string;
  label: string;
  rate: number;
  delta: number;
  source: string;
}

/** Automated desk trade — buy/sell on bank investment sleeves */
export interface AutomatedTrade {
  id: string;
  /** Unix ms when this fill “printed” */
  at: number;
  side: "buy" | "sell";
  sleeveId: BankSleeveId;
  sleeveLabel: string;
  symbol: string;
  instrument: string;
  /** Fill price (index pts or bond/yield price) */
  price: number;
  /** Live reference rate / yield at fill (%) when applicable */
  liveRate: number | null;
  quantity: number;
  notional: number;
  /** Mark P&L impact of this fill on the book */
  pnlImpact: number;
  status: "filled";
  note: string;
}

export interface TradeInstrument {
  symbol: string;
  name: string;
  sleeveId: BankSleeveId;
  /** Base mid price for UI */
  basePrice: number;
  /** Typical yield % shown next to the fill (null for pure equity index) */
  baseYield: number | null;
  overlayKey: string;
}

/** Instruments the automation desk rotates through */
export const AUTOMATED_TRADE_INSTRUMENTS: TradeInstrument[] = [
  {
    symbol: "SHV",
    name: "Short Treasury / MM ETF",
    sleeveId: "yields",
    basePrice: 110.2,
    baseYield: 4.05,
    overlayKey: "SHV",
  },
  {
    symbol: "BIL",
    name: "1-3 Month T-Bill",
    sleeveId: "yields",
    basePrice: 91.45,
    baseYield: 4.12,
    overlayKey: "SHV",
  },
  {
    symbol: "IEF",
    name: "7-10Y Treasury",
    sleeveId: "gov_securities",
    basePrice: 94.8,
    baseYield: 4.18,
    overlayKey: "^TNX",
  },
  {
    symbol: "GOVT",
    name: "US Treasury Bond ETF",
    sleeveId: "gov_securities",
    basePrice: 22.9,
    baseYield: 4.05,
    overlayKey: "^TNX",
  },
  {
    symbol: "LQD",
    name: "Investment-grade Corp Bond",
    sleeveId: "bonds",
    basePrice: 108.4,
    baseYield: 4.55,
    overlayKey: "TLT",
  },
  {
    symbol: "AGG",
    name: "US Aggregate Bond",
    sleeveId: "bonds",
    basePrice: 98.6,
    baseYield: 4.35,
    overlayKey: "TLT",
  },
  {
    symbol: "SPY",
    name: "S&P 500 Index",
    sleeveId: "indices",
    basePrice: 520,
    baseYield: null,
    overlayKey: "SPY",
  },
  {
    symbol: "QQQ",
    name: "Nasdaq-100 Index",
    sleeveId: "indices",
    basePrice: 445,
    baseYield: null,
    overlayKey: "QQQ",
  },
  {
    symbol: "VNQ",
    name: "US Real Estate REIT",
    sleeveId: "real_estate",
    basePrice: 88.5,
    baseYield: 3.85,
    overlayKey: "VNQ",
  },
  {
    symbol: "IYR",
    name: "Real Estate Select",
    sleeveId: "real_estate",
    basePrice: 92.1,
    baseYield: 3.7,
    overlayKey: "VNQ",
  },
];

export interface BankSleeveLive {
  id: BankSleeveId;
  name: string;
  shortName: string;
  weight: number;
  description: string;
  /** Mark value of this sleeve (sums ≈ display balance) */
  value: number;
  /** Instant P&L vs sleeve’s share of program target */
  pnl: number;
  /** Second change */
  secondDelta: number;
  changePercent: number;
  /** Buys vs sells in the recent automation window */
  buyCount: number;
  sellCount: number;
  lastSide: "buy" | "sell" | null;
}

export interface MarketDayPoint {
  day: number;
  date: string;
  /** Program settlement target end-of-day */
  targetBalance: number;
  /** Mark-to-market end-of-day (can be above/below target mid-program) */
  markBalance: number;
  dayProfit: number;
  cumulativeProfit: number;
  live?: boolean;
}

export interface PromoBankMarketLiveResult {
  program: PromoDailyCompoundResult;
  /** What the client sees ticking (plus and minus) */
  displayBalance: number;
  displayProfit: number;
  /** Exact compound path — end of 6 months lands here */
  targetBalance: number;
  targetProfit: number;
  /** This second’s change */
  secondDelta: number;
  secondDeltaPercent: number;
  /** Today’s mark P&L vs start-of-day mark (can be negative) */
  dayMarkPnl: number;
  programProgress: number;
  /** 0 at start → 1 at end; used to force convergence */
  convergence: number;
  sleeves: BankSleeveLive[];
  economics: EconomicIndicator[];
  yields: LiveYieldQuote[];
  /** Latest automated buy/sell fills (newest first) */
  trades: AutomatedTrade[];
  /** Net P&L from fills in the visible blotter window */
  tradeWindowPnl: number;
  history: MarketDayPoint[];
  programReturnPercent: number;
  termMonths: number;
}

function money(n: number): number {
  return Math.round(n * 100) / 100;
}

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

/** Deterministic 0..1 hash from string */
function hash01(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10_000) / 10_000;
}

/**
 * Multi-frequency wave in [-1, 1] — looks like market ticks, stable across refresh.
 * Includes a fast (~2–4s) component so the UI shows visible +/− every second.
 */
function wave(seed: string, tSec: number): number {
  const p = hash01(seed);
  const q = hash01(seed + ":b");
  const r = hash01(seed + ":c");
  const a =
    Math.sin(tSec * 1.7 + p * 12) * 0.22 +
    Math.sin(tSec * 0.85 + q * 9) * 0.18 +
    Math.sin(tSec / 5.3 + p * 12) * 0.2 +
    Math.sin(tSec / 13.7 + q * 9) * 0.16 +
    Math.sin(tSec / 37 + r * 4) * 0.14 +
    Math.sin(tSec / 89 + q * 3) * 0.1;
  return clamp(a / 0.9, -1, 1);
}

/** Slow drift for macro series (hours/days), small second jitter */
function macroSeries(
  id: string,
  base: number,
  asOf: Date,
  amp: number
): { value: number; delta: number } {
  const tSec = asOf.getTime() / 1000;
  const day = Math.floor(tSec / 86_400);
  const slow = wave(id + ":slow", day * 9.1) * amp;
  const hour = wave(id + ":hour", tSec / 3600) * amp * 0.25;
  const tick = wave(id + ":tick", tSec) * amp * 0.04;
  const value = money(base + slow + hour + tick);
  const prev = money(
    base +
      wave(id + ":slow", (day - 0.04) * 9.1) * amp +
      wave(id + ":hour", (tSec - 1) / 3600) * amp * 0.25 +
      wave(id + ":tick", tSec - 1) * amp * 0.04
  );
  return { value, delta: money(value - prev) };
}

/**
 * Convergence: mid-program full mark vol; last ~15% of term dampens to 0
 * so day-180 / end lands on the exact program ratio.
 */
function convergenceFactor(progress: number): number {
  const p = clamp(progress, 0, 1);
  if (p >= 0.98) return 0;
  if (p <= 0.85) return 1;
  // Smooth fade 85% → 98%
  const u = (p - 0.85) / 0.13;
  return (1 - u) * (1 - u);
}

function dayNoiseFactor(day: number, seed: string): number {
  // Day-level mark that can be red or green; zero-mean over long run
  return wave(`day:${seed}:${day}`, day * 17.3);
}

function sleeveLabel(id: BankSleeveId) {
  return BANK_INVESTMENT_SLEEVES.find((s) => s.id === id)?.shortName ?? id;
}

/**
 * Continuous automation desk: deterministic “random” buys/sells every few seconds
 * across yields / Treasuries / bonds / indices / RE, priced off live overlays.
 */
export function generateAutomatedTrades(params: {
  asOf: Date;
  principal: number;
  convergence: number;
  marketOverlays?: Record<string, number>;
  /** How many recent fills to return */
  limit?: number;
  /** Look-back window in seconds */
  windowSec?: number;
}): { trades: AutomatedTrade[]; windowPnl: number; sleeveTradePnl: Record<BankSleeveId, number> } {
  const asOf = params.asOf;
  const nowMs = asOf.getTime();
  const limit = params.limit ?? 16;
  const windowSec = params.windowSec ?? 90;
  const overlays = params.marketOverlays ?? {};
  const amp = params.principal * 0.00035 * Math.max(0.15, params.convergence || 0.5);

  const trades: AutomatedTrade[] = [];
  // A fill prints every 2–4 seconds (bucketed)
  for (let age = 0; age < windowSec && trades.length < limit; age++) {
    const tMs = nowMs - age * 1000;
    const tSec = Math.floor(tMs / 1000);
    // Only some seconds fire a trade
    const fire = hash01(`trade-fire:${tSec}`);
    if (fire > 0.42) continue; // ~42% of seconds get a fill → frequent blotter

    const inst =
      AUTOMATED_TRADE_INSTRUMENTS[
        Math.floor(hash01(`trade-inst:${tSec}`) * AUTOMATED_TRADE_INSTRUMENTS.length)
      ]!;
    const side: "buy" | "sell" =
      hash01(`trade-side:${tSec}:${inst.symbol}`) > 0.5 ? "buy" : "sell";

    const ov = overlays[inst.overlayKey] ?? 0;
    const priceJitter =
      wave(`px:${inst.symbol}`, tSec) * (inst.basePrice * 0.004) +
      clamp(ov, -2.5, 2.5) * (inst.basePrice * 0.002);
    const price = money(inst.basePrice + priceJitter);

    const qtyBase =
      inst.sleeveId === "indices" || inst.sleeveId === "real_estate" ? 8 : 25;
    const quantity = Math.max(
      1,
      Math.round(qtyBase * (0.55 + hash01(`trade-qty:${tSec}`) * 1.1))
    );
    const notional = money(price * quantity);

    // Buy into strength / sell into weakness slightly biased by overlay, still random
    const edge =
      (side === "buy" ? 1 : -1) *
      (wave(`pnl:${inst.symbol}`, tSec) * amp * (0.6 + inst.basePrice / 400) +
        clamp(ov, -2, 2) * amp * 0.35);
    const pnlImpact = money(edge * (0.7 + hash01(`trade-edge:${tSec}`) * 0.8));

    const liveRate =
      inst.baseYield == null
        ? null
        : money(
            inst.baseYield +
              wave(`yld:${inst.symbol}`, tSec) * 0.06 +
              clamp(ov, -1, 1) * 0.04
          );

    const note =
      side === "buy"
        ? `Auto-buy ${inst.symbol} · ${sleeveLabel(inst.sleeveId)} sleeve`
        : `Auto-sell ${inst.symbol} · ${sleeveLabel(inst.sleeveId)} sleeve`;

    trades.push({
      id: `t-${tSec}-${inst.symbol}-${side}`,
      at: tMs,
      side,
      sleeveId: inst.sleeveId,
      sleeveLabel: sleeveLabel(inst.sleeveId),
      symbol: inst.symbol,
      instrument: inst.name,
      price,
      liveRate,
      quantity,
      notional,
      pnlImpact,
      status: "filled",
      note,
    });
  }

  // Newest first
  trades.sort((a, b) => b.at - a.at);

  const sleeveTradePnl: Record<BankSleeveId, number> = {
    yields: 0,
    gov_securities: 0,
    bonds: 0,
    indices: 0,
    real_estate: 0,
  };
  let windowPnl = 0;
  for (const t of trades) {
    windowPnl += t.pnlImpact;
    sleeveTradePnl[t.sleeveId] = money(sleeveTradePnl[t.sleeveId] + t.pnlImpact);
  }

  return {
    trades: trades.slice(0, limit),
    windowPnl: money(windowPnl),
    sleeveTradePnl,
  };
}

export function computePromoBankMarketLive(params: {
  principal: number;
  startDate: string | Date;
  endDate?: string | Date | null;
  active?: boolean;
  dailyRatePercent?: number;
  asOf?: Date;
  /** Package return (e.g. 90) — shown in UI */
  programReturnPercent?: number;
  termMonths?: number;
  /** Optional live Yahoo overlays: symbol → changePercent */
  marketOverlays?: Record<string, number>;
}): PromoBankMarketLiveResult {
  const asOf = params.asOf ?? new Date();
  const program = computePromoDailyCompound({
    principal: params.principal,
    startDate: params.startDate,
    endDate: params.endDate,
    active: params.active,
    dailyRatePercent: params.dailyRatePercent,
    asOf,
  });

  const programReturnPercent = params.programReturnPercent ?? 90;
  const termMonths = params.termMonths ?? 6;
  const overlays = params.marketOverlays ?? {};

  const totalDays = program.totalProgramDays ?? 180;
  const progress =
    totalDays > 0 ? clamp(program.dayNumber / totalDays, 0, 1) : 0;
  const conv = program.liveAccruing
    ? convergenceFactor(progress)
    : program.dayNumber >= totalDays
      ? 0
      : convergenceFactor(progress);

  const targetBalance = program.balance;
  const targetProfit = program.totalProfit;
  const tSec = asOf.getTime() / 1000;
  const principal = program.principal;

  // Peak mark deviation ≈ 0.9% of capital mid-program; 0 at term end
  const peakAmp = principal * 0.009 * conv;

  // Build mark history: each settled day can finish above/below target,
  // but residual fades to 0 near term end so final = exact program ratio.
  const history: MarketDayPoint[] = [];
  let prevMark = principal;

  for (const h of program.history) {
    const isLive = Boolean(h.live);
    const dayProg = totalDays > 0 ? h.day / totalDays : 0;
    const dayConv = isLive ? conv : convergenceFactor(dayProg);
    // Day marks swing enough that some sessions close red
    const residual =
      dayNoiseFactor(h.day, program.startDate) * principal * 0.011 * dayConv;

    let markBalance: number;
    if (isLive) {
      markBalance = targetBalance; // placeholder; overwritten after sleeves
    } else {
      markBalance = money(h.endBalance + residual);
    }

    const dayProfit = money(markBalance - prevMark);
    history.push({
      day: h.day,
      date: h.date,
      targetBalance: h.endBalance,
      markBalance,
      dayProfit,
      cumulativeProfit: money(markBalance - principal),
      live: isLive,
    });
    if (!isLive) prevMark = markBalance;
  }

  // Sleeve residuals — mark moves + automation desk trade P&L
  const { trades, windowPnl, sleeveTradePnl } = generateAutomatedTrades({
    asOf,
    principal,
    convergence: conv,
    marketOverlays: overlays,
    limit: 18,
    windowSec: 100,
  });

  const sleeveResiduals = BANK_INVESTMENT_SLEEVES.map((s) => {
    const overlayKey =
      s.id === "indices"
        ? "SPY"
        : s.id === "real_estate"
          ? "VNQ"
          : s.id === "bonds"
            ? "TLT"
            : s.id === "gov_securities"
              ? "^TNX"
              : "SHV";
    const ov = overlays[overlayKey] ?? overlays[s.id] ?? 0;
    const slow = wave(s.id, tSec) * 0.55;
    const mid = wave(s.id + ":mid", tSec / 3) * 0.3;
    const fast = wave(s.id + ":fast", tSec * 1.4) * 0.15;
    const w = slow + mid + fast + clamp(ov, -2, 2) * 0.1;
    const tradePush = sleeveTradePnl[s.id] ?? 0;
    return {
      sleeve: s,
      residual: w * s.vol * peakAmp * s.weight * 1.35 + tradePush * 0.85,
    };
  });
  const totalResidual = sleeveResiduals.reduce((a, x) => a + x.residual, 0);

  const displayBalance = money(targetBalance + totalResidual);
  const displayProfit = money(displayBalance - principal);

  // Previous-second display for delta
  const prevAsOf = new Date(asOf.getTime() - 1000);
  const prevLive = computePromoBankMarketLiveSecond(
    program,
    prevAsOf,
    peakAmp,
    overlays,
    conv
  );
  const secondDelta = money(displayBalance - prevLive.displayBalance);

  const startOfDayTarget = program.settledBalance;
  // Approximate start-of-day mark from last settled history point
  const lastSettled = [...history].reverse().find((h) => !h.live);
  const startOfDayMark = lastSettled?.markBalance ?? startOfDayTarget;
  const dayMarkPnl = money(displayBalance - startOfDayMark);

  const sleeves: BankSleeveLive[] = sleeveResiduals.map(({ sleeve, residual }) => {
    const targetShare = money(targetBalance * sleeve.weight);
    const value = money(targetShare + residual);
    const pnl = money(residual);
    const prevRes =
      prevLive.sleeves.find((s) => s.id === sleeve.id)?.pnl ?? 0;
    const secondSleeveDelta = money(pnl - prevRes);
    const changePercent =
      targetShare > 0 ? money((pnl / targetShare) * 100) : 0;
    const sleeveTrades = trades.filter((t) => t.sleeveId === sleeve.id);
    const last = sleeveTrades[0] ?? null;
    return {
      id: sleeve.id,
      name: sleeve.name,
      shortName: sleeve.shortName,
      weight: sleeve.weight,
      description: sleeve.description,
      value,
      pnl,
      secondDelta: secondSleeveDelta,
      changePercent,
      buyCount: sleeveTrades.filter((t) => t.side === "buy").length,
      sellCount: sleeveTrades.filter((t) => t.side === "sell").length,
      lastSide: last?.side ?? null,
    };
  });

  // Patch live history point
  if (history.length && history[history.length - 1]?.live) {
    const livePt = history[history.length - 1];
    livePt.markBalance = displayBalance;
    livePt.dayProfit = money(displayBalance - (lastSettled?.markBalance ?? principal));
    livePt.cumulativeProfit = displayProfit;
  }

  const economics = buildEconomics(asOf, overlays);
  const yields = buildYields(asOf, overlays);

  return {
    program,
    displayBalance,
    displayProfit,
    targetBalance: money(targetBalance),
    targetProfit: money(targetProfit),
    secondDelta,
    secondDeltaPercent:
      displayBalance > 0 ? money((secondDelta / displayBalance) * 10000) / 100 : 0,
    dayMarkPnl,
    programProgress: progress,
    convergence: conv,
    sleeves,
    economics,
    yields,
    trades,
    tradeWindowPnl: windowPnl,
    history,
    programReturnPercent,
    termMonths,
  };
}

/** Lightweight prior-second recalculation (avoid infinite recursion) */
function computePromoBankMarketLiveSecond(
  program: PromoDailyCompoundResult,
  asOf: Date,
  peakAmp: number,
  overlays: Record<string, number>,
  conv: number
): { displayBalance: number; sleeves: { id: BankSleeveId; pnl: number }[] } {
  const tSec = asOf.getTime() / 1000;
  const { sleeveTradePnl } = generateAutomatedTrades({
    asOf,
    principal: program.principal,
    convergence: conv,
    marketOverlays: overlays,
    limit: 18,
    windowSec: 100,
  });
  const sleeveResiduals = BANK_INVESTMENT_SLEEVES.map((s) => {
    const overlayKey =
      s.id === "indices"
        ? "SPY"
        : s.id === "real_estate"
          ? "VNQ"
          : s.id === "bonds"
            ? "TLT"
            : s.id === "gov_securities"
              ? "^TNX"
              : "SHV";
    const ov = overlays[overlayKey] ?? 0;
    const slow = wave(s.id, tSec) * 0.55;
    const mid = wave(s.id + ":mid", tSec / 3) * 0.3;
    const fast = wave(s.id + ":fast", tSec * 1.4) * 0.15;
    const w = slow + mid + fast + clamp(ov, -2, 2) * 0.1;
    const tradePush = sleeveTradePnl[s.id] ?? 0;
    return {
      id: s.id,
      residual: w * s.vol * peakAmp * s.weight * 1.35 + tradePush * 0.85,
    };
  });
  const totalResidual = sleeveResiduals.reduce((a, x) => a + x.residual, 0);
  return {
    displayBalance: money(program.balance + totalResidual),
    sleeves: sleeveResiduals.map((s) => ({ id: s.id, pnl: money(s.residual) })),
  };
}

function buildEconomics(
  asOf: Date,
  overlays: Record<string, number>
): EconomicIndicator[] {
  const cpi = macroSeries("cpi", 2.85, asOf, 0.12);
  const ppi = macroSeries("ppi", 2.45, asOf, 0.18);
  const unemp = macroSeries("unemp", 4.15, asOf, 0.08);
  const infl = macroSeries("infl", 2.7, asOf, 0.1);
  const fed = macroSeries("fed", 4.33, asOf, 0.05);
  const gdp = macroSeries("gdp", 2.1, asOf, 0.15);
  // Nudge fed with overlay if present
  if (overlays.FED != null) {
    fed.value = money(fed.value + clamp(overlays.FED, -0.25, 0.25));
  }

  const mk = (
    id: string,
    label: string,
    series: { value: number; delta: number },
    note: string
  ): EconomicIndicator => ({
    id,
    label,
    value: series.value,
    unit: "%",
    delta: series.delta,
    trend: series.delta > 0.001 ? "up" : series.delta < -0.001 ? "down" : "flat",
    note,
  });

  return [
    mk("fed", "Fed funds (eff.)", fed, "Policy rate — drives deposit & loan yields"),
    mk("cpi", "CPI (YoY)", cpi, "Consumer inflation — real yield pressure"),
    mk("ppi", "PPI (YoY)", ppi, "Producer prices — pipeline inflation"),
    mk("unemp", "Unemployment", unemp, "Labor market — Fed reaction function"),
    mk("infl", "Inflation (core)", infl, "Sticky inflation vs target 2%"),
    mk("gdp", "GDP growth (ann.)", gdp, "Growth backdrop for credit & RE"),
  ];
}

function buildYields(
  asOf: Date,
  overlays: Record<string, number>
): LiveYieldQuote[] {
  const tnx = macroSeries("tnx", 4.18, asOf, 0.08);
  const irx = macroSeries("irx", 4.05, asOf, 0.06);
  const fyr = macroSeries("fyr", 3.92, asOf, 0.07);
  const hy = macroSeries("hy", 3.55, asOf, 0.05);
  const tip = macroSeries("tip", 1.85, asOf, 0.04);

  if (overlays["^TNX"] != null) {
    tnx.value = money(tnx.value + clamp(overlays["^TNX"], -0.5, 0.5) * 0.15);
  }

  return [
    {
      id: "3m",
      label: "3M T-Bill",
      rate: irx.value,
      delta: irx.delta,
      source: "Gov’t securities",
    },
    {
      id: "10y",
      label: "10Y Treasury",
      rate: tnx.value,
      delta: tnx.delta,
      source: "Gov’t securities",
    },
    {
      id: "ig",
      label: "IG corp bond",
      rate: fyr.value,
      delta: fyr.delta,
      source: "Bonds",
    },
    {
      id: "mm",
      label: "MM / cash yield",
      rate: hy.value,
      delta: hy.delta,
      source: "Yields",
    },
    {
      id: "re",
      label: "REIT yield (ind.)",
      rate: tip.value + 2.4,
      delta: tip.delta,
      source: "Real estate",
    },
  ];
}

/** Map Yahoo ticker change% into overlay keys used by the engine */
export function overlaysFromTickers(
  tickers: { symbol: string; changePercent: number }[]
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const t of tickers) {
    out[t.symbol] = t.changePercent;
  }
  return out;
}
