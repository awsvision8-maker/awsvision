import Link from "next/link";
import { CheckCircle2, ArrowRight, Shield, RefreshCw, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  INVESTMENT_PLANS,
  INVESTMENT_HOW_IT_WORKS,
  formatUsd,
  type InvestmentPlan,
} from "@/lib/investment-plans";
import { cn } from "@/lib/utils";

interface InvestmentPlansSectionProps {
  showComparisonTable?: boolean;
  showHowItWorks?: boolean;
  selectedPlanId?: string;
  onSelectPlan?: (plan: InvestmentPlan) => void;
  compact?: boolean;
}

function PlanCard({
  plan,
  selected,
  onSelect,
}: {
  plan: InvestmentPlan;
  selected?: boolean;
  onSelect?: (plan: InvestmentPlan) => void;
}) {
  const content = (
    <article
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition-shadow",
        plan.borderClass,
        selected && "ring-2 ring-teal-600 ring-offset-2",
        onSelect && "cursor-pointer hover:shadow-md"
      )}
    >
      <div className={cn("h-1.5 w-full", plan.accentClass)} />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Investment Plan
            </p>
            <h3 className="mt-1 text-xl font-bold text-slate-900">{plan.name}</h3>
          </div>
          <span className="shrink-0 rounded border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
            {plan.totalRoiPercent}% total ROI
          </span>
        </div>

        <div className="mt-6 rounded-lg border border-slate-100 bg-slate-50 p-4">
          <p className="text-3xl font-bold text-teal-700 tabular-nums">
            {plan.monthlyRate.toFixed(2)}%
          </p>
          <p className="mt-1 text-sm font-medium text-slate-600">
            Every month · {plan.termMonths} months
          </p>
        </div>

        <dl className="mt-5 space-y-2.5 border-t border-slate-100 pt-5 text-sm">
          <div className="flex justify-between gap-2">
            <dt className="text-slate-500">Minimum investment</dt>
            <dd className="font-semibold text-slate-900 tabular-nums">{formatUsd(plan.minInvestment)}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-slate-500">Maximum earnings</dt>
            <dd className="font-semibold text-slate-900 tabular-nums">{formatUsd(plan.maxEarnings)}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-slate-500">Total return</dt>
            <dd className="font-semibold text-teal-700">{plan.totalReturnLabel}</dd>
          </div>
        </dl>

        <ul className="mt-4 flex-1 space-y-2 text-xs text-slate-600">
          {plan.compoundInterest && (
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 shrink-0" />
              Compound interest available
            </li>
          )}
          {plan.holdCapitalReinvest && (
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 shrink-0" />
              Hold capital &amp; reinvest
            </li>
          )}
        </ul>

        {!onSelect && (
          <Link href={`/signup?account=investment&plan=${plan.id}`} className="mt-6 block">
            <Button className="w-full" variant={plan.id === "diamond" ? "primary" : "outline"}>
              Invest Now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
    </article>
  );

  if (onSelect) {
    return (
      <button type="button" className="text-left w-full" onClick={() => onSelect(plan)}>
        {content}
      </button>
    );
  }
  return content;
}

export function InvestmentPlansSection({
  showComparisonTable = true,
  showHowItWorks = true,
  selectedPlanId,
  onSelectPlan,
  compact = false,
}: InvestmentPlansSectionProps) {
  return (
    <div className="space-y-16">
      <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
              Structured Investment Products
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              Investment Plans &amp; Returns
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 leading-relaxed">
              Tiered capital plans with fixed monthly profit rates and defined terms — presented in
              accordance with microfinance and institutional disclosure standards. Rates mirror our
              live program at{" "}
              <a
                href="https://awsvision.com/portal/"
                className="text-teal-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                awsvision.com/portal
              </a>
              .
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600">
            <Shield className="h-4 w-4 text-teal-600 shrink-0" />
            Licensed U.S. &amp; UAE · Monthly profit distribution
          </div>
        </div>

        <div
          className={cn(
            "mt-10 grid gap-6",
            compact ? "sm:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2 xl:grid-cols-3"
          )}
        >
          {INVESTMENT_PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              selected={selectedPlanId === plan.id}
              onSelect={onSelectPlan}
            />
          ))}
        </div>

        <p className="mt-8 text-xs text-slate-500 leading-relaxed max-w-4xl border-l-2 border-slate-200 pl-4">
          <strong className="font-semibold text-slate-700">Important disclosure:</strong> Investment
          products are not bank deposits and are not FDIC insured. Returns are based on program
          terms at enrollment. Past performance does not guarantee future results. Capital is
          allocated across diversified global sectors under AWS Vision asset management. Review all
          terms before investing.
        </p>
      </div>

      {showComparisonTable && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
            <h3 className="font-bold text-slate-900">Plan Comparison Schedule</h3>
            <p className="text-sm text-slate-500 mt-0.5">All figures in USD · Monthly profit rates</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-white text-left">
                  <th className="px-6 py-3 font-semibold text-slate-700">Plan</th>
                  <th className="px-4 py-3 font-semibold text-slate-700 text-right">Monthly rate</th>
                  <th className="px-4 py-3 font-semibold text-slate-700 text-right">Term</th>
                  <th className="px-4 py-3 font-semibold text-slate-700 text-right">Min. investment</th>
                  <th className="px-4 py-3 font-semibold text-slate-700 text-right">Max. earnings</th>
                  <th className="px-4 py-3 font-semibold text-slate-700 text-right">Total ROI</th>
                  <th className="px-6 py-3 font-semibold text-slate-700 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {INVESTMENT_PLANS.map((plan, i) => (
                  <tr
                    key={plan.id}
                    className={cn(
                      "border-b border-slate-100",
                      i % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                    )}
                  >
                    <td className="px-6 py-4 font-semibold text-slate-900">{plan.name}</td>
                    <td className="px-4 py-4 text-right font-bold text-teal-700 tabular-nums">
                      {plan.monthlyRate.toFixed(2)}%
                    </td>
                    <td className="px-4 py-4 text-right text-slate-600 tabular-nums">
                      {plan.termMonths} mo
                    </td>
                    <td className="px-4 py-4 text-right text-slate-900 tabular-nums">
                      {formatUsd(plan.minInvestment)}
                    </td>
                    <td className="px-4 py-4 text-right text-slate-900 tabular-nums">
                      {formatUsd(plan.maxEarnings)}
                    </td>
                    <td className="px-4 py-4 text-right font-medium text-slate-900">
                      {plan.totalRoiPercent}%
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        href={`/signup?account=investment&plan=${plan.id}`}
                        className="text-teal-700 font-semibold hover:underline text-xs"
                      >
                        Apply
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showHowItWorks && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 lg:p-10">
          <h3 className="text-xl font-bold text-slate-900">How AWS Vision Investment Works</h3>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl">
            A transparent four-step process — from account opening to monthly profit withdrawal.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {INVESTMENT_HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="rounded-lg border border-slate-200 bg-white p-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">
                  {item.step}
                </span>
                <h4 className="mt-4 font-semibold text-slate-900">{item.title}</h4>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" /> Compound interest on all plans
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" /> Hold capital option available
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
