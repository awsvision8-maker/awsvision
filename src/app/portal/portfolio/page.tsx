"use client";

import { PortalHeader } from "@/components/portal/sidebar";
import {
  InvestmentPlanSummary,
  getAccountInvestmentPlan,
} from "@/components/portal/investment-plan-summary";
import {
  PortfolioGrowthChart,
  RegionAllocationChart,
  SectorAllocationChart,
} from "@/components/charts/investment-charts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { REGION_ALLOCATION } from "@/lib/mock-data";
import { usePortfolio } from "@/lib/use-portfolio";
import { MobileDataCard } from "@/components/ui/mobile-data-card";
import { formatCurrency, formatPercent } from "@/lib/utils";

export default function PortfolioPage() {
  const portfolio = usePortfolio();
  const investmentAccount = portfolio.accounts.find(
    (a) => a.type === "investment" || a.type === "fixed_deposit" || a.type === "nonprofit_fund"
  );
  const enrolledPlan = investmentAccount
    ? getAccountInvestmentPlan(investmentAccount)
    : undefined;
  const totalValue = portfolio.holdings.reduce((s, h) => s + h.value, 0);

  return (
    <>
      <PortalHeader
        title="Investment Portfolio"
        subtitle="Values update monthly per your enrolled plan rate and deposit history"
      />
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        {enrolledPlan && investmentAccount && (
          <InvestmentPlanSummary
            plan={enrolledPlan}
            capitalBalance={investmentAccount.balance}
          />
        )}

        <div className="rounded-xl border border-slate-200 bg-gradient-to-r from-slate-950 to-teal-950 p-5 text-white sm:p-6">
          <p className="text-sm text-slate-300">Total Invested Value</p>
          <p className="mt-1 text-3xl font-bold sm:text-4xl">
            {formatCurrency(totalValue || portfolio.totalBalance)}
          </p>
          <p className="mt-2 text-sm text-teal-300">
            Monthly profit est. {formatCurrency(portfolio.monthlyProfit)} · YTD growth{" "}
            {formatPercent(portfolio.ytdGrowthPercent)}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <SectorAllocationChart data={portfolio.sectorAllocation} />
          <RegionAllocationChart data={REGION_ALLOCATION} />
        </div>

        <PortfolioGrowthChart data={portfolio.portfolioGrowthChart} />

        <Card>
          <CardHeader>
            <CardTitle>Holdings Detail</CardTitle>
            <p className="text-sm text-slate-500">
              Allocations scaled to your current portfolio balance
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:hidden">
              {portfolio.holdings.map((h) => (
                <MobileDataCard
                  key={h.id}
                  title={h.name}
                  badge={<Badge variant="default">{h.symbol}</Badge>}
                  fields={[
                    { label: "Sector", value: h.sector },
                    { label: "Region", value: h.region },
                    { label: "Allocation", value: `${h.allocation}%` },
                    { label: "Value", value: formatCurrency(h.value), highlight: true },
                    {
                      label: "Monthly",
                      value: `+${formatPercent(h.monthlyReturn)}`,
                      highlight: true,
                    },
                    { label: "YTD", value: `+${formatPercent(h.ytdReturn)}`, highlight: true },
                  ]}
                />
              ))}
            </div>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left">
                    <th className="pb-3 pr-4 font-medium text-slate-500">Investment</th>
                    <th className="pb-3 pr-4 font-medium text-slate-500">Symbol</th>
                    <th className="pb-3 pr-4 font-medium text-slate-500">Sector</th>
                    <th className="pb-3 pr-4 font-medium text-slate-500">Region</th>
                    <th className="pb-3 pr-4 font-medium text-slate-500 text-right">Allocation</th>
                    <th className="pb-3 pr-4 font-medium text-slate-500 text-right">Value</th>
                    <th className="pb-3 pr-4 font-medium text-slate-500 text-right">Monthly</th>
                    <th className="pb-3 font-medium text-slate-500 text-right">YTD</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.holdings.map((h) => (
                    <tr key={h.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                      <td className="py-4 pr-4 font-medium text-slate-900">{h.name}</td>
                      <td className="py-4 pr-4">
                        <Badge variant="default">{h.symbol}</Badge>
                      </td>
                      <td className="py-4 pr-4 text-slate-600">{h.sector}</td>
                      <td className="py-4 pr-4 text-slate-600">{h.region}</td>
                      <td className="py-4 pr-4 text-right font-medium">{h.allocation}%</td>
                      <td className="py-4 pr-4 text-right font-medium">
                        {formatCurrency(h.value)}
                      </td>
                      <td className="py-4 pr-4 text-right text-emerald-600">
                        +{formatPercent(h.monthlyReturn)}
                      </td>
                      <td className="py-4 text-right text-emerald-600">
                        +{formatPercent(h.ytdReturn)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
