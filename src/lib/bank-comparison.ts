/**
 * Major-bank benchmark rates — curated from published rate sheets (June 2026).
 * Refreshed via /api/compare/rates; APY = effective annual yield on deposits.
 */

import { INVESTMENT_PLANS } from "@/lib/investment-plans";
import { type ActiveFdPromo, getActiveFdPromo } from "@/lib/promotions";

/** Public compare page always illustrates AWS Vision at the program ceiling (Executive). */
export const AWS_COMPARE_MAX_MONTHLY_RATE = 7;

export const COMPARISON_LAST_UPDATED = "June 18, 2026";

export const COMPARISON_SOURCES = [
  { label: "Chase deposit rates (PDF)", url: "https://www.chase.com/content/dam/chase-ux/ratesheets/pdfs/rdoh3.pdf" },
  { label: "Bank of America CD rates", url: "https://www.bankofamerica.com/deposits/bank-cds/" },
  { label: "Wells Fargo CD rates", url: "https://www.wellsfargo.com/savings-cds/rates/" },
  { label: "Capital One 360 rates", url: "https://www.capitalone.com/bank/savings-accounts/online-performance-savings-account/" },
  { label: "Citibank CD rates", url: "https://www.citi.com/banking/current-interest-rates/cd" },
  { label: "Ally Bank rates", url: "https://www.ally.com/bank/online-savings-account/" },
  { label: "American Express High Yield Savings", url: "https://www.americanexpress.com/en-us/banking/online-savings/high-yield-savings/" },
  { label: "Discover Online Savings", url: "https://www.discover.com/online-banking/savings-account/" },
  { label: "Marcus by Goldman Sachs", url: "https://www.marcus.com/us/en/savings/high-yield-savings" },
  { label: "Fidelity cash / money market", url: "https://www.fidelity.com/trading/margin-cash-rates" },
  { label: "Schwab money market / cash", url: "https://www.schwab.com/money-market-funds" },
  { label: "Vanguard cash / money market", url: "https://investor.vanguard.com/investment-products/mutual-funds/money-market" },
  { label: "Betterment Cash Reserve", url: "https://www.betterment.com/cash-reserve" },
  { label: "Wealthfront Cash Account", url: "https://www.wealthfront.com/cash" },
  { label: "Fortune major-bank CD roundup (Jun 2026)", url: "https://fortune.com/article/major-bank-cd-rates-06-15-2026/" },
  { label: "NerdWallet HYSA rankings (Jun 2026)", url: "https://www.nerdwallet.com/banking/best/high-yield-online-savings-accounts" },
] as const;

export type CompetitorCategory = "bank" | "broker" | "robo" | "advisor";

export interface CompetitorBank {
  id: string;
  name: string;
  shortName: string;
  /** Retail bank vs brokerage / robo / advisor — affects UI grouping */
  category: CompetitorCategory;
  savingsApy: number;
  savingsNote: string;
  cd12MonthApy: number;
  cd12MonthNote: string;
  bestPromoApy?: number;
  bestPromoTermMonths?: number;
  bestPromoNote?: string;
  minCdDeposit: string;
  monthlyFeeNote?: string;
  sourceUrl?: string;
  isAwsVision?: boolean;
}

export function competitorCategoryLabel(category: CompetitorCategory) {
  switch (category) {
    case "bank":
      return "Bank";
    case "broker":
      return "Brokerage";
    case "robo":
      return "Robo-advisor";
    case "advisor":
      return "Wealth advisor";
  }
}

/** Highest published savings or CD APY we compare against (not standard 0.01% checking-linked savings). */
export function bestComparableApy(bank: CompetitorBank) {
  return Math.max(bank.savingsApy, bank.cd12MonthApy, bank.bestPromoApy ?? 0);
}

/** AWS Vision investment savings — monthly gratuity tiers (not bank APY). Advantage tier is true APY. */
export const AWS_SAVINGS_TIERS = [
  { min: 100_000, monthlyRate: 9.5, label: "Investment Savings — Elite", isBankApy: false },
  { min: 10_000, monthlyRate: 7.5, label: "Investment Savings — Growth", isBankApy: false },
  { min: 1_000, monthlyRate: 6.0, label: "Investment Savings — Starter", isBankApy: false },
  { min: 0, monthlyRate: 0.01, label: "Advantage Savings", isBankApy: true },
] as const;

