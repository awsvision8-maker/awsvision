import { isFdPromoPlanId } from "@/lib/promotions";

function monthsElapsed(from: Date, to: Date) {
  return (
    (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth())
  );
}

/**
 * Non-promo profit from investment agreement issued date (monthly rate).
 * Promo / daily-compound accounts should use the portfolio engine instead.
 */
export function computeProfitFromAgreementDate(params: {
  principal: number;
  monthlyRatePercent: number;
  agreementIssuedAt: string | Date;
  accountType?: string;
  asOf?: Date;
}): number {
  const principal = Math.max(0, params.principal);
  const rate = params.monthlyRatePercent;
  if (principal <= 0 || rate <= 0) return 0;

  const start = new Date(params.agreementIssuedAt);
  const asOf = params.asOf ?? new Date();
  if (Number.isNaN(start.getTime()) || asOf < start) return 0;

  const months = Math.max(0, monthsElapsed(start, asOf));
  if (months <= 0) return 0;

  const compound = params.accountType !== "savings";
  if (compound) {
    let running = principal;
    for (let i = 0; i < months; i++) {
      running += (running * rate) / 100;
    }
    return Math.round((running - principal) * 100) / 100;
  }

  return Math.round(((principal * rate) / 100) * months * 100) / 100;
}

export function pickEarliestAgreementForAccount(
  agreements: { accountId: string; issuedAt: string | Date; monthlyRatePercent?: number }[],
  accountId: string
) {
  const rows = agreements
    .filter((a) => a.accountId === accountId)
    .sort(
      (a, b) => new Date(a.issuedAt).getTime() - new Date(b.issuedAt).getTime()
    );
  return rows[0] ?? null;
}

export function isPromoDailyStyleAccount(account: {
  investmentPlanId?: string | null;
  dailyCompoundActive?: boolean;
}) {
  return (
    Boolean(account.dailyCompoundActive) || isFdPromoPlanId(account.investmentPlanId)
  );
}
