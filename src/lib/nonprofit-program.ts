/** Non-profit organization fund program — $100K–$1M, 8%–10% monthly */

export const NONPROFIT_MIN_CAPITAL = 100_000;
export const NONPROFIT_MAX_CAPITAL = 1_000_000;
export const NONPROFIT_MIN_MONTHLY_RATE = 8;
export const NONPROFIT_MAX_MONTHLY_RATE = 10;

export const NONPROFIT_CAPITAL_TIERS = [
  { capital: 100_000, monthlyRate: 8.0, label: "Foundation" },
  { capital: 250_000, monthlyRate: 8.44, label: "Growth" },
  { capital: 500_000, monthlyRate: 8.89, label: "Impact" },
  { capital: 750_000, monthlyRate: 9.33, label: "Legacy" },
  { capital: 1_000_000, monthlyRate: 10.0, label: "Premier" },
] as const;

export const ORGANIZATION_TYPES = [
  { value: "501c3", label: "501(c)(3) — Charitable Organization" },
  { value: "501c4", label: "501(c)(4) — Social Welfare" },
  { value: "foundation", label: "Private / Community Foundation" },
  { value: "religious", label: "Religious / Faith-Based Organization" },
  { value: "educational", label: "Educational Institution / Endowment" },
  { value: "other", label: "Other Tax-Exempt Non-Profit" },
] as const;

/** Monthly profit rate (%) based on enrolled capital — linear 8% @ $100K to 10% @ $1M */
export function getNonprofitMonthlyRate(capital: number): number {
  const min = NONPROFIT_MIN_CAPITAL;
  const max = NONPROFIT_MAX_CAPITAL;
  const clamped = Math.max(min, Math.min(max, capital));
  const ratio = (clamped - min) / (max - min);
  const rate = NONPROFIT_MIN_MONTHLY_RATE + ratio * (NONPROFIT_MAX_MONTHLY_RATE - NONPROFIT_MIN_MONTHLY_RATE);
  return Math.round(rate * 100) / 100;
}

export function formatNonprofitUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function estimateMonthlyProfit(capital: number): number {
  return (capital * getNonprofitMonthlyRate(capital)) / 100;
}

export function getTierForCapital(capital: number) {
  return NONPROFIT_CAPITAL_TIERS.reduce((best, tier) =>
    Math.abs(tier.capital - capital) < Math.abs(best.capital - capital) ? tier : best
  );
}
