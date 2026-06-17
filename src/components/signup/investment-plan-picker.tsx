"use client";

import { cn } from "@/lib/utils";
import { INVESTMENT_PLANS, formatUsd, type InvestmentPlan } from "@/lib/investment-plans";
import { MobileDataCard } from "@/components/ui/mobile-data-card";

interface InvestmentPlanPickerProps {
  selectedPlanId?: string;
  onSelect: (plan: InvestmentPlan) => void;
}

export function InvestmentPlanPicker({ selectedPlanId, onSelect }: InvestmentPlanPickerProps) {
  return (
    <>
      {/* Mobile / tablet: card picker */}
      <div className="space-y-3 md:hidden">
        {INVESTMENT_PLANS.map((plan) => {
          const selected = selectedPlanId === plan.id;
          return (
            <MobileDataCard
              key={plan.id}
              title={plan.name}
              selected={selected}
              onClick={() => onSelect(plan)}
              badge={
                <span
                  className={cn(
                    "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                    selected ? "border-teal-600 bg-teal-600" : "border-slate-300"
                  )}
                >
                  {selected && <span className="h-2 w-2 rounded-full bg-white" />}
                </span>
              }
              fields={[
                { label: "Monthly", value: `${plan.monthlyRate.toFixed(2)}%`, highlight: true },
                { label: "Term", value: `${plan.termMonths} months` },
                { label: "Min. invest", value: formatUsd(plan.minInvestment) },
                { label: "Total ROI", value: `${plan.totalRoiPercent}%`, highlight: true },
              ]}
            />
          );
        })}
      </div>

      {/* Desktop: comparison table */}
      <div className="hidden overflow-hidden rounded-lg border border-slate-200 bg-white md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3 font-semibold">Plan</th>
                <th className="px-3 py-3 font-semibold text-right">Monthly</th>
                <th className="px-3 py-3 font-semibold text-right">Term</th>
                <th className="px-3 py-3 font-semibold text-right">Min. invest</th>
                <th className="px-3 py-3 font-semibold text-right">Total ROI</th>
                <th className="px-4 py-3 font-semibold text-center">Select</th>
              </tr>
            </thead>
            <tbody>
              {INVESTMENT_PLANS.map((plan) => {
                const selected = selectedPlanId === plan.id;
                return (
                  <tr
                    key={plan.id}
                    className={cn(
                      "border-b border-slate-100 cursor-pointer transition-colors",
                      selected ? "bg-teal-50" : "hover:bg-slate-50"
                    )}
                    onClick={() => onSelect(plan)}
                  >
                    <td className="px-4 py-3 font-semibold text-slate-900">{plan.name}</td>
                    <td className="px-3 py-3 text-right font-bold text-teal-700 tabular-nums">
                      {plan.monthlyRate.toFixed(2)}%
                    </td>
                    <td className="px-3 py-3 text-right text-slate-600 tabular-nums">
                      {plan.termMonths} mo
                    </td>
                    <td className="px-3 py-3 text-right text-slate-900 tabular-nums">
                      {formatUsd(plan.minInvestment)}
                    </td>
                    <td className="px-3 py-3 text-right font-medium text-slate-900">
                      {plan.totalRoiPercent}%
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={cn(
                          "inline-flex h-5 w-5 items-center justify-center rounded-full border-2",
                          selected ? "border-teal-600 bg-teal-600" : "border-slate-300"
                        )}
                      >
                        {selected && <span className="h-2 w-2 rounded-full bg-white" />}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
