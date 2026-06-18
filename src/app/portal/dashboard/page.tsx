"use client";

import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Clock,
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
import { formatCurrency, formatDate, formatMonthYear } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

export default function DashboardPage() {
  const { user } = useAuth();
  const portfolio = usePortfolio();
  const isNonprofit = user?.profileType === "nonprofit" && user.nonprofitProfile;

  const welcomeName = isNonprofit
    ? user.nonprofitProfile!.organizationLegalName
    : user?.firstName;

  const subtitle = isNonprofit
    ? "Fund balance updates after admin-approved deposits; profit accrues 30 days after first approval"
    : "Deposit funds to activate your account — balance and profit update after admin approval";

  const recentTx = portfolio.transactions.slice(0, 5);
  const showFundAccountCta =
    portfolio.approvedDepositTotal === 0 && portfolio.pendingDepositTotal === 0;

  const primaryAccount = portfolio.portfolioAccounts[0];
  const primaryPlan = portfolio.nextMonthPlanId
    ? getInvestmentPlan(portfolio.nextMonthPlanId)
    : portfolio.currentPlanId
      ? getInvestmentPlan(portfolio.currentPlanId)
      : primaryAccount?.investmentPlanId
        ? getInvestmentPlan(primaryAccount.investmentPlanId)
        : portfolio.accounts[0]?.investmentPlanId
          ? getInvestmentPlan(portfolio.accounts[0].investmentPlanId)
          : undefined;

  const currentPlan = portfolio.currentPlanId
    ? getInvestmentPlan(portfolio.currentPlanId)
    : undefined;

  const tierUpgradesNextMonth =
    portfolio.approvedDepositTotal > 0 &&
    portfolio.nextMonthPlanId &&
    portfolio.currentPlanId &&
    portfolio.nextMonthPlanId !== portfolio.currentPlanId;

  const enrolledMonthlyRate = isNonprofit
    ? user!.nonprofitProfile!.monthlyRate
    : portfolio.nextMonthRatePercent ||
      primaryPlan?.monthlyRate ||
      (portfolio.accounts[0]
        ? portfolio.accounts[0].interestRate / 12
        : portfolio.annualReturn / 12);

  const profitEstimate =
    portfolio.profitAccrualActive
      ? portfolio.monthlyProfit
      : portfolio.approvedDepositTotal > 0
        ? portfolio.nextMonthMonthlyProfit
        : 0;

  const profitDeliveryLabel = portfolio.profitDeliveryMonth
    ? formatMonthYear(portfolio.profitDeliveryMonth)
    : null;

  const profitRateSubtitle =
    portfolio.approvedDepositTotal === 0
      ? "Deposit required"
      : !portfolio.profitAccrualActive
        ? tierUpgradesNextMonth && primaryPlan
          ? `${primaryPlan.monthlyRate}% rate (after 30-day hold)`
          : primaryPlan
            ? `${primaryPlan.monthlyRate}% monthly`
            : `${enrolledMonthlyRate.toFixed(2)}% monthly`
        : tierUpgradesNextMonth && primaryPlan
          ? `${primaryPlan.monthlyRate}% from next month`
          : primaryPlan
            ? `${primaryPlan.monthlyRate}% of balance`
            : `${enrolledMonthlyRate.toFixed(2)}% monthly`;

  const profitSubtitle = profitDeliveryLabel
    ? `Delivered in ${profitDeliveryLabel}${profitRateSubtitle !== "Deposit required" ? ` · ${profitRateSubtitle}` : ""}`
    : profitRateSubtitle;

  return (
    <>
      <PortalHeader title={`Welcome back, ${welcomeName}`} subtitle={subtitle} />
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        {isNonprofit && user.nonprofitProfile && (
          <NonprofitProfileBanner profile={user.nonprofitProfile} />
        )}

        {showFundAccountCta && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 sm:px-6">
            <p className="font-semibold text-amber-900">Fund your account to get started</p>
            <p className="mt-1 text-sm text-amber-800">
              Your account is open with a $0 balance. Submit a deposit — once our team approves it,
              funds will appear here. Monthly profit begins 30 days after your first approved deposit.
            </p>
            <Link href="/portal/deposit" className="mt-3 inline-block">
              <Button size="sm">Make your first deposit</Button>
            </Link>
          </div>
        )}

        {portfolio.pendingDepositTotal > 0 && (
          <div className="flex items-start gap-3 rounded-xl border border-sky-200 bg-sky-50 px-4 py-4 sm:px-6">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-sky-600" />
            <div>
              <p className="font-semibold text-sky-900">Deposit pending approval</p>
              <p className="mt-1 text-sm text-sky-800">
                {formatCurrency(portfolio.pendingDepositTotal)} is awaiting admin review. Your balance
                will update once approved.
              </p>
            </div>
          </div>
        )}

        {tierUpgradesNextMonth && currentPlan && primaryPlan && (
          <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 sm:px-6">
            <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            <div>
              <p className="font-semibold text-emerald-900">Program tier upgrade next month</p>
              <p className="mt-1 text-sm text-emerald-800">
                Your approved deposits qualify for the {primaryPlan.name} package (
                {primaryPlan.monthlyRate}% monthly) starting next month — up from {currentPlan.name}{" "}
                ({currentPlan.monthlyRate}% monthly). Monthly profit will be calculated at the new
                rate from the first day of next month.
              </p>
            </div>
          </div>
        )}

        {portfolio.approvedDepositTotal > 0 && portfolio.totalBalance === portfolio.approvedDepositTotal && !portfolio.profitAccrualActive && portfolio.profitEligibleAt && (
          <div className="flex items-start gap-3 rounded-xl border border-violet-200 bg-violet-50 px-4 py-4 sm:px-6">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />
            <div>
              <p className="font-semibold text-violet-900">Profit accrual scheduled</p>
              <p className="mt-1 text-sm text-violet-800">
                Your deposited balance is active. Monthly profit accrual begins on{" "}
                {formatDate(portfolio.profitEligibleAt)} (30 days after your first approved deposit).
                {profitDeliveryLabel && (
                  <>
                    {" "}
                    Your first estimated profit of {formatCurrency(profitEstimate)} is scheduled for
                    delivery in <strong>{profitDeliveryLabel}</strong>.
                  </>
                )}
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title={isNonprofit ? "Enrolled Fund Capital (Current)" : "Total Portfolio Value"}
            value={portfolio.totalBalance}
            format="currency"
            icon={Wallet}
            subtitle={
              portfolio.approvedDepositTotal > 0 &&
              portfolio.approvedDepositTotal !== portfolio.totalBalance
                ? `${formatCurrency(portfolio.approvedDepositTotal)} deposited`
                : portfolio.approvedDepositTotal > 0
                  ? `${formatCurrency(portfolio.approvedDepositTotal)} approved`
                  : undefined
            }
          />
          <StatCard
            title="Monthly Profit (Est.)"
            value={profitEstimate}
            format="currency"
            icon={DollarSign}
            subtitle={profitSubtitle}
          />
          <StatCard
            title="Monthly Program Rate"
            value={enrolledMonthlyRate}
            format="percent"
            icon={Percent}
            subtitle={
              isNonprofit
                ? "Non-profit enrolled tier"
                : tierUpgradesNextMonth && primaryPlan
                  ? `${primaryPlan.name} from next month`
                  : primaryPlan
                    ? `${primaryPlan.name} · min ${formatCurrency(primaryPlan.minInvestment)}`
                    : "Auto-matched to approved deposits"
            }
          />
          <StatCard
            title="YTD Growth"
            value={portfolio.approvedDepositTotal > 0 ? portfolio.ytdGrowthPercent : 0}
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
              <SectorAllocationChart
                data={portfolio.sectorAllocation}
                invested={portfolio.approvedDepositTotal > 0}
              />
            </div>
          </>
        )}

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
