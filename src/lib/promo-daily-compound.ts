/**
 * July / $50k Wealth Accelerator — daily 0.5% compounding (AWS Finance sheet).
 * Admin sets start date; first profit credits the next calendar day.
 *
 * Settled days match the sheet (0.5%/day compound).
 * The current day accrues live by the minute so the UI ticks up continuously,
 * reaching the same end-of-day balance as a full daily credit.
 */

export const PROMO_DAILY_RATE_PERCENT = 0.5;
const MS_PER_DAY = 86_400_000;
const MINUTES_PER_DAY = 1_440;

export interface PromoDailyHistoryPoint {
  day: number;
  date: string; // ISO date (UTC day)
  startBalance: number;
  profit: number;
  endBalance: number;
  /** True when this bar is today's in-progress accrual */
  live?: boolean;
}

export interface PromoDailyCompoundResult {
  active: boolean;
  started: boolean;
  dailyRatePercent: number;
  principal: number;
  /** Live balance (settled days + today's minute accrual) */
  balance: number;
  /** Balance after last fully completed day (no intra-day accrual) */
  settledBalance: number;
  totalProfit: number;
  /** Profit credited so far today (live) */
  accruedToday: number;
  /** Full 0.5% profit targeted for the current day */
  dayTargetProfit: number;
  /** Approximate profit per minute for the current day */
  perMinuteProfit: number;
  /** Latest completed day's full profit (or today's target while live) */
  latestDayProfit: number;
  liveAccruing: boolean;
  dayNumber: number;
  totalProgramDays: number | null;
  startDate: string;
  firstProfitDate: string;
  endDate: string | null;
  nextCreditAt: string | null;
  endsAt: string | null;
  msUntilNextCredit: number | null;
  msUntilEnd: number | null;
  history: PromoDailyHistoryPoint[];
}

function utcDay(d: Date): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

function addUtcDays(d: Date, days: number): Date {
  const n = utcDay(d);
  n.setUTCDate(n.getUTCDate() + days);
  return n;
}

function isoDay(d: Date): string {
  return utcDay(d).toISOString();
}

function daysInclusive(from: Date, to: Date): number {
  const a = utcDay(from).getTime();
  const b = utcDay(to).getTime();
  if (b < a) return 0;
  return Math.floor((b - a) / MS_PER_DAY) + 1;
}

function money(n: number): number {
  return Math.round(n * 100) / 100;
}

export function isPromoDailyCompoundEligible(account: {
  investmentPlanId?: string | null;
  type?: string;
}) {
  return (
    account.investmentPlanId === "july-promo-fd" ||
    (account.type === "fixed_deposit" && account.investmentPlanId === "july-promo-fd")
  );
}

/**
 * Compound 0.5%/day from the day AFTER startDate through min(asOf, endDate).
 * Matches the attached AWS Finance compounding sheet ($50k example),
 * with live per-minute accrual on the current UTC day.
 */
