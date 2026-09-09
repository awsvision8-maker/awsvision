import Link from "next/link";
import { CheckCircle2, ArrowRight, Shield, RefreshCw, Lock, Phone } from "lucide-react";
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
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Investment Plan
          </p>
          <h3 className="mt-1 text-xl font-bold text-slate-900">{plan.name}</h3>
        </div>

        <div className="mt-6 rounded-lg border border-slate-100 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Minimum investment
          </p>
          <p className="mt-1 text-3xl font-bold text-teal-700 tabular-nums">
            {formatUsd(plan.minInvestment)}
          </p>
          <p className="mt-1 text-sm font-medium text-slate-600">
            Returns customized with your representative
          </p>
        </div>

        <dl className="mt-5 space-y-2.5 border-t border-slate-100 pt-5 text-sm">
          <div className="flex justify-between gap-2">
            <dt className="text-slate-500">Starting capital</dt>
            <dd className="font-semibold text-slate-900 tabular-nums">
              {formatUsd(plan.minInvestment)}+
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-slate-500">Program terms</dt>
            <dd className="font-semibold text-slate-900">Discuss on call</dd>
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
          <li className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 text-teal-600 shrink-0" />
            Personalized figures with support
          </li>
        </ul>

        {!onSelect && (
          <Link href="/contact" className="mt-6 block">
            <Button className="w-full" variant={plan.id === "diamond" ? "primary" : "outline"}>
              Talk to Support
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
              Investment Plans
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 leading-relaxed">
              Choose a capital tier based on how much you can invest. Profit rates and program terms
              are customized on a call with our support team or representative — figures are not
              listed publicly.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600">
            <Shield className="h-4 w-4 text-teal-600 shrink-0" />
            Licensed U.S. &amp; UAE · Talk to a representative
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
          products are not bank deposits and are not FDIC insured. Program terms and returns are
          confirmed with your representative before enrollment. Capital is allocated across
          diversified global sectors under AWS Vision asset management. Review all terms before
          investing.
        </p>
      </div>

      {showComparisonTable && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
            <h3 className="font-bold text-slate-900">Plan Comparison Schedule</h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Minimum investment by tier · Returns discussed with support
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-white text-left">
                  <th className="px-6 py-3 font-semibold text-slate-700">Plan</th>
                  <th className="px-4 py-3 font-semibold text-slate-700 text-right">
                    Min. investment
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-700 text-right">
                    Program terms
                  </th>
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
                      {formatUsd(plan.minInvestment)}
                    </td>
                    <td className="px-4 py-4 text-right text-slate-600">Discuss on call</td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        href="/contact"
                        className="text-teal-700 font-semibold hover:underline text-xs"
                      >
                        Talk to Support
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
            A transparent process — from speaking with support to funding your account.
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
              <RefreshCw className="h-3.5 w-3.5" /> Personalized program terms
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5" /> Hold capital option available
            </span>
            <Link
              href="/contact"
              className="flex items-center gap-1.5 font-semibold text-teal-700 hover:underline"
            >
              <Phone className="h-3.5 w-3.5" /> Talk to a representative
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