export function awsSavingsAnnualSimplePercent(tier: (typeof AWS_SAVINGS_TIERS)[number]) {
  return tier.isBankApy ? tier.monthlyRate : tier.monthlyRate * 12;
}

export function awsSavingsYearEarnings(principal: number, tier: (typeof AWS_SAVINGS_TIERS)[number]) {
  if (tier.isBankApy) {
    return apyOneYearEarnings(principal, tier.monthlyRate);
  }
  return monthlyProgramSimple(principal, tier.monthlyRate, 12);
}

export function formatAwsSavingsRateLabel(tier: (typeof AWS_SAVINGS_TIERS)[number]) {
  if (tier.isBankApy) {
    return `${formatComparePercent(tier.monthlyRate)} APY`;
  }
  const annual = awsSavingsAnnualSimplePercent(tier);
  return `${formatComparePercent(tier.monthlyRate)}/mo (${formatComparePercent(annual, annual % 1 === 0 ? 0 : 1)} annual simple)`;
}

/** Investment plan rate label for compare page — public copy hides exact tier % */
export function formatInvestmentPlanRateLabel(_plan: { monthlyRate: number; name: string }) {
  return `Up to ${formatComparePercent(AWS_COMPARE_MAX_MONTHLY_RATE, 0)}/mo · Talk to Support`;
}

/**
 * Competitor benchmarks — banks + major U.S. investment platforms.
 * For brokerages/robos we use published cash / money-market / cash-reserve yields (not equity returns).
 * Rates are illustrative as of COMPARISON_LAST_UPDATED and change often.
 */
