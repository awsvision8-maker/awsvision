/** Wealth Accelerator FD promo — defaults + builders (admin config overlays via server) */

export const FD_PROMO_DEFAULTS = {
  minDeposit: 50_000,
  returnPercent: 90,
  termMonths: 6,
  /** Stable plan id for signup + portfolio (do not rename for live accounts) */
  planId: "july-promo-fd",
  signupHref: "/signup?account=fixed_deposit&promo=july-promo-fd",
  cdsHref: "/personal/cds",
  ratesHref: "/rates#fd-rates",
} as const;

/** @deprecated Prefer FD_PROMO_DEFAULTS — kept for existing imports */
export const FD_PROMO_TERMS = FD_PROMO_DEFAULTS;

export const FD_PROMO_PLAN_ID = FD_PROMO_DEFAULTS.planId;

export function isFdPromoPlanId(planId: string | undefined | null): boolean {
  return planId === FD_PROMO_PLAN_ID || planId === "july-promo-fd";
}

export interface FdPromoRuntimeConfig {
  isActive: boolean;
  displayMonth: number; // 1–12
  displayYear: number;
  endsAt: string; // ISO
  minDeposit: number;
  returnPercent: number;
  termMonths: number;
  planId: string;
  packageName?: string | null;
  headline?: string | null;
  subheadline?: string | null;
}

export interface PromoMonthContext {
  monthLong: string;
  monthShort: string;
  year: number;
  monthLabel: string;
  endsLabel: string;
  badge: string;
  enrollmentLabel: string;
}

export interface ActiveFdPromo extends PromoMonthContext {
  id: string;
  headline: string;
  subheadline: string;
  wealthHook: string;
  minDeposit: number;
  returnPercent: number;
  termMonths: number;
  planId: string;
  signupHref: string;
  cdsHref: string;
  ratesHref: string;
  packageName: string;
  packageLabel: string;
  isActive: boolean;
  endsAt: string;
}

const MONTH_NAMES_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const MONTH_NAMES_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export function defaultFdPromoRuntimeConfig(referenceDate: Date = new Date()): FdPromoRuntimeConfig {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth() + 1;
  const endsAt = new Date(year, month, 0, 23, 59, 59, 999);
  return {
    isActive: true,
    displayMonth: month,
    displayYear: year,
    endsAt: endsAt.toISOString(),
    minDeposit: FD_PROMO_DEFAULTS.minDeposit,
    returnPercent: FD_PROMO_DEFAULTS.returnPercent,
    termMonths: FD_PROMO_DEFAULTS.termMonths,
    planId: FD_PROMO_DEFAULTS.planId,
    packageName: null,
    headline: null,
    subheadline: null,
  };
}

export function isFdPromoOfferingOpen(
  config: Pick<FdPromoRuntimeConfig, "isActive" | "endsAt">,
  now: Date = new Date()
): boolean {
  if (!config.isActive) return false;
  const ends = new Date(config.endsAt);
  if (Number.isNaN(ends.getTime())) return false;
  return now.getTime() <= ends.getTime();
}

export function getPromoMonthContextFromParts(
  displayMonth: number,
  displayYear: number,
  endsAtIso: string
): PromoMonthContext {
  const monthIndex = Math.min(11, Math.max(0, displayMonth - 1));
  const monthLong = MONTH_NAMES_LONG[monthIndex];
  const monthShort = MONTH_NAMES_SHORT[monthIndex];
  const ends = new Date(endsAtIso);
  const endsLabel = Number.isNaN(ends.getTime())
    ? `Offer ends ${monthLong} ${displayYear}`
    : `Offer ends ${ends.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })}`;

  return {
    monthLong,
    monthShort,
    year: displayYear,
    monthLabel: `${monthLong} ${displayYear}`,
    endsLabel,
    badge: `${monthLong} Wealth Accelerator`,
    enrollmentLabel: `Limited-time ${monthLong} enrollment`,
  };
}

/** Month name, end date, and badge text for the current (or reference) calendar month */
export function getPromoMonthContext(referenceDate: Date = new Date()): PromoMonthContext {
  const cfg = defaultFdPromoRuntimeConfig(referenceDate);
  return getPromoMonthContextFromParts(cfg.displayMonth, cfg.displayYear, cfg.endsAt);
}

