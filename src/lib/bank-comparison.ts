/**
 * Major-bank benchmark rates for comparison pages.
 * Sources: public rate sheets & financial publishers, reviewed June 2026.
 * Traditional bank APYs vary by ZIP, balance tier, and relationship status.
 */

export const COMPARISON_LAST_UPDATED = "June 2026";

export const COMPARISON_SOURCES = [
  { label: "Bank of America CD rates", url: "https://www.bankofamerica.com/deposits/bank-cds/" },
  { label: "Chase consumer deposit rates", url: "https://www.chase.com/personal/savings" },
  { label: "Wells Fargo CD rates", url: "https://www.wellsfargo.com/savings-cds/rates/" },
  { label: "Capital One 360 CDs", url: "https://www.capitalone.com/bank/cds/" },
  { label: "Citibank CD rates", url: "https://www.citi.com/banking/current-interest-rates/cd" },
  { label: "NerdWallet / Bankrate / Investopedia rate roundups", url: "https://www.nerdwallet.com/banking" },
] as const;

export interface CompetitorBank {
  id: string;
  name: string;
  shortName: string;
  /** Standard savings APY (%) */
  savingsApy: number;
  savingsNote: string;
  /** Typical 12-month CD APY (%) — standard tier */
  cd12MonthApy: number;
  cd12MonthNote: string;
  /** Best advertised promotional CD APY (%) if applicable */
  bestPromoApy?: number;
  bestPromoNote?: string;
  minCdDeposit: string;
  monthlyFeeNote?: string;
  isAwsVision?: boolean;
}

export const COMPETITOR_BANKS: CompetitorBank[] = [
  {
    id: "awsvision",
    name: "AWS Vision",
    shortName: "AWS Vision",
    savingsApy: 9.5,
    savingsNote: "Investment Savings — Elite tier ($100K+). Monthly & yearly gratuity on qualifying balances.",
    cd12MonthApy: 60,
    cd12MonthNote: "Platinum Investment / FD tier — 5% monthly gratuity (180% total over 36 mo program)",
    bestPromoApy: 90,
    bestPromoNote: "Featured FD promo — 90% total return in 6 months on $50K+",
    minCdDeposit: "$5,000",
    isAwsVision: true,
  },
  {
    id: "bofa",
    name: "Bank of America",
    shortName: "BoA",
    savingsApy: 0.01,
    savingsNote: "Advantage Savings — standard tier. Up to 0.04% APY with Preferred Rewards.",
    cd12MonthApy: 0.03,
    cd12MonthNote: "Standard 12-month Fixed Term CD — most terms pay 0.03% APY nationally.",
    bestPromoApy: 3.25,
    bestPromoNote: "Featured CD — 7-month promotional term (varies by market)",
    minCdDeposit: "$1,000",
    monthlyFeeNote: "Checking/savings fees unless waived by balance or rewards tier",
  },
  {
    id: "chase",
    name: "Chase Bank",
    shortName: "Chase",
    savingsApy: 0.01,
    savingsNote: "Chase Savings — 0.01% APY. Relationship rate up to 0.02% with linked checking.",
    cd12MonthApy: 1.5,
    cd12MonthNote: "12-month CD with Chase checking relationship rate.",
    bestPromoApy: 4.0,
    bestPromoNote: "Featured 2–3 month CD — requires linked Chase checking ($100K+ tier)",
    minCdDeposit: "$1,000",
    monthlyFeeNote: "$5/mo savings fee unless waived",
  },
  {
    id: "wellsfargo",
    name: "Wells Fargo",
    shortName: "Wells Fargo",
    savingsApy: 0.01,
    savingsNote: "Way2Save® — 0.01% APY. Platinum Savings up to 2.51% only at $1M+ with Premier Checking.",
    cd12MonthApy: 1.5,
    cd12MonthNote: "Standard 12-month CD.",
    bestPromoApy: 3.49,
    bestPromoNote: "Special Fixed Rate CD — 4-month term, $5,000 minimum",
    minCdDeposit: "$2,500",
    monthlyFeeNote: "$5–$12/mo on savings unless waived",
  },
  {
    id: "capitalone",
    name: "Capital One",
    shortName: "Capital One",
    savingsApy: 3.6,
    savingsNote: "360 Performance Savings — among the stronger big-bank online savings yields.",
    cd12MonthApy: 3.75,
    cd12MonthNote: "12-month 360 CD — competitive vs. other megabanks, still far below AWS Vision program tiers.",
    minCdDeposit: "$0",
  },
  {
    id: "citi",
    name: "Citibank",
    shortName: "Citi",
    savingsApy: 1.18,
    savingsNote: "Citi Accelerate Savings — up to ~1.18% APY in select markets.",
    cd12MonthApy: 2.75,
    cd12MonthNote: "12-month fixed CD — upper range of published tiers.",
    bestPromoApy: 4.0,
    bestPromoNote: "Select short-term promotional CDs — varies by deposit tier",
    minCdDeposit: "$500",
  },
];