export const COMPETITOR_BANKS: CompetitorBank[] = [
  {
    id: "bofa",
    name: "Bank of America",
    shortName: "BoA",
    category: "bank",
    savingsApy: 0.04,
    savingsNote:
      "Advantage Savings — 0.04% APY standard. Featured & flexible CDs advertise higher fixed yields.",
    cd12MonthApy: 2.5,
    cd12MonthNote: "12-month Flexible CD — published tier (Bankrate, Jun 2026).",
    bestPromoApy: 4.5,
    bestPromoTermMonths: 7,
    bestPromoNote: "Featured CD — up to ~4.50% APY on select terms (varies by market, $1,000 min)",
    minCdDeposit: "$1,000",
    monthlyFeeNote: "$8/mo savings fee unless waived",
    sourceUrl: "https://www.bankofamerica.com/deposits/bank-cds/",
  },
  {
    id: "chase",
    name: "Chase Bank",
    shortName: "Chase",
    category: "bank",
    savingsApy: 0.01,
    savingsNote: "Chase Savings — 0.01% APY. Premier Savings up to 0.02% with qualifying relationship.",
    cd12MonthApy: 1.5,
    cd12MonthNote: "12-month standard CD — 1.50% APY per Chase deposit rate sheet (Jun 2026).",
    bestPromoApy: 4.0,
    bestPromoTermMonths: 3,
    bestPromoNote: "Featured 3-month CD — 4.00% APY with Private Client relationship (Jun 2026)",
    minCdDeposit: "$1,000",
    monthlyFeeNote: "$5/mo savings fee unless waived",
    sourceUrl: "https://www.chase.com/content/dam/chase-ux/ratesheets/pdfs/rdil2.pdf",
  },
  {
    id: "wellsfargo",
    name: "Wells Fargo",
    shortName: "Wells Fargo",
    category: "bank",
    savingsApy: 0.01,
    savingsNote: "Way2Save® — 0.01% APY. Platinum Savings up to 0.05% with Premier Checking.",
    cd12MonthApy: 2.0,
    cd12MonthNote: "Standard 12-month fixed CD — published tier (Jun 2026).",
    bestPromoApy: 4.0,
    bestPromoTermMonths: 4,
    bestPromoNote: "Special Fixed Rate CD — promotional terms up to 4.00% APY (Fortune major-bank roundup, Jun 2026)",
    minCdDeposit: "$2,500",
    monthlyFeeNote: "$5–$12/mo on savings unless waived",
    sourceUrl: "https://www.wellsfargo.com/savings-cds/rates/",
  },
  {
    id: "capitalone",
    name: "Capital One",
    shortName: "Capital One",
    category: "bank",
    savingsApy: 3.1,
    savingsNote: "360 Performance Savings — ~3.10% variable APY (NerdWallet / bank disclosures, Jun 2026).",
    cd12MonthApy: 3.75,
    cd12MonthNote: "12-month 360 CD — competitive online tier.",
    bestPromoApy: 4.25,
    bestPromoTermMonths: 11,
    bestPromoNote: "Select promotional 360 CD terms — up to ~4.25% APY on featured maturities",
    minCdDeposit: "$0",
    sourceUrl: "https://www.capitalone.com/bank/savings-accounts/",
  },
  {
    id: "citi",
    name: "Citibank",
    shortName: "Citi",
    category: "bank",
    savingsApy: 3.1,
    savingsNote: "Citi Accelerate Savings — up to 3.10% APY in eligible markets.",
    cd12MonthApy: 2.75,
    cd12MonthNote: "12-month fixed CD — standard published tier.",
    bestPromoApy: 4.35,
    bestPromoTermMonths: 6,
    bestPromoNote: "Promotional CDs — up to ~4.35% APY on select terms (Fortune major-bank roundup, Jun 2026)",
    minCdDeposit: "$500",
    sourceUrl: "https://www.citi.com/banking/current-interest-rates/cd",
  },
  {
    id: "ally",
    name: "Ally Bank",
    shortName: "Ally",
    category: "bank",
    savingsApy: 3.3,
    savingsNote: "Online Savings Account — competitive variable HYSA APY (illustrative Jun 2026 tier).",
    cd12MonthApy: 3.9,
    cd12MonthNote: "12-month High Yield CD — online published tier.",
    bestPromoApy: 4.4,
    bestPromoTermMonths: 9,
    bestPromoNote: "Featured CD terms — up to ~4.40% APY on select maturities",
    minCdDeposit: "$0",
    sourceUrl: "https://www.ally.com/bank/online-savings-account/",
  },
  {
    id: "amex",
    name: "American Express",
    shortName: "Amex",
    category: "bank",
    savingsApy: 3.3,
    savingsNote: "High Yield Savings — variable APY for Personal Savings (illustrative Jun 2026).",
    cd12MonthApy: 3.5,
    cd12MonthNote: "12-month CD — Personal Savings CD tier when offered.",
    bestPromoApy: 4.2,
    bestPromoTermMonths: 11,
    bestPromoNote: "Select CD promotions — up to ~4.20% APY on featured terms",
    minCdDeposit: "$0",
    sourceUrl: "https://www.americanexpress.com/en-us/banking/online-savings/high-yield-savings/",
  },
  {
    id: "discover",
    name: "Discover Bank",
    shortName: "Discover",
    category: "bank",
    savingsApy: 3.4,
    savingsNote: "Online Savings — competitive HYSA APY (illustrative Jun 2026).",
    cd12MonthApy: 3.85,
    cd12MonthNote: "12-month CD — online published tier.",
    bestPromoApy: 4.3,
    bestPromoTermMonths: 9,
    bestPromoNote: "Featured CD — up to ~4.30% APY on select terms",
    minCdDeposit: "$0",
    sourceUrl: "https://www.discover.com/online-banking/savings-account/",
  },
  {
    id: "marcus",
    name: "Marcus by Goldman Sachs",
    shortName: "Marcus",
    category: "bank",
    savingsApy: 3.5,
    savingsNote: "Online High-Yield Savings — variable APY (illustrative Jun 2026).",
    cd12MonthApy: 3.9,
    cd12MonthNote: "12-month CD — Marcus online CD tier.",
    bestPromoApy: 4.4,
    bestPromoTermMonths: 14,
    bestPromoNote: "Select CD terms — up to ~4.40% APY on featured maturities",
    minCdDeposit: "$500",
    sourceUrl: "https://www.marcus.com/us/en/savings/high-yield-savings",
  },
  {
    id: "usbank",
    name: "U.S. Bank",
    shortName: "U.S. Bank",
    category: "bank",
    savingsApy: 0.01,
    savingsNote: "Standard savings — typically low single-digit basis points without relationship packages.",
    cd12MonthApy: 2.25,
    cd12MonthNote: "12-month standard CD — published branch/online tier (illustrative).",
    bestPromoApy: 3.9,
    bestPromoTermMonths: 7,
    bestPromoNote: "Special CD offers — up to ~3.90% APY in select markets",
    minCdDeposit: "$1,000",
    monthlyFeeNote: "Monthly savings fees may apply unless waived",
    sourceUrl: "https://www.usbank.com/bank-accounts/savings-accounts.html",
  },
  {
    id: "pnc",
    name: "PNC Bank",
    shortName: "PNC",
    category: "bank",
    savingsApy: 0.02,
    savingsNote: "Standard savings — low APY without High Yield Savings relationship.",
    cd12MonthApy: 2.4,
    cd12MonthNote: "12-month fixed-rate CD — illustrative published tier.",
    bestPromoApy: 4.0,
    bestPromoTermMonths: 4,
    bestPromoNote: "Promotional CD — up to ~4.00% APY on short featured terms",
    minCdDeposit: "$1,000",
    sourceUrl: "https://www.pnc.com/en/personal-banking/banking/savings.html",
  },
  {
    id: "td",
    name: "TD Bank",
    shortName: "TD",
    category: "bank",
    savingsApy: 0.02,
    savingsNote: "TD Savings — low standard APY; relationship tiers may pay more.",
    cd12MonthApy: 2.5,
    cd12MonthNote: "12-month TD CD — illustrative published tier.",
    bestPromoApy: 4.0,
    bestPromoTermMonths: 6,
    bestPromoNote: "Special rate CDs — up to ~4.00% APY on select terms",
    minCdDeposit: "$250",
    sourceUrl: "https://www.td.com/us/en/personal-banking/checking-and-savings/savings-accounts",
  },
  {
    id: "truist",
    name: "Truist",
    shortName: "Truist",
    category: "bank",
    savingsApy: 0.01,
    savingsNote: "Standard savings — low APY without premium relationship.",
    cd12MonthApy: 2.35,
    cd12MonthNote: "12-month CD — illustrative published tier.",
    bestPromoApy: 3.95,
    bestPromoTermMonths: 7,
    bestPromoNote: "Featured CD — up to ~3.95% APY on select terms",
    minCdDeposit: "$1,000",
    sourceUrl: "https://www.truist.com/banking/savings",
  },
  // —— Investment firms / brokerages / robos (cash & MM yields, NOT stock returns) ——
  {
    id: "fidelity",
    name: "Fidelity Investments",
    shortName: "Fidelity",
    category: "broker",
    savingsApy: 4.2,
    savingsNote:
      "Brokerage cash / core money market yields (e.g. government MM) — illustrative ~4.2% (not equity returns). Advisory AUM fees are separate.",
    cd12MonthApy: 4.0,
    cd12MonthNote: "Brokered CD marketplace — illustrative 12-mo secondary/new issue tier.",
    bestPromoApy: 4.5,
    bestPromoTermMonths: 6,
    bestPromoNote: "Higher short-term MM / CD offerings when available — up to ~4.5% illustrative",
    minCdDeposit: "$1,000",
    monthlyFeeNote: "Brokerage: $0 stock commissions typical; advisory fees if enrolled",
    sourceUrl: "https://www.fidelity.com/",
  },
  {
    id: "schwab",
    name: "Charles Schwab",
    shortName: "Schwab",
    category: "broker",
    savingsApy: 4.15,
    savingsNote:
      "Schwab money market / cash features — illustrative yield ~4.15% (cash, not stock market returns).",
    cd12MonthApy: 4.0,
    cd12MonthNote: "Brokered CDs via Schwab — illustrative 12-month tier.",
    bestPromoApy: 4.45,
    bestPromoTermMonths: 6,
    bestPromoNote: "Featured short MM/CD cash options — up to ~4.45% illustrative",
    minCdDeposit: "$1,000",
    monthlyFeeNote: "Brokerage commissions $0 typical; Schwab Wealth advisory fees if used",
    sourceUrl: "https://www.schwab.com/",
  },
  {
    id: "vanguard",
    name: "Vanguard",
    shortName: "Vanguard",
    category: "broker",
    savingsApy: 4.1,
    savingsNote:
      "Vanguard Federal Money Market / cash settlement — illustrative ~4.1% (fund yield, not equity).",
    cd12MonthApy: 3.95,
    cd12MonthNote: "Brokered CD options when available — illustrative 12-mo.",
    bestPromoApy: 4.35,
    bestPromoTermMonths: 6,
    bestPromoNote: "Higher cash/MM yields in elevated-rate environments — up to ~4.35% illustrative",
    minCdDeposit: "$3,000",
    monthlyFeeNote: "Fund expense ratios apply; advisory (PAS) fees if enrolled",
    sourceUrl: "https://investor.vanguard.com/",
  },
  {
    id: "etrade",
    name: "E*TRADE (Morgan Stanley)",
    shortName: "E*TRADE",
    category: "broker",
    savingsApy: 0.15,
    savingsNote: "Brokerage cash sweep — often low; higher yields via money market funds (illustrative).",
    cd12MonthApy: 3.9,
    cd12MonthNote: "Brokered CD desk — illustrative 12-month.",
    bestPromoApy: 4.25,
    bestPromoTermMonths: 6,
    bestPromoNote: "Money market / promo cash products — up to ~4.25% illustrative",
    minCdDeposit: "$1,000",
    monthlyFeeNote: "Morgan Stanley Wealth Management advisory fees if applicable",
    sourceUrl: "https://us.etrade.com/",
  },
  {
    id: "merrill",
    name: "Merrill (Bank of America)",
    shortName: "Merrill",
    category: "advisor",
    savingsApy: 0.04,
    savingsNote: "Linked BoA / Merrill cash — low deposit APY unless Preferred Deposit / MM elected.",
    cd12MonthApy: 2.5,
    cd12MonthNote: "BoA/Merrill CD offerings — similar to Bank of America published tiers.",
    bestPromoApy: 4.5,
    bestPromoTermMonths: 7,
    bestPromoNote: "Featured bank CD via BoA relationship — up to ~4.50% illustrative",
    minCdDeposit: "$1,000",
    monthlyFeeNote: "Merrill advisory wrap fees typically ~1% AUM range (varies)",
    sourceUrl: "https://www.ml.com/",
  },
  {
    id: "betterment",
    name: "Betterment",
    shortName: "Betterment",
    category: "robo",
    savingsApy: 4.0,
    savingsNote: "Cash Reserve — variable cash APY (illustrative ~4.0%). Investing portfolios are separate (market risk).",
    cd12MonthApy: 0,
    cd12MonthNote: "No traditional bank CD product — cash reserve used for comparison.",
    bestPromoApy: 4.25,
    bestPromoTermMonths: 12,
    bestPromoNote: "Cash Reserve can move with Fed funds — up to ~4.25% illustrative peaks",
    minCdDeposit: "$10",
    monthlyFeeNote: "Investing advisory fee on invested balance (Cash Reserve fee structure differs)",
    sourceUrl: "https://www.betterment.com/cash-reserve",
  },
  {
    id: "wealthfront",
    name: "Wealthfront",
    shortName: "Wealthfront",
    category: "robo",
    savingsApy: 4.0,
    savingsNote: "Cash Account — variable APY (illustrative ~4.0%). Automated investing portfolios are separate.",
    cd12MonthApy: 0,
    cd12MonthNote: "No classic CD — cash account APY used for 12-mo cash comparison.",
    bestPromoApy: 4.3,
    bestPromoTermMonths: 12,
    bestPromoNote: "Cash APY fluctuates — up to ~4.30% illustrative",
    minCdDeposit: "$1",
    monthlyFeeNote: "0.25% advisory on investment accounts (Cash Account terms differ)",
    sourceUrl: "https://www.wealthfront.com/cash",
  },
  {
    id: "edwardjones",
    name: "Edward Jones",
    shortName: "Edward Jones",
    category: "advisor",
    savingsApy: 0.05,
    savingsNote: "Bank deposit / cash sweep options via partners — typically low vs HYSA (illustrative).",
    cd12MonthApy: 3.5,
    cd12MonthNote: "Brokered / bank CD offerings through advisors — illustrative 12-mo.",
    bestPromoApy: 4.1,
    bestPromoTermMonths: 9,
    bestPromoNote: "Select CD inventory — up to ~4.10% illustrative",
    minCdDeposit: "$1,000",
    monthlyFeeNote: "Advisor-sold mutual funds / advisory fees commonly apply",
    sourceUrl: "https://www.edwardjones.com/",
  },
  {
    id: "fisher",
    name: "Fisher Investments",
    shortName: "Fisher",
    category: "advisor",
    savingsApy: 0,
    savingsNote: "Primarily discretionary portfolio management — not a HYSA bank. Cash drag varies; equity returns not used here.",
    cd12MonthApy: 0,
    cd12MonthNote: "No retail CD product comparable to bank CDs.",
    minCdDeposit: "High AUM minimums typical",
    monthlyFeeNote: "Asset-based advisory fees (varies by mandate)",
    sourceUrl: "https://www.fisherinvestments.com/",
  },
];