export function buildActiveFdPromo(config: FdPromoRuntimeConfig): ActiveFdPromo {
  const month = getPromoMonthContextFromParts(
    config.displayMonth,
    config.displayYear,
    config.endsAt
  );
  const { minDeposit, returnPercent, termMonths, planId } = config;
  const packageName =
    config.packageName?.trim() || `${month.monthLong} Wealth Accelerator FD`;
  const headline =
    config.headline?.trim() ||
    `Grow Your Wealth ${returnPercent}% in ${termMonths} Months`;
  const subheadline =
    config.subheadline?.trim() ||
    `Lock in AWS Vision's exclusive ${month.monthLong} Wealth Accelerator Fixed Deposit. Deposit $${minDeposit.toLocaleString("en-US")}+ and earn ${returnPercent}% return after ${termMonths} months — a separate limited package with relationship manager support.`;

  return {
    ...FD_PROMO_DEFAULTS,
    minDeposit,
    returnPercent,
    termMonths,
    planId: planId || FD_PROMO_PLAN_ID,
    signupHref: `/signup?account=fixed_deposit&promo=${planId || FD_PROMO_PLAN_ID}`,
    ...month,
    id: `fd-${month.monthLong.toLowerCase()}-${month.year}`,
    headline,
    subheadline,
    wealthHook: "Accelerate your financial future with institutional-grade returns.",
    packageName,
    packageLabel: `${month.monthLong} Promo FD — ${termMonths} Months`,
    isActive: isFdPromoOfferingOpen(config),
    endsAt: config.endsAt,
  };
}

/** Sync fallback from calendar defaults — prefer resolveActiveFdPromo() / useActiveFdPromo() */
export function getActiveFdPromo(referenceDate: Date = new Date()): ActiveFdPromo {
  return buildActiveFdPromo(defaultFdPromoRuntimeConfig(referenceDate));
}

/** Plan-shaped object for agreements / portal */
export function getFdPromoPlan(config?: Pick<FdPromoRuntimeConfig, "returnPercent" | "termMonths" | "minDeposit" | "planId" | "packageName" | "displayMonth" | "displayYear" | "endsAt">) {
  const runtime = config
    ? {
        ...defaultFdPromoRuntimeConfig(),
        ...config,
        isActive: true,
      }
    : defaultFdPromoRuntimeConfig();
  const promo = buildActiveFdPromo(runtime);
  const monthlyRate =
    Math.round((promo.returnPercent / promo.termMonths) * 100) / 100;
  return {
    id: promo.planId,
    name: promo.packageName,
    monthlyRate,
    termMonths: promo.termMonths,
    totalRoiPercent: promo.returnPercent,
    minInvestment: promo.minDeposit,
    maxEarnings: 0,
    totalReturnLabel: `Capital + ${promo.returnPercent}%`,
    compoundInterest: false,
    holdCapitalReinvest: false,
    accentClass: "bg-amber-600",
    borderClass: "border-amber-300",
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

export function promoMaturityValue(
  capital: number = FD_PROMO_DEFAULTS.minDeposit,
  promo: ActiveFdPromo = getActiveFdPromo()
) {
  return capital + (capital * promo.returnPercent) / 100;
}

export function promoProfitAmount(
  capital: number = FD_PROMO_DEFAULTS.minDeposit,
  promo: ActiveFdPromo = getActiveFdPromo()
) {
  return (capital * promo.returnPercent) / 100;
}

export function getFdPromoSummary(promo: ActiveFdPromo = getActiveFdPromo()) {
  return `${promo.monthLong} promo: ${promo.returnPercent}% on ${formatPromoUsd(promo.minDeposit)}+ over ${promo.termMonths} months`;
}

export function getCdsPromoHero(promo: ActiveFdPromo = getActiveFdPromo()) {
  return `Lock your capital in our limited ${promo.monthLong} Promo Fixed Deposit. Deposit ${formatPromoUsd(promo.minDeposit)} or more and earn ${promo.returnPercent}% total return after ${promo.termMonths} months — open in ${promo.monthLabel} only, with monthly and yearly gratuity and relationship manager support.`;
}