export const AWS_VISION_COMPARE_TIERS = [
  {
    id: "silver",
    name: "Silver",
    min: 5_000,
    monthlyRate: 2.0,
    termMonths: 24,
    totalReturn: 48,
  },
  {
    id: "gold",
    name: "Gold",
    min: 10_000,
    monthlyRate: 3.0,
    termMonths: 24,
    totalReturn: 72,
  },
  {
    id: "platinum",
    name: "Platinum",
    min: 50_000,
    monthlyRate: 5.0,
    termMonths: 36,
    totalReturn: 180,
  },
  {
    id: "executive",
    name: "Executive",
    min: 100_000,
    monthlyRate: 7.0,
    termMonths: 60,
    totalReturn: 420,
  },
] as const;

export const COMPARISON_SCENARIOS = [
  { label: "$10,000", principal: 10_000 },
  { label: "$50,000", principal: 50_000 },
  { label: "$100,000", principal: 100_000 },
  { label: "$250,000", principal: 250_000 },
] as const;

/** Annual earnings from a simple APY (traditional savings/CD) */
export function annualApyEarnings(principal: number, apyPercent: number) {
  return (principal * apyPercent) / 100;
}

/** AWS Vision monthly profit model — rate % applied to capital each month (simple) */
export function monthlyProgramEarnings(principal: number, monthlyRatePercent: number, months = 12) {
  return ((principal * monthlyRatePercent) / 100) * months;
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

/** Pick best AWS Vision tier for a principal amount */
export function awsTierForPrincipal(principal: number) {
  const sorted = [...AWS_VISION_COMPARE_TIERS].sort((a, b) => b.min - a.min);
  return sorted.find((t) => principal >= t.min) ?? AWS_VISION_COMPARE_TIERS[0];
}

export function multiplierLabel(awsAmount: number, competitorAmount: number) {
  if (competitorAmount <= 0) return "—";
  const mult = awsAmount / competitorAmount;
  if (mult >= 10) return `${Math.round(mult)}× higher`;
  if (mult >= 1.5) return `${mult.toFixed(1)}× higher`;
  return `${mult.toFixed(2)}×`;
}

export function getSavingsComparisonRows(principal: number) {
  const aws = annualApyEarnings(principal, 9.5); // elite investment savings tier
  return COMPETITOR_BANKS.filter((b) => !b.isAwsVision).map((bank) => {
    const earnings = annualApyEarnings(principal, bank.savingsApy);
    return {
      bank,
      earnings,
      vsAws: aws - earnings,
      multiplier: multiplierLabel(aws, earnings),
    };
  });
}

export function getCdComparisonRows(principal: number) {
  const tier = awsTierForPrincipal(principal);
  const aws = monthlyProgramEarnings(principal, tier.monthlyRate, 12);
  return COMPETITOR_BANKS.filter((b) => !b.isAwsVision).map((bank) => {
    const earnings = annualApyEarnings(principal, bank.cd12MonthApy);
    return {
      bank,
      earnings,
      vsAws: aws - earnings,
      multiplier: multiplierLabel(aws, earnings),
    };
  });
}

export function getInvestmentComparisonRows(principal: number) {
  const tier = awsTierForPrincipal(principal);
  const awsAnnual = monthlyProgramEarnings(principal, tier.monthlyRate, 12);
  const awsProgramTotal = (principal * tier.totalReturn) / 100;

  return {
    tier,
    awsAnnual,
    awsProgramTotal,
    competitors: COMPETITOR_BANKS.filter((b) => !b.isAwsVision).map((bank) => {
      const bestCd = annualApyEarnings(principal, bank.bestPromoApy ?? bank.cd12MonthApy);
      const standardCd = annualApyEarnings(principal, bank.cd12MonthApy);
      const savings = annualApyEarnings(principal, bank.savingsApy);
      return { bank, bestCd, standardCd, savings };
    }),
  };
}