export const COMPETITOR_RETAIL_BANKS = COMPETITOR_BANKS.filter((b) => b.category === "bank");
export const COMPETITOR_INVESTMENT_FIRMS = COMPETITOR_BANKS.filter((b) => b.category !== "bank");

export const COMPARISON_SCENARIOS = [
  { label: "$10,000", principal: 10_000 },
  { label: "$50,000", principal: 50_000 },
  { label: "$100,000", principal: 100_000 },
  { label: "$250,000", principal: 250_000 },
] as const;

/** 1-year earnings from stated APY (APY already reflects annual effective yield) */
export function apyOneYearEarnings(principal: number, apyPercent: number) {
  if (apyPercent <= 0) return 0;
  return principal * (apyPercent / 100);
}

/** AWS monthly program — simple monthly profit (rate % × capital × months) */
export function monthlyProgramSimple(principal: number, monthlyRatePercent: number, months = 12) {
  return ((principal * monthlyRatePercent) / 100) * months;
}

/** AWS monthly program — compound monthly (when compound interest is enabled) */
export function monthlyProgramCompound(principal: number, monthlyRatePercent: number, months = 12) {
  return principal * (Math.pow(1 + monthlyRatePercent / 100, months) - 1);
}

export function awsProgramEarnings(
  principal: number,
  monthlyRatePercent: number,
  months = 12,
  compound = true
) {
  return compound
    ? monthlyProgramCompound(principal, monthlyRatePercent, months)
    : monthlyProgramSimple(principal, monthlyRatePercent, months);
}

