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

/** Public FD offering — Wealth Accelerator promo package (rates discussed on call) */
export function buildFdRates(promo: ActiveFdPromo = getActiveFdPromo()): FdRateRow[] {
  return [
    {
      product: `${promo.monthLong} Promo FD — ${promo.termMonths} Months`,
      min: `${formatPromoUsd(promo.minDeposit)}+`,
      term: `${promo.termMonths} months`,
      monthlyRate: "Up to program rate · Discuss on call",
      totalReturn: "Up to promotional package · Discuss on call",
      featured: true,
    },
  ];
}

export function getFdRates(promo?: ActiveFdPromo) {
  return buildFdRates(promo ?? getActiveFdPromo());
}

/** @deprecated Use getFdRates() at render time for current month labels */
export const FD_RATES = getFdRates();

/** Product cards for /personal/cds — promo FD */
export function buildFdProducts(promo: ActiveFdPromo = getActiveFdPromo()) {
  return [
    {
      name: `${promo.monthLong} Promo FD — ${promo.termMonths} Months`,
      rate: "Up to promotional return · Discuss on call",
      desc: `Minimum ${formatPromoUsd(promo.minDeposit)}. Open in ${promo.monthLabel} only.`,
      features: [
        "Up to promotional package return — confirm on call",
        "Monthly and yearly gratuity eligible",
        promo.enrollmentLabel,
        "Relationship manager support",
      ],
      featured: true,
    },
  ];
}
