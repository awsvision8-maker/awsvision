/**
 * Major-bank benchmark rates — curated from published rate sheets (June 2026).
 * Refreshed via /api/compare/rates; APY = effective annual yield on deposits.
 */

import { INVESTMENT_PLANS } from "@/lib/investment-plans";
import { getActiveFdPromo } from "@/lib/promotions";

export const COMPARISON_LAST_UPDATED = "June 18, 2026";

export const COMPARISON_SOURCES = [
  { label: "Chase deposit rates (PDF)", url: "https://www.chase.com/content/dam/chase-ux/ratesheets/pdfs/rdoh3.pdf" },
  { label: "Bank of America CD rates", url: "https://www.bankofamerica.com/deposits/bank-cds/" },
  { label: "Wells Fargo CD rates", url: "https://www.wellsfargo.com/savings-cds/rates/" },
  { label: "Capital One 360 rates", url: "https://www.capitalone.com/bank/savings-accounts/online-performance-savings-account/" },
  { label: "Citibank CD rates", url: "https://www.citi.com/banking/current-interest-rates/cd" },
  { label: "Fortune major-bank CD roundup (Jun 2026)", url: "https://fortune.com/article/major-bank-cd-rates-06-15-2026/" },
  { label: "NerdWallet HYSA rankings (Jun 2026)", url: "https://www.nerdwallet.com/banking/best/high-yield-online-savings-accounts" },
] as const;

export interface CompetitorBank {
  id: string;
  name: string;
  shortName: string;
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

/** Highest published savings or CD APY we compare against (not standard 0.01% checking-linked savings). */
export function bestComparableApy(bank: CompetitorBank) {
  return Math.max(bank.savingsApy, bank.cd12MonthApy, bank.bestPromoApy ?? 0);
}

/** AWS Vision savings APY tiers (from /rates page) */
export const AWS_SAVINGS_TIERS = [
  { min: 100_000, apy: 9.5, label: "Investment Savings — Elite" },
  { min: 10_000, apy: 7.5, label: "Investment Savings — Growth" },
  { min: 1_000, apy: 6.0, label: "Investment Savings — Starter" },
  { min: 0, apy: 0.01, label: "Advantage Savings" },
] as const;

export const COMPETITOR_BANKS: CompetitorBank[] = [
  {
    id: "bofa",
    name: "Bank of America",
    shortName: "BoA",
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
];

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
    savingsTier: (typeof AWS_SAVINGS_TIERS)[number];
    savingsApy: number;
    savingsYearEarnings: number;
    investmentTier: (typeof INVESTMENT_PLANS)[number];
    investmentYearSimple: number;
    investmentYearCompound: number;
    fdPromo: ReturnType<typeof getActiveFdPromo> | null;
    fdPromoYearEarnings: number | null;
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

export function buildComparisonReport(principal: number): ComparisonReport {
  const savingsTier = awsSavingsTierForPrincipal(principal);
  const investmentTier = awsInvestmentTierForPrincipal(principal);
  const promo = getActiveFdPromo();

  const awsSavingsYear = apyOneYearEarnings(principal, savingsTier.apy);
  const awsInvestmentSimple = monthlyProgramSimple(principal, investmentTier.monthlyRate, 12);
  const awsInvestmentCompound = awsProgramEarnings(
    principal,
    investmentTier.monthlyRate,
    12,
    investmentTier.compoundInterest
  );

  const fdPromoMonthlyRate = promo.returnPercent / promo.termMonths;
  const fdPromoYearEarnings =
    principal >= promo.minDeposit
      ? monthlyProgramSimple(principal, fdPromoMonthlyRate, Math.min(12, promo.termMonths))
      : null;

  const awsSavingsRow: SavingsCompareRow = {
    bank: { id: "awsvision", name: "AWS Vision", savingsApy: savingsTier.apy },
    apy: savingsTier.apy,
    earnings: awsSavingsYear,
    vsAws: 0,
    multiplier: "—",
    isAws: true,
  };

  const savingsRows: SavingsCompareRow[] = [
    awsSavingsRow,
    ...COMPETITOR_BANKS.map((bank) => {
      const apy = bestComparableApy(bank);
      const earnings = apyOneYearEarnings(principal, apy);
      return {
        bank,
        apy,
        earnings,
        vsAws: awsSavingsYear - earnings,
        multiplier: multiplierLabel(awsSavingsYear, earnings),
      };
    }),
  ];

  const awsCdYear = awsInvestmentCompound;

  const cdRows: CdCompareRow[] = COMPETITOR_BANKS.flatMap((bank) => {
    const standard: CdCompareRow = {
      bank,
      apyUsed: bank.cd12MonthApy,
      apyLabel: `${formatComparePercent(bank.cd12MonthApy)} APY (12-mo CD)`,
      earnings: apyOneYearEarnings(principal, bank.cd12MonthApy),
      vsAws: awsCdYear - apyOneYearEarnings(principal, bank.cd12MonthApy),
      multiplier: multiplierLabel(awsCdYear, apyOneYearEarnings(principal, bank.cd12MonthApy)),
      isPromo: false,
    };
    if (bank.bestPromoApy) {
      const promoEarnings = apyOneYearEarnings(principal, bank.bestPromoApy);
      return [
        standard,
        {
          bank,
          apyUsed: bank.bestPromoApy,
          apyLabel: `${formatComparePercent(bank.bestPromoApy)} APY promo (${bank.bestPromoTermMonths ?? "?"}-mo)`,
          earnings: promoEarnings,
          vsAws: awsCdYear - promoEarnings,
          multiplier: multiplierLabel(awsCdYear, promoEarnings),
          isPromo: true,
        },
      ];
    }
    return [standard];
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
      savingsTier,
      savingsApy: savingsTier.apy,
      savingsYearEarnings: awsSavingsYear,
      investmentTier,
      investmentYearSimple: awsInvestmentSimple,
      investmentYearCompound: awsInvestmentCompound,
      fdPromo: principal >= promo.minDeposit ? promo : null,
      fdPromoYearEarnings,
    },
    savings: savingsRows,
    cds: cdRows,
    investment: {
      awsAnnualCompound: awsInvestmentCompound,
      awsProgramTotal: (principal * investmentTier.totalRoiPercent) / 100,
      competitors: investmentCompetitors,
    },
    hero: {
      awsInvestmentYear: awsInvestmentCompound,
      chaseCdYear,
      multiplierVsChaseCd: multiplierLabel(awsInvestmentCompound, chaseCdYear),
      tierName: investmentTier.name,
      monthlyRate: investmentTier.monthlyRate,
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