export function formatCompareUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatComparePercent(value: number, decimals = 2) {
  return `${value.toFixed(decimals)}%`;
}

export function awsSavingsTierForPrincipal(principal: number) {
  return AWS_SAVINGS_TIERS.find((t) => principal >= t.min) ?? AWS_SAVINGS_TIERS[AWS_SAVINGS_TIERS.length - 1];
}

export function awsIllustrativeComparePlan() {
  const sorted = [...INVESTMENT_PLANS].sort((a, b) => b.monthlyRate - a.monthlyRate);
  return sorted.find((p) => p.monthlyRate >= AWS_COMPARE_MAX_MONTHLY_RATE) ?? sorted[0];
}

export function awsInvestmentTierForPrincipal(principal: number) {
  const sorted = [...INVESTMENT_PLANS].sort((a, b) => b.minInvestment - a.minInvestment);
  return sorted.find((t) => principal >= t.minInvestment) ?? INVESTMENT_PLANS[0];
}

export function multiplierLabel(awsAmount: number, competitorAmount: number) {
  if (competitorAmount <= 0) return awsAmount > 0 ? "∞× higher" : "—";
  const mult = awsAmount / competitorAmount;
  if (mult >= 100) return `${Math.round(mult)}× higher`;
  if (mult >= 10) return `${mult.toFixed(0)}× higher`;
  if (mult >= 1.5) return `${mult.toFixed(1)}× higher`;
  if (mult >= 1) return `${mult.toFixed(2)}× higher`;
  return `${mult.toFixed(2)}×`;
}

