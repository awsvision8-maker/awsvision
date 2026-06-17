import { INVESTMENT_PLANS, formatUsd } from "@/lib/investment-plans";
import { type ActiveFdPromo, formatPromoUsd, getActiveFdPromo } from "@/lib/promotions";

export interface FdRateRow {
  product: string;
  min: string;
  term: string;
  /** Monthly gratuity / profit rate */
  monthlyRate: string;
  /** Total return over the full term */
  totalReturn: string;
  featured?: boolean;
}

/** FD tiers aligned with AWS Vision investment plan percentages */
export function buildFdRates(referenceDate: Date = new Date()): FdRateRow[] {
  const promo = getActiveFdPromo(referenceDate);

  const monthlyPromo: FdRateRow = {
    product: `${promo.monthLong} Promo FD — ${promo.termMonths} Month (Featured)`,
    min: `${formatPromoUsd(promo.minDeposit)}+`,
    term: `${promo.termMonths} months`,
    monthlyRate: `${(promo.returnPercent / promo.termMonths).toFixed(2)}%/mo`,
    totalReturn: `${promo.returnPercent}% total`,
    featured: true,
  };

  const planRows: FdRateRow[] = INVESTMENT_PLANS.map((plan) => ({
    product: `${plan.name} FD — ${plan.termMonths} Month`,
    min: formatUsd(plan.minInvestment),
    term: `${plan.termMonths} months`,
    monthlyRate: `${plan.monthlyRate.toFixed(2)}%/mo`,
    totalReturn: `${plan.totalRoiPercent}% total`,
  }));

  return [monthlyPromo, ...planRows];
}

export function getFdRates(referenceDate: Date = new Date()) {
  return buildFdRates(referenceDate);
}

/** @deprecated Use getFdRates() at render time for current month labels */
export const FD_RATES = getFdRates();

/** Product cards for /personal/cds — same tiers as investment plans */
export function buildFdProducts(promo: ActiveFdPromo = getActiveFdPromo()) {
  const featured = {
    name: `${promo.monthLong} Promo FD — ${promo.termMonths} Months`,
    rate: `${promo.returnPercent}% total return`,
    desc: `Minimum ${formatPromoUsd(promo.minDeposit)}. Open in ${promo.monthLabel} only.`,
    features: [
      `${promo.returnPercent}% return after ${promo.termMonths} months`,
      "Monthly and yearly gratuity eligible",
      promo.enrollmentLabel,
      "Relationship manager support",
    ],
    featured: true,
  };

  const tiers = INVESTMENT_PLANS.map((plan) => ({
    name: `${plan.name} FD — ${plan.termMonths} Months`,
    rate: `${plan.monthlyRate.toFixed(2)}%/mo · ${plan.totalRoiPercent}% total`,
    desc: `Minimum ${formatUsd(plan.minInvestment)}. ${plan.totalReturnLabel} over ${plan.termMonths} months.`,
    features: [
      `${plan.monthlyRate.toFixed(2)}% monthly gratuity`,
      `${plan.totalRoiPercent}% total program return`,
      plan.compoundInterest ? "Compound interest available" : "",
      "Yearly gratuity bonus on qualifying balances",
    ].filter(Boolean),
  }));

  return [featured, ...tiers];
}
