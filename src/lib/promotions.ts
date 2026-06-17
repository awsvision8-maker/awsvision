/** Active site-wide FD wealth promo — figures are fixed; month labels roll forward automatically */

export const FD_PROMO_TERMS = {
  minDeposit: 50_000,
  returnPercent: 90,
  termMonths: 6,
  signupHref: "/signup?account=fixed_deposit",
  cdsHref: "/personal/cds",
  ratesHref: "/rates#fd-rates",
} as const;

export interface PromoMonthContext {
  monthLong: string;
  monthShort: string;
  year: number;
  monthLabel: string;
  endsLabel: string;
  badge: string;
  enrollmentLabel: string;
}

/** Month name, end date, and badge text for the current (or reference) calendar month */
export function getPromoMonthContext(referenceDate: Date = new Date()): PromoMonthContext {
  const monthLong = referenceDate.toLocaleString("en-US", { month: "long" });
  const monthShort = referenceDate.toLocaleString("en-US", { month: "short" });
  const year = referenceDate.getFullYear();
  const lastDay = new Date(year, referenceDate.getMonth() + 1, 0).getDate();

  return {
    monthLong,
    monthShort,
    year,
    monthLabel: `${monthLong} ${year}`,
    endsLabel: `Offer ends ${monthLong} ${lastDay}, ${year}`,
    badge: `${monthLong} Wealth Accelerator`,
    enrollmentLabel: `Limited-time ${monthLong} enrollment`,
  };
}

export interface ActiveFdPromo extends PromoMonthContext {
  id: string;
  headline: string;
  subheadline: string;
  wealthHook: string;
  minDeposit: number;
  returnPercent: number;
  termMonths: number;
  signupHref: string;
  cdsHref: string;
  ratesHref: string;
}

/** Full promo payload — call at render time so the month updates automatically */
export function getActiveFdPromo(referenceDate: Date = new Date()): ActiveFdPromo {
  const month = getPromoMonthContext(referenceDate);
  const { minDeposit, returnPercent, termMonths } = FD_PROMO_TERMS;

  return {
    ...FD_PROMO_TERMS,
    ...month,
    id: `fd-${month.monthLong.toLowerCase()}-${month.year}`,
    headline: `Grow Your Wealth ${returnPercent}% in ${termMonths} Months`,
    subheadline: `Lock in AWS Vision's exclusive ${month.monthLong} Fixed Deposit program. Deposit $50,000 or more and watch your capital multiply — structured returns designed for serious wealth builders.`,
    wealthHook: "Accelerate your financial future with institutional-grade returns.",
  };
}

/** @deprecated Use getActiveFdPromo() — kept for any stale imports */
export const FD_JUNE_PROMO = getActiveFdPromo();

export function formatPromoUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Illustrative maturity value at promo rate (capital + return) */
export function promoMaturityValue(
  capital: number = FD_PROMO_TERMS.minDeposit,
  promo: ActiveFdPromo = getActiveFdPromo()
) {
  return capital + (capital * promo.returnPercent) / 100;
}

export function promoProfitAmount(
  capital: number = FD_PROMO_TERMS.minDeposit,
  promo: ActiveFdPromo = getActiveFdPromo()
) {
  return (capital * promo.returnPercent) / 100;
}

/** One-line promo summary for cards and footers */
export function getFdPromoSummary(referenceDate: Date = new Date()) {
  const promo = getActiveFdPromo(referenceDate);
  return `${promo.monthLong} promo: ${promo.returnPercent}% on ${formatPromoUsd(promo.minDeposit)}+ over ${promo.termMonths} months`;
}

/** CDS / FD page hero with current month */
export function getCdsPromoHero(referenceDate: Date = new Date()) {
  const promo = getActiveFdPromo(referenceDate);
  return `Lock your capital in a Fixed Deposit for a chosen term. FD tiers follow the same monthly gratuity and total return schedule as our Silver through Executive investment plans — plus a limited ${promo.monthLong} promo at ${promo.returnPercent}% total return over ${promo.termMonths} months on ${formatPromoUsd(promo.minDeposit)}+.`;
}