export interface SavingsCompareRow {
  bank: CompetitorBank | { id: string; name: string; savingsApy: number };
  apy: number;
  rateLabel: string;
  earnings: number;
  vsAws: number;
  multiplier: string;
  isAws?: boolean;
}

export interface CdCompareRow {
  bank: CompetitorBank;
  apyUsed: number;
  apyLabel: string;
  earnings: number;
  vsAws: number;
  multiplier: string;
  isPromo: boolean;
}

export interface ComparisonReport {
  principal: number;
  lastUpdated: string;
  aws: {
    investmentTier: (typeof INVESTMENT_PLANS)[number];
    /** Illustrative ceiling used for public compare (always up to 7%/mo) */
    savingsMonthlyRate: number;
    savingsAnnualSimplePercent: number;
    /** @deprecated use savingsAnnualSimplePercent — kept for API compat */
    savingsApy: number;
    /** monthly rate × 12 months on principal (simple) at illustrative ceiling */
    savingsYearEarnings: number;
    investmentYearSimple: number;
    investmentYearCompound: number;
    fdPromo: ReturnType<typeof getActiveFdPromo> | null;
    fdPromoYearEarnings: number | null;
    /** Public disclaimer — rates vary by enrolled capital */
    ratesVaryByCapital: true;
  };
  savings: SavingsCompareRow[];
  cds: CdCompareRow[];
  investment: {
    awsAnnualCompound: number;
    awsProgramTotal: number;
    competitors: {
      bank: CompetitorBank;
      savingsYear: number;
      cdStandardYear: number;
      cdPromoYear: number | null;
      bestBankYear: number;
    }[];
  };
  hero: {
    awsInvestmentYear: number;
    chaseCdYear: number;
    multiplierVsChaseCd: string;
    tierName: string;
    monthlyRate: number;
  };
}

