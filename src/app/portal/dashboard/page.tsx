"use client";

import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  DollarSign,
  Percent,
  TrendingUp,
  Wallet,
} from "lucide-react";
import {
  BalanceTrendChart,
  MonthlyProfitChart,
  PortfolioGrowthChart,
  SectorAllocationChart,
} from "@/components/charts/investment-charts";
import { NonprofitProfileBanner } from "@/components/portal/nonprofit-profile-banner";
import { PortalHeader } from "@/components/portal/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { getInvestmentPlan } from "@/lib/investment-plans";
import { getAccountLabel } from "@/lib/portfolio-engine";
import { usePortfolio } from "@/lib/use-portfolio";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

export default function DashboardPage() {
  const { user } = useAuth();
  const portfolio = usePortfolio();
  const isNonprofit = user?.profileType === "nonprofit" && user.nonprofitProfile;

  const welcomeName = isNonprofit
    ? user.nonprofitProfile!.organizationLegalName
    : user?.firstName;

  const subtitle = isNonprofit
    ? "Non-profit organization fund account — monthly profit grows per your enrolled tier"
    : "Portfolio balances update monthly based on your enrolled plan and deposits";

  const recentTx = portfolio.transactions.slice(0, 5);

  return (
    <>
      <PortalHeader title={`Welcome back, ${welcomeName}`} subtitle={subtitle} />
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        {isNonprofit && user.nonprofitProfile && (
          <NonprofitProfileBanner profile={user.nonprofitProfile} />
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title={isNonprofit ? "Enrolled Fund Capital (Current)" : "Total Portfolio Value"}
            value={portfolio.totalBalance}
            format="currency"
            icon={Wallet}
          />
          <StatCard
            title="Monthly Profit (Est.)"
            value={portfolio.monthlyProfit}
            format="currency"
            icon={DollarSign}
          />
          <StatCard
            title={isNonprofit ? "Monthly Return Rate" : "Annual Return Rate"}
            value={
              isNonprofit
                ? user.nonprofitProfile!.monthlyRate
                : portfolio.annualReturn
            }
            format="percent"
            icon={Percent}
            subtitle="Based on your enrolled program tier"
          />
          <StatCard
            title="YTD Growth"
            value={portfolio.ytdGrowthPercent}
            format="percent"
            icon={TrendingUp}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link href="/portal/deposit" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              <ArrowDownToLine className="h-4 w-4" />
              Deposit Funds
            </Button>
          </Link>
          <Link href="/portal/withdraw" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              <ArrowUpFromLine className="h-4 w-4" />
              Request Withdrawal
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <PortfolioGrowthChart data={portfolio.portfolioGrowthChart} />
          <MonthlyProfitChart data={portfolio.monthlyProfitChart} />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <BalanceTrendChart data={portfolio.monthlyProfitChart} />
          </div>
          <SectorAllocationChart data={portfolio.sectorAllocation} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Accounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {portfolio.accounts.map((acc) => {
                const plan = acc.investmentPlanId
                  ? getInvestmentPlan(acc.investmentPlanId)
                  : undefined;
                const rateLabel =
                  acc.type === "savings"
                    ? `${acc.interestRate}% p.a.`
                    : plan
                      ? `${plan.monthlyRate}% monthly`
                      : `${acc.interestRate}% p.a.`;

                return (
                  <div
                    key={acc.id}
                    className="flex flex-col gap-3 rounded-lg border border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{getAccountLabel(acc)}</p>
                      <p className="text-xs text-slate-400">{acc.accountNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">
                        {formatCurrency(acc.balance)}
                      </p>
                      <Badge variant="teal">{rateLabel}</Badge>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTx.length === 0 ? (
                  <p className="text-sm text-slate-500">No transactions yet.</p>
                ) : (
                  recentTx.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex flex-col gap-2 border-b border-slate-50 pb-3 last:border-0 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {tx.description}
                        </p>
                        <p className="text-xs text-slate-400">{formatDate(tx.date)}</p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-semibold ${
                            tx.type === "withdrawal"
                              ? "text-red-600"
                              : "text-emerald-600"
                          }`}
                        >
                          {tx.type === "withdrawal" ? "-" : "+"}
                          {formatCurrency(tx.amount)}
                        </p>
                        <Badge
                          variant={
                            tx.status === "completed"
                              ? "success"
                              : tx.status === "pending"
                                ? "warning"
                                : "danger"
                          }
                        >
                          {tx.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
