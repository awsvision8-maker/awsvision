"use client";

import { PortalHeader } from "@/components/portal/sidebar";
import {
  InvestmentPlanSummary,
  getAccountInvestmentPlan,
} from "@/components/portal/investment-plan-summary";
import { PromoDailyCompoundPanel } from "@/components/portal/promo-daily-compound-panel";
import { LiveUsHoldingsPanel } from "@/components/portal/live-us-holdings-panel";
import {
  BalanceTrendChart,
  MonthlyProfitChart,
  PortfolioGrowthChart,
  RegionAllocationChart,
} from "@/components/charts/investment-charts";
import { getInvestmentPlan } from "@/lib/investment-plans";
import { getAccountLabel } from "@/lib/portfolio-engine";
import { resolveHoldingsAllocationStyle } from "@/lib/us-growth-holdings";
import { usePortfolio } from "@/lib/use-portfolio";
import { formatCurrency, formatPercent, formatMonthYear } from "@/lib/utils";

export default function PortfolioPage() {
  const portfolio = usePortfolio();
  const investmentAccount = portfolio.accounts.find(
    (a) => a.type === "investment" || a.type === "fixed_deposit" || a.type === "nonprofit_fund"
  );
  const enrolledPlan = portfolio.nextMonthPlanId
    ? getInvestmentPlan(portfolio.nextMonthPlanId)
    : investmentAccount
      ? getAccountInvestmentPlan(investmentAccount)
      : undefined;
  const totalValue =
    portfolio.approvedDepositTotal > 0
      ? portfolio.holdings.reduce((s, h) => s + h.value, 0)
      : 0;
  const profitEstimate = portfolio.profitAccrualActive
    ? portfolio.monthlyProfit
    : portfolio.approvedDepositTotal > 0
      ? portfolio.nextMonthMonthlyProfit
      : 0;
  const profitDeliveryLabel = portfolio.profitDeliveryMonth
    ? formatMonthYear(portfolio.profitDeliveryMonth)
    : null;

  const dailyCompoundAccounts = portfolio.accounts.filter((a) => a.dailyCompound?.active);

  const liveAccounts = portfolio.accounts.map((a) => {
    const ledger = portfolio.portfolioAccounts.find((p) => p.id === a.id);
    return {
      id: a.id,
      label: getAccountLabel(a),
      balance: Math.max(a.balance, ledger?.principal ?? 0),
      annualReturnPercent: a.interestRate || portfolio.annualReturn || 12,
      style: resolveHoldingsAllocationStyle({
        investmentPlanId: a.investmentPlanId,
        dailyCompoundActive: Boolean(a.dailyCompound?.active),
      }),
    };
  });

  return (
    <>
      <PortalHeader
        title="Investment Portfolio"
        subtitle="Holdings, performance, and account growth"
      />
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        {dailyCompoundAccounts.map((acc) =>
          acc.dailyCompound ? (
            <PromoDailyCompoundPanel
              key={`daily-${acc.id}`}
              seed={acc.dailyCompound}
              accountLabel={getAccountLabel(acc)}
            />
          ) : null
        )}

        {enrolledPlan &&
          investmentAccount &&
          portfolio.approvedDepositTotal > 0 &&
          !investmentAccount.dailyCompound?.active && (
            <InvestmentPlanSummary
              plan={enrolledPlan}
              capitalBalance={investmentAccount.balance}
              profitDeliveryMonth={profitDeliveryLabel ?? undefined}
              monthlyProfitEstimate={profitEstimate}
            />
          )}

        <div className="rounded-xl border border-slate-200 bg-gradient-to-r from-slate-950 to-teal-950 p-5 text-white sm:p-6">
          <p className="text-sm text-slate-300">Total Invested Value</p>
          <p className="mt-1 text-3xl font-bold sm:text-4xl">
            {formatCurrency(totalValue || portfolio.totalBalance)}
          </p>
          <p className="mt-2 text-sm text-teal-300">
            {portfolio.approvedDepositTotal === 0
              ? "Portfolio value appears after admin approves your deposit"
              : profitDeliveryLabel
                ? `Monthly profit est. ${formatCurrency(profitEstimate)} · Delivered in ${profitDeliveryLabel} · YTD growth ${formatPercent(portfolio.ytdGrowthPercent)}`
                : `Monthly profit est. ${formatCurrency(profitEstimate)} · YTD growth ${formatPercent(portfolio.ytdGrowthPercent)}`}
          </p>
        </div>

        {portfolio.approvedDepositTotal > 0 && (
          <>
            <div className="grid gap-6 lg:grid-cols-2">
              <PortfolioGrowthChart data={portfolio.portfolioGrowthChart} />
              <MonthlyProfitChart data={portfolio.monthlyProfitChart} />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <BalanceTrendChart data={portfolio.monthlyProfitChart} />
              </div>
              <RegionAllocationChart
                data={portfolio.regionAllocation}
                invested={portfolio.approvedDepositTotal > 0}
              />
            </div>
          </>
        )}

        <LiveUsHoldingsPanel
          accounts={liveAccounts}
          invested={portfolio.approvedDepositTotal > 0}
        />
      </div>
    </>
  );
}