export function buildComparisonReport(
  principal: number,
  promoOverride?: ActiveFdPromo | null
): ComparisonReport {
  // Public compare illustrates the highest program rate (up to 7%/mo). Actual client rates vary by capital.
  const investmentTier = awsIllustrativeComparePlan();
  const promo =
    promoOverride === undefined ? getActiveFdPromo() : promoOverride;

  const awsMonthlyRate = AWS_COMPARE_MAX_MONTHLY_RATE;
  const awsAnnualSimple = awsMonthlyRate * 12;
  const awsInvestmentSimple = monthlyProgramSimple(principal, awsMonthlyRate, 12);
  const awsInvestmentCompound = awsProgramEarnings(
    principal,
    awsMonthlyRate,
    12,
    investmentTier.compoundInterest
  );

  const fdPromoMonthlyRate = promo ? promo.returnPercent / promo.termMonths : 0;
  const fdPromoYearEarnings =
    promo && principal >= promo.minDeposit
      ? monthlyProgramSimple(principal, fdPromoMonthlyRate, Math.min(12, promo.termMonths))
      : null;

  const awsSavingsRow: SavingsCompareRow = {
    bank: { id: "awsvision", name: "AWS Vision", savingsApy: awsAnnualSimple },
    apy: awsAnnualSimple,
    rateLabel: formatInvestmentPlanRateLabel(investmentTier),
    earnings: awsInvestmentSimple,
    vsAws: 0,
    multiplier: "—",
    isAws: true,
  };

  const savingsRows: SavingsCompareRow[] = [
    awsSavingsRow,
    ...COMPETITOR_BANKS.filter((bank) => bestComparableApy(bank) > 0).map((bank) => {
      const apy = bestComparableApy(bank);
      const earnings = apyOneYearEarnings(principal, apy);
      const kind =
        bank.category === "bank"
          ? "deposit APY"
          : bank.category === "robo"
            ? "cash reserve"
            : "cash / MM yield";
      return {
        bank,
        apy,
        rateLabel: `${formatComparePercent(apy)} APY (${kind})`,
        earnings,
        vsAws: awsInvestmentSimple - earnings,
        multiplier: multiplierLabel(awsInvestmentSimple, earnings),
      };
    }),
  ];

  const awsCdYear = awsInvestmentCompound;

  const cdRows: CdCompareRow[] = COMPETITOR_BANKS.flatMap((bank) => {
    const rows: CdCompareRow[] = [];
    if (bank.cd12MonthApy > 0) {
      const standardEarn = apyOneYearEarnings(principal, bank.cd12MonthApy);
      rows.push({
        bank,
        apyUsed: bank.cd12MonthApy,
        apyLabel:
          bank.category === "bank"
            ? `${formatComparePercent(bank.cd12MonthApy)} APY (12-mo CD)`
            : `${formatComparePercent(bank.cd12MonthApy)} APY (cash/CD)`,
        earnings: standardEarn,
        vsAws: awsCdYear - standardEarn,
        multiplier: multiplierLabel(awsCdYear, standardEarn),
        isPromo: false,
      });
    }
    if (bank.bestPromoApy) {
      const promoEarnings = apyOneYearEarnings(principal, bank.bestPromoApy);
      rows.push({
        bank,
        apyUsed: bank.bestPromoApy,
        apyLabel: `${formatComparePercent(bank.bestPromoApy)} APY promo (${bank.bestPromoTermMonths ?? "?"}-mo)`,
        earnings: promoEarnings,
        vsAws: awsCdYear - promoEarnings,
        multiplier: multiplierLabel(awsCdYear, promoEarnings),
        isPromo: true,
      });
    }
    return rows;
  });

  const chase = COMPETITOR_BANKS.find((b) => b.id === "chase")!;
  const chaseCdYear = apyOneYearEarnings(principal, chase.cd12MonthApy);

  const investmentCompetitors = COMPETITOR_BANKS.map((bank) => {
    const savingsYear = apyOneYearEarnings(principal, bestComparableApy(bank));
    const cdStandardYear = apyOneYearEarnings(principal, bank.cd12MonthApy);
    const cdPromoYear = bank.bestPromoApy
      ? apyOneYearEarnings(principal, bank.bestPromoApy)
      : null;
    const bestBankYear = Math.max(savingsYear, cdStandardYear, cdPromoYear ?? 0);
    return { bank, savingsYear, cdStandardYear, cdPromoYear, bestBankYear };
  });

  return {
    principal,
    lastUpdated: COMPARISON_LAST_UPDATED,
    aws: {
      investmentTier,
      savingsMonthlyRate: awsMonthlyRate,
      savingsAnnualSimplePercent: awsAnnualSimple,
      savingsApy: awsAnnualSimple,
      savingsYearEarnings: awsInvestmentSimple,
      investmentYearSimple: awsInvestmentSimple,
      investmentYearCompound: awsInvestmentCompound,
      fdPromo: promo && principal >= promo.minDeposit ? promo : null,
      fdPromoYearEarnings,
      ratesVaryByCapital: true,
    },
    savings: savingsRows,
    cds: cdRows,
    investment: {
      awsAnnualCompound: awsInvestmentCompound,
      awsProgramTotal: (principal * investmentTier.totalRoiPercent) / 100,
      competitors: investmentCompetitors,
    },
    hero: {
      awsInvestmentYear: awsInvestmentSimple,
      chaseCdYear,
      multiplierVsChaseCd: multiplierLabel(awsInvestmentSimple, chaseCdYear),
      tierName: "Up to 7% monthly",
      monthlyRate: awsMonthlyRate,
    },
  };
}

