"use client";

import { Plus } from "lucide-react";
import { PortalHeader } from "@/components/portal/sidebar";
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

  return (
    <>
      <PortalHeader
        title="My Accounts"
        subtitle="Balances grow monthly based on your plan rate and deposits"
      />
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
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

            return (
              <Card key={acc.id} className="overflow-hidden">
                <div
                  className={`h-2 ${
                    acc.type === "savings"
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
                        +{formatCurrency((acc.balance * (plan?.monthlyRate ?? acc.interestRate / 12)) / 100)}{" "}
                        est. next monthly profit
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-4">
                      <div>
                        <p className="text-xs text-slate-400">Program Rate</p>
                        <p className="text-lg font-semibold text-teal-600">
                          {plan
                            ? `${plan.monthlyRate}%/mo`
                            : acc.type === "savings"
                              ? `${acc.interestRate}% p.a.`
                              : `${acc.interestRate}% p.a.`}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">
                          {acc.maturityDate ? "Maturity Date" : "Opened On"}
                        </p>
                        <p className="text-sm font-medium text-slate-700">
                          {acc.maturityDate
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
