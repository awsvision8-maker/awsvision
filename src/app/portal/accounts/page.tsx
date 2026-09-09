"use client";

import { Plus } from "lucide-react";
import { PortalHeader } from "@/components/portal/sidebar";
import { PromoDailyCompoundPanel } from "@/components/portal/promo-daily-compound-panel";
import { LiveUsHoldingsPanel } from "@/components/portal/live-us-holdings-panel";
import { Badge } from "@/components/ui/badge";
import { MobileDataCard } from "@/components/ui/mobile-data-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getInvestmentPlan } from "@/lib/investment-plans";
import { getAccountLabel } from "@/lib/portfolio-engine";
import { usePortfolio } from "@/lib/use-portfolio";
import { RETURN_TIERS } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function AccountsPage() {
  const portfolio = usePortfolio();
  const dailyCompoundAccounts = portfolio.accounts.filter((a) => a.dailyCompound?.active);
  const liveAccounts = portfolio.accounts.map((a) => {
    const ledger = portfolio.portfolioAccounts.find((p) => p.id === a.id);
    return {
      id: a.id,
      label: getAccountLabel(a),
      balance: Math.max(a.balance, ledger?.principal ?? 0),
      annualReturnPercent: a.interestRate || portfolio.annualReturn || 12,
    };
  });

  return (
    <>
      <PortalHeader
        title="My Accounts"
        subtitle="Your account balances and program details"
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

        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            {portfolio.accounts.length} active account
            {portfolio.accounts.length !== 1 ? "s" : ""} · Total{" "}
            {formatCurrency(portfolio.totalBalance)}
          </p>
          <Button>
            <Plus className="h-4 w-4" />
            Open New Account
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {portfolio.accounts.map((acc) => {
            const plan = acc.investmentPlanId
              ? getInvestmentPlan(acc.investmentPlanId)
              : undefined;
            const monthlyRatePercent =
              acc.type === "savings" ? acc.interestRate / 12 : acc.interestRate / 12;
            const daily = acc.dailyCompound;
            const accountHoldings = portfolio.holdings.filter((h) => h.accountId === acc.id);
            const classCounts = accountHoldings.reduce<Record<string, number>>((map, h) => {
              const key = h.assetClass ?? "Equity";
              map[key] = (map[key] ?? 0) + 1;
              return map;
            }, {});

            return (
              <Card key={acc.id} className="overflow-hidden">
                <div
                  className={`h-2 ${
                    daily?.active
                      ? "bg-gradient-to-r from-amber-400 to-teal-500"
                      : acc.type === "savings"
                        ? "bg-gradient-to-r from-teal-500 to-teal-600"
                        : acc.type === "nonprofit_fund"
                          ? "bg-gradient-to-r from-violet-500 to-violet-600"
                          : "bg-gradient-to-r from-amber-500 to-amber-600"
                  }`}
                />
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{getAccountLabel(acc)}</CardTitle>
                      <p className="mt-1 font-mono text-sm text-slate-400">
                        {acc.accountNumber}
                      </p>
                    </div>
                    <Badge variant={acc.status === "active" ? "success" : "default"}>
                      {acc.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-500">Current Balance</p>
                      <p className="text-3xl font-bold text-slate-900">
                        {formatCurrency(acc.balance)}
                      </p>
                      <p className="mt-1 text-xs text-emerald-600">
                        {daily?.active
                          ? daily.started
                            ? `+${formatCurrency(daily.latestDayProfit)} latest day · ${daily.dailyRatePercent}% daily compound`
                            : `0.5% daily starts ${formatDate(daily.firstProfitDate)}`
                          : `+${formatCurrency((acc.balance * monthlyRatePercent) / 100)} est. next monthly profit`}
                      </p>
                    </div>
                    {accountHoldings.length > 0 && (
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                          Holdings · {accountHoldings.length} positions
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {[
                            classCounts.Equity ? `${classCounts.Equity} equities` : null,
                            classCounts.Bond ? `${classCounts.Bond} bonds` : null,
                            classCounts.Yield ? `${classCounts.Yield} yields` : null,
                            classCounts["Real Estate"]
                              ? `${classCounts["Real Estate"]} real estate`
                              : null,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-4">
                      <div>
                        <p className="text-xs text-slate-400">Program Rate</p>
                        <p className="text-lg font-semibold text-teal-600">
                          {daily?.active
                            ? `${daily.dailyRatePercent}% / day`
                            : acc.type === "savings"
                              ? `${acc.interestRate}% p.a.`
                              : `${monthlyRatePercent.toFixed(2)}%/mo`}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">
                          {daily?.endDate
                            ? "Program end"
                            : acc.maturityDate
                              ? "Maturity Date"
                              : "Opened On"}
                        </p>
                        <p className="text-sm font-medium text-slate-700">
                          {daily?.endDate
                            ? formatDate(daily.endDate)
                            : acc.maturityDate
                              ? formatDate(acc.maturityDate)
                              : formatDate(acc.createdAt)}
                        </p>
                      </div>
                    </div>
                    {plan && (
                      <p className="text-xs text-slate-500">
                        {plan.name} plan · {plan.totalRoiPercent}% total return over{" "}
                        {plan.termMonths} months
                      </p>
                    )}
                    {acc.type === "fixed_deposit" && (
                      <p className="text-xs text-slate-500">
                        Funds are locked until maturity. Contact your relationship manager for
                        early withdrawal.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {portfolio.approvedDepositTotal > 0 && (
          <LiveUsHoldingsPanel
            accounts={liveAccounts}
            invested={portfolio.approvedDepositTotal > 0}
          />
        )}

        <Card>
          <CardHeader>
            <CardTitle>Return Tiers</CardTitle>
            <p className="text-sm text-slate-500">
              Savings gratuity tiers — investment & FD accounts use plan monthly rates
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 md:hidden">
              {RETURN_TIERS.map((tier) => (
                <MobileDataCard
                  key={tier.label}
                  title={tier.label}
                  fields={[
                    {
                      label: "Range",
                      value: `$${tier.min.toLocaleString()} — ${
                        tier.max === Infinity ? "Unlimited" : `$${tier.max.toLocaleString()}`
                      }`,
                    },
                    { label: "Return", value: `${tier.rate}% p.a.`, highlight: true },
                    {
                      label: "Type",
                      value: tier.max === Infinity ? "Fixed Deposit" : "Savings",
                    },
                  ]}
                />
              ))}
            </div>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left">
                    <th className="pb-3 font-medium text-slate-500">Tier</th>
                    <th className="pb-3 font-medium text-slate-500">Range</th>
                    <th className="pb-3 font-medium text-slate-500">Return</th>
                    <th className="pb-3 font-medium text-slate-500">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {RETURN_TIERS.map((tier) => (
                    <tr key={tier.label} className="border-b border-slate-50">
                      <td className="py-3 font-medium text-teal-600">{tier.label}</td>
                      <td className="py-3 text-slate-600">
                        ${tier.min.toLocaleString()} —{" "}
                        {tier.max === Infinity
                          ? "Unlimited"
                          : `$${tier.max.toLocaleString()}`}
                      </td>
                      <td className="py-3 font-semibold">{tier.rate}% p.a.</td>
                      <td className="py-3 text-slate-600">
                        {tier.max === Infinity ? "Fixed Deposit" : "Savings"}
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