/** @deprecated use apyOneYearEarnings */
export const annualApyEarnings = apyOneYearEarnings;

/** @deprecated use awsInvestmentTierForPrincipal */
export const awsTierForPrincipal = awsInvestmentTierForPrincipal;

/** @deprecated use INVESTMENT_PLANS */
export const AWS_VISION_COMPARE_TIERS = INVESTMENT_PLANS.map((p) => ({
  id: p.id,
  name: p.name,
  min: p.minInvestment,
  monthlyRate: p.monthlyRate,
  termMonths: p.termMonths,
  totalReturn: p.totalRoiPercent,
}));

export function getSavingsComparisonRows(principal: number) {
  return buildComparisonReport(principal).savings.filter((r) => !r.isAws);
}

export function getCdComparisonRows(principal: number) {
  return buildComparisonReport(principal).cds.filter((r) => !r.isPromo);
}

export function getInvestmentComparisonRows(principal: number) {
  const report = buildComparisonReport(principal);
  return {
    tier: report.aws.investmentTier,
    awsAnnual: report.investment.awsAnnualCompound,
    awsProgramTotal: report.investment.awsProgramTotal,
    competitors: report.investment.competitors,
  };
}

/** @deprecated use monthlyProgramSimple */
export const monthlyProgramEarnings = monthlyProgramSimple;
