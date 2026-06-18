import { cn } from "@/lib/utils";
import { getInvestmentPlan, formatUsd, type InvestmentPlan } from "@/lib/investment-plans";

interface InvestmentPlanSummaryProps {
  plan: InvestmentPlan;
  capitalBalance?: number;
  monthlyProfitEstimate?: number;
  profitDeliveryMonth?: string;
  className?: string;
}

/** Banking-style enrollment summary for client portal */
export function InvestmentPlanSummary({
  plan,
  capitalBalance,
  monthlyProfitEstimate,
  profitDeliveryMonth,
  className,
}: InvestmentPlanSummaryProps) {
  const monthlyProfit =
    monthlyProfitEstimate ??
    (capitalBalance != null ? (capitalBalance * plan.monthlyRate) / 100 : null);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-white shadow-sm",
        plan.borderClass,
        className
      )}
    >
      <div className={cn("h-1 w-full", plan.accentClass)} />
      <div className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Investment Plan
            </p>
            <h3 className="mt-1 text-2xl font-bold text-slate-900">{plan.name}</h3>
            <p className="mt-1 text-sm text-slate-600">
              Account schedule · {plan.termMonths}-month term
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-right">
            <p className="text-2xl font-bold text-teal-700 tabular-nums">
              {plan.monthlyRate.toFixed(2)}%
            </p>
            <p className="text-xs font-medium text-slate-500">Monthly profit rate</p>
          </div>
        </div>

        <dl className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs text-slate-500">Minimum at enrollment</dt>
            <dd className="mt-1 font-semibold text-slate-900 tabular-nums">
              {formatUsd(plan.minInvestment)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Total program ROI</dt>
            <dd className="mt-1 font-semibold text-teal-700">{plan.totalRoiPercent}%</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Maximum earnings</dt>
            <dd className="mt-1 font-semibold text-slate-900 tabular-nums">
              {formatUsd(plan.maxEarnings)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Total return</dt>
            <dd className="mt-1 font-semibold text-slate-900">{plan.totalReturnLabel}</dd>
          </div>
        </dl>

        {capitalBalance != null && monthlyProfit != null && (
          <div className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-sm">
            <span className="text-slate-600">Estimated monthly profit on current capital </span>
            <span className="font-bold text-emerald-700 tabular-nums">
              {formatUsd(monthlyProfit)}
            </span>
            {profitDeliveryMonth && (
              <span className="text-slate-600">
                {" "}
                · delivered in <strong className="text-slate-800">{profitDeliveryMonth}</strong>
              </span>
            )}
            <span className="text-slate-500"> · based on {formatUsd(capitalBalance)} deployed</span>
          </div>
        )}

        <p className="mt-4 text-xs text-slate-500">
          Compound interest and capital reinvestment available per program terms.
        </p>
      </div>
    </div>
  );
}

export function getAccountInvestmentPlan(account: { investmentPlanId?: string }) {
  return account.investmentPlanId ? getInvestmentPlan(account.investmentPlanId) : undefined;
}