export function computePromoDailyCompound(params: {
  principal: number;
  startDate: string | Date;
  endDate?: string | Date | null;
  active?: boolean;
  dailyRatePercent?: number;
  asOf?: Date;
}): PromoDailyCompoundResult {
  const dailyRate = params.dailyRatePercent ?? PROMO_DAILY_RATE_PERCENT;
  const asOf = params.asOf ?? new Date();
  const start = utcDay(new Date(params.startDate));
  const firstProfit = addUtcDays(start, 1);
  const end = params.endDate ? utcDay(new Date(params.endDate)) : null;
  const today = utcDay(asOf);
  const active = params.active !== false;
  const principal = Math.max(0, params.principal);
  const rate = dailyRate / 100;

  const nextCreditBase = today < firstProfit ? firstProfit : addUtcDays(today, 1);
  const nextCreditAt = end && nextCreditBase > end ? null : nextCreditBase;
  const endsAt = end;

  const empty = (started: boolean): PromoDailyCompoundResult => ({
    active,
    started,
    dailyRatePercent: dailyRate,
    principal,
    balance: money(principal),
    settledBalance: money(principal),
    totalProfit: 0,
    accruedToday: 0,
    dayTargetProfit: 0,
    perMinuteProfit: 0,
    latestDayProfit: 0,
    liveAccruing: false,
    dayNumber: 0,
    totalProgramDays: end ? daysInclusive(firstProfit, end) : null,
    startDate: isoDay(start),
    firstProfitDate: isoDay(firstProfit),
    endDate: end ? isoDay(end) : null,
    nextCreditAt: nextCreditAt ? isoDay(nextCreditAt) : null,
    endsAt: endsAt ? isoDay(endsAt) : null,
    msUntilNextCredit: nextCreditAt
      ? Math.max(0, nextCreditAt.getTime() - asOf.getTime())
      : null,
    msUntilEnd: endsAt
      ? Math.max(0, addUtcDays(endsAt, 1).getTime() - asOf.getTime())
      : null,
    history: [],
  });

  if (!active || principal <= 0) return empty(false);
  if (today < firstProfit) {
    // Countdown to first profit day — no accrual yet
    return empty(false);
  }

  const programEnded = Boolean(end && today > end);
  // Fully settled days: through yesterday, or through end if program finished
  const lastSettledDay = programEnded
    ? end!
    : addUtcDays(today, -1);

  let running = principal;
  const history: PromoDailyHistoryPoint[] = [];

  if (lastSettledDay >= firstProfit) {
    const settledCount = daysInclusive(firstProfit, lastSettledDay);
    for (let i = 0; i < settledCount; i++) {
      const dayDate = addUtcDays(firstProfit, i);
      const startBalance = running;
      const profit = money(startBalance * rate);
      running = money(startBalance + profit);
      history.push({
        day: i + 1,
        date: isoDay(dayDate),
        startBalance: money(startBalance),
        profit,
        endBalance: running,
      });
    }
  }

  const settledBalance = money(running);
  let balance = settledBalance;
  let accruedToday = 0;
  let dayTargetProfit = 0;
  let perMinuteProfit = 0;
  let liveAccruing = false;
  let latestDayProfit = history[history.length - 1]?.profit ?? 0;
  let dayNumber = history.length;

  // Live minute accrual on the current program day
  if (!programEnded && today >= firstProfit && (!end || today <= end)) {
    dayTargetProfit = money(settledBalance * rate);
    perMinuteProfit = dayTargetProfit / MINUTES_PER_DAY;
    const elapsedMs = Math.max(0, Math.min(MS_PER_DAY, asOf.getTime() - today.getTime()));
    const fraction = Math.min(1, elapsedMs / MS_PER_DAY);
    // Live accrual of today's 0.5% — same end-of-day total as the sheet
    accruedToday = money(dayTargetProfit * fraction);
    balance = money(settledBalance + accruedToday);
    liveAccruing = true;
    latestDayProfit = accruedToday;
    dayNumber = history.length + 1;

    history.push({
      day: dayNumber,
      date: isoDay(today),
      startBalance: settledBalance,
      profit: accruedToday,
      endBalance: balance,
      live: true,
    });
  }

  return {
    active,
    started: true,
    dailyRatePercent: dailyRate,
    principal: money(principal),
    balance,
    settledBalance,
    totalProfit: money(balance - principal),
    accruedToday,
    dayTargetProfit,
    perMinuteProfit,
    latestDayProfit,
    liveAccruing,
    dayNumber,
    totalProgramDays: end ? daysInclusive(firstProfit, end) : null,
    startDate: isoDay(start),
    firstProfitDate: isoDay(firstProfit),
    endDate: end ? isoDay(end) : null,
    nextCreditAt: nextCreditAt ? isoDay(nextCreditAt) : null,
    endsAt: endsAt ? isoDay(endsAt) : null,
    msUntilNextCredit: nextCreditAt
      ? Math.max(0, nextCreditAt.getTime() - asOf.getTime())
      : null,
    msUntilEnd: endsAt
      ? Math.max(0, addUtcDays(endsAt, 1).getTime() - asOf.getTime())
      : null,
    history,
  };
}
