"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  Building2,
  Loader2,
  MessageCircle,
  Sparkles,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AWS_COMPARE_MAX_MONTHLY_RATE,
  AWS_VISION_COMPARE_TIERS,
  COMPARISON_LAST_UPDATED,
  COMPARISON_SCENARIOS,
  COMPARISON_SOURCES,
  COMPETITOR_RETAIL_BANKS,
  COMPETITOR_INVESTMENT_FIRMS,
  competitorCategoryLabel,
  apyOneYearEarnings,
  bestComparableApy,
  type ComparisonReport,
  formatComparePercent,
  formatCompareUsd,
  formatInvestmentPlanRateLabel,
  multiplierLabel,
} from "@/lib/bank-comparison";
import { NONPROFIT_CAPITAL_TIERS } from "@/lib/nonprofit-program";

export function BankComparisonPageContent() {
  const [principal, setPrincipal] = useState(50_000);
  const [report, setReport] = useState<ComparisonReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReport = useCallback(async (amount: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/compare/rates?principal=${amount}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to load comparison");
      setReport(json.report);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load comparison");
      setReport(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReport(principal);
  }, [principal, loadReport]);

  const savingsRows = report?.savings.filter((r) => !r.isAws) ?? [];
  const cdStandardRows = report?.cds.filter((r) => !r.isPromo) ?? [];
  const cdPromoRows = report?.cds.filter((r) => r.isPromo) ?? [];
  const investment = report?.investment;
  const hero = report?.hero;

  const awsSavingsYear = report?.aws.savingsYearEarnings ?? 0;
  const awsInvestmentYear = report?.aws.investmentYearSimple ?? 0;
  const chaseCdYear = hero?.chaseCdYear ?? 0;

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 text-white">
        <div className="page-container py-14 sm:py-18 lg:py-22">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/15 px-4 py-1.5 text-sm font-semibold text-amber-300 ring-1 ring-amber-400/30">
              <Trophy className="h-4 w-4" />
              Banks &amp; Investment Firms · Updated {COMPARISON_LAST_UPDATED}
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
              AWS Vision vs U.S. Banks &amp; Investment Firms
            </h1>
            <p className="mt-5 text-lg text-slate-300 leading-relaxed">
              Side-by-side with Chase, Bank of America, Ally, Fidelity, Schwab, Vanguard, Betterment
              and more — bank deposit APYs and brokerage cash/money-market yields vs AWS Vision
              program earnings (illustrated at up to {AWS_COMPARE_MAX_MONTHLY_RATE}% monthly). Your
              exact profit rate depends on enrolled capital.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {loading ? (
                <div className="col-span-3 flex items-center gap-2 text-slate-400">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Calculating comparison…
                </div>
              ) : (
                [
                  {
                    stat: hero?.multiplierVsChaseCd ?? "—",
                    label: "vs Chase 12-mo CD",
                    sub: `on ${formatCompareUsd(principal)}`,
                  },
                  {
                    stat: `Up to ${AWS_COMPARE_MAX_MONTHLY_RATE}%`,
                    label: "AWS Vision illustration",
                    sub: "Rates vary by capital · Talk to Support",
                  },
                  {
                    stat: formatCompareUsd(awsInvestmentYear),
                    label: "Est. 12-mo program profit",
                    sub: `Illustrated at up to ${AWS_COMPARE_MAX_MONTHLY_RATE}%/mo × 12`,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                  >
                    <p className="text-2xl font-black text-amber-300">{item.stat}</p>
                    <p className="mt-1 text-sm font-semibold text-white">{item.label}</p>
                    <p className="text-xs text-slate-400">{item.sub}</p>
                  </div>
                ))
              )}
            </div>
            {error && (
              <p className="mt-4 text-sm text-red-300">
                {error}. Refresh the page or try another deposit size.
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/contact">
                <Button size="lg">
                  Talk to Support
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="lg"
                  className="border border-white/30 bg-transparent text-white hover:bg-white/10"
                >
                  Open AWS Vision Account
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Scenario picker */}
      <section className="border-b border-slate-200 bg-white py-8">
        <div className="page-container">
          <p className="text-sm font-semibold text-slate-700">Compare earnings at deposit size</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {COMPARISON_SCENARIOS.map((s) => (
              <button
                key={s.principal}
                type="button"
                onClick={() => setPrincipal(s.principal)}
                className={cn(
                  "rounded-full px-5 py-2.5 text-sm font-semibold transition-colors cursor-pointer",
                  principal === s.principal
                    ? "bg-teal-600 text-white shadow-md"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Showing projections for <strong>{formatCompareUsd(principal)}</strong> using AWS Vision
            at <strong>up to {AWS_COMPARE_MAX_MONTHLY_RATE}% monthly</strong> (
            {formatCompareUsd(awsSavingsYear)} est. over 12 months). Profit percentages vary by
            capital —{" "}
            <Link href="/contact" className="font-semibold text-teal-700 hover:underline">
              talk to an agent
            </Link>{" "}
            for your rate.
          </p>
        </div>
      </section>

      {/* Savings comparison */}
      <section className="py-14 bg-slate-50">
        <div className="page-container">
          <h2 className="text-2xl font-bold text-slate-900">
            Bank &amp; Firm Cash Yields vs AWS Vision Programs
          </h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            Banks use published deposit/CD APY. Brokerages and robos use cash / money-market /
            cash-reserve yields (not equity returns). AWS Vision earnings below are illustrated at{" "}
            <strong>up to {AWS_COMPARE_MAX_MONTHLY_RATE}% monthly</strong> — our highest program
            rate. Your actual profit percentage depends on enrolled capital and is confirmed with
            support.
          </p>

          <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="bg-slate-950 text-white">
                  <th className="px-4 py-3 text-left font-medium sm:px-6">Institution</th>
                  <th className="px-4 py-3 text-left font-medium sm:px-6">Rate</th>
                  <th className="px-4 py-3 text-left font-medium sm:px-6">
                    Est. 1-Year Earnings on {formatCompareUsd(principal)}
                  </th>
                  <th className="px-4 py-3 text-left font-medium sm:px-6">vs AWS Vision</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-teal-100 bg-teal-50/80">
                  <td className="px-4 py-4 font-bold text-teal-900 sm:px-6">
                    <span className="inline-flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      AWS Vision
                    </span>
                  </td>
                  <td className="px-4 py-4 font-bold text-teal-700 sm:px-6">
                    {formatInvestmentPlanRateLabel({
                      monthlyRate: AWS_COMPARE_MAX_MONTHLY_RATE,
                      name: "AWS Vision",
                    })}
                  </td>
                  <td className="px-4 py-4 font-bold text-teal-700 sm:px-6">
                    {formatCompareUsd(awsSavingsYear)}
                  </td>
                  <td className="px-4 py-4 text-teal-700 sm:px-6">—</td>
                </tr>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                    </td>
                  </tr>
                ) : (
                  savingsRows.map((row) => (
                    <tr key={row.bank.id} className="border-b border-slate-100">
                      <td className="px-4 py-4 font-medium text-slate-900 sm:px-6">
                        <span className="block">{row.bank.name}</span>
                        {"category" in row.bank && row.bank.category && (
                          <span className="text-xs font-normal text-slate-400">
                            {competitorCategoryLabel(row.bank.category)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-slate-600 sm:px-6">
                        {row.rateLabel ?? `${formatComparePercent(row.apy)} APY`}
                      </td>
                      <td className="px-4 py-4 text-slate-600 sm:px-6">
                        {formatCompareUsd(row.earnings)}
                      </td>
                      <td className="px-4 py-4 sm:px-6">
                        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
                          {multiplierLabel(awsSavingsYear, row.earnings)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Competitor earnings: principal × (published cash/deposit APY ÷ 100). Brokerage figures are
            cash/MM yields — not stock-market returns. AWS Vision: illustrated at up to{" "}
            {AWS_COMPARE_MAX_MONTHLY_RATE}%/mo × 12 on principal (
            {formatCompareUsd(awsSavingsYear)}/yr at {formatCompareUsd(principal)}) vs a 4.5% bank
            APY earning about {formatCompareUsd(apyOneYearEarnings(principal, 4.5))}/yr. Actual AWS
            Vision rates vary by capital.
          </p>
        </div>
      </section>

      {/* CD / FD comparison */}
      <section className="py-14 bg-white">
        <div className="page-container">
          <h2 className="text-2xl font-bold text-slate-900">
            CD vs Investment & Fixed Deposit Programs
          </h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            Bank CDs use APY. AWS Vision program earnings here use an illustration of{" "}
            <strong>up to {AWS_COMPARE_MAX_MONTHLY_RATE}% monthly</strong>. Your personalized rate
            depends on capital — talk to support or an agent for enrollment terms.
          </p>

          <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
            <table className="w-full min-w-[800px] text-sm">
              <thead>
                <tr className="bg-slate-950 text-white">
                  <th className="px-4 py-3 text-left sm:px-6">Institution</th>
                  <th className="px-4 py-3 text-left sm:px-6">Program / CD</th>
                  <th className="px-4 py-3 text-left sm:px-6">1-Year Earnings</th>
                  <th className="px-4 py-3 text-left sm:px-6">Next step</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-amber-100 bg-gradient-to-r from-amber-50 to-teal-50">
                  <td className="px-4 py-4 font-bold text-slate-900 sm:px-6">
                    AWS Vision — up to {AWS_COMPARE_MAX_MONTHLY_RATE}%/mo
                  </td>
                  <td className="px-4 py-4 text-slate-700 sm:px-6">
                    Rates vary by capital · Talk to Support
                  </td>
                  <td className="px-4 py-4 font-bold text-teal-700 sm:px-6">
                    {formatCompareUsd(awsInvestmentYear)} / yr
                  </td>
                  <td className="px-4 py-4 sm:px-6">
                    <Link
                      href="/contact"
                      className="text-sm font-semibold text-teal-700 hover:underline"
                    >
                      Talk to an agent →
                    </Link>
                  </td>
                </tr>
                {cdStandardRows.map((row) => (
                  <tr key={`${row.bank.id}-std`} className="border-b border-slate-100">
                    <td className="px-4 py-4 font-medium sm:px-6">{row.bank.name}</td>
                    <td className="px-4 py-4 text-slate-600 sm:px-6">{row.apyLabel}</td>
                    <td className="px-4 py-4 text-slate-600 sm:px-6">
                      {formatCompareUsd(row.earnings)}
                    </td>
                    <td className="px-4 py-4 sm:px-6">
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
                        {row.multiplier}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {cdPromoRows.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-slate-900">Promotional CD rates (banks)</h3>
              <p className="mt-1 text-sm text-slate-600">
                Short-term promotional CDs — often require new money or specific terms. Compared
                against AWS Vision illustrated at up to {AWS_COMPARE_MAX_MONTHLY_RATE}% monthly.
              </p>
              <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                <table className="w-full min-w-[720px] text-sm">
                  <thead>
                    <tr className="bg-slate-800 text-white">
                      <th className="px-4 py-3 text-left sm:px-6">Bank</th>
                      <th className="px-4 py-3 text-left sm:px-6">Promo rate</th>
                      <th className="px-4 py-3 text-left sm:px-6">1-Year earnings*</th>
                      <th className="px-4 py-3 text-left sm:px-6">vs AWS Vision</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cdPromoRows.map((row) => (
                      <tr key={`${row.bank.id}-promo`} className="border-b border-slate-100">
                        <td className="px-4 py-4 font-medium sm:px-6">{row.bank.name}</td>
                        <td className="px-4 py-4 text-slate-600 sm:px-6">{row.apyLabel}</td>
                        <td className="px-4 py-4 text-slate-600 sm:px-6">
                          {formatCompareUsd(row.earnings)}
                        </td>
                        <td className="px-4 py-4 sm:px-6">
                          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
                            {row.multiplier}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                *Promo earnings use APY on principal for illustration; actual promo terms may be
                shorter than 12 months.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Investment tiers — min capital only, no public % */}
      <section className="py-14 bg-slate-950 text-white">
        <div className="page-container">
          <h2 className="text-2xl font-bold">AWS Vision Investment Tiers vs Traditional Banking</h2>
          <p className="mt-2 max-w-2xl text-slate-400">
            At {formatCompareUsd(principal)}, illustrated AWS Vision earnings are{" "}
            <strong className="text-teal-300">
              {formatCompareUsd(investment?.awsAnnualCompound ?? 0)}
            </strong>{" "}
            over 12 months (up to {AWS_COMPARE_MAX_MONTHLY_RATE}%/mo) vs.{" "}
            {formatCompareUsd(chaseCdYear)} from Chase&apos;s standard 12-month CD. Exact profit
            percentages vary by capital — talk to support for your plan.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AWS_VISION_COMPARE_TIERS.map((t) => (
              <div
                key={t.id}
                className="rounded-xl border border-white/10 bg-white/5 p-5"
              >
                <p className="text-lg font-bold">{t.name}</p>
                <p className="mt-2 text-sm text-slate-300">
                  Minimum investment {formatCompareUsd(t.min)}
                </p>
                <p className="mt-3 text-sm font-semibold text-amber-300">
                  Returns discussed with support
                </p>
                <Link href="/contact" className="mt-4 inline-block">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 hover:from-amber-400 hover:to-amber-300"
                  >
                    Talk to Support
                    <MessageCircle className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why different */}
      <section className="py-14 bg-white">
        <div className="page-container">
          <h2 className="text-2xl font-bold text-slate-900">How We Calculate This Comparison</h2>
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700 space-y-2">
            <p>
              <strong>Bank savings & CDs:</strong> Earnings = deposit × (APY ÷ 100). Rates sourced
              from each bank&apos;s published rate sheets and independent publishers (
              {COMPARISON_LAST_UPDATED}).
            </p>
            <p>
              <strong>AWS Vision (illustration):</strong> Earnings = capital × (up to{" "}
              {AWS_COMPARE_MAX_MONTHLY_RATE}% ÷ 100) × 12 months. This uses our highest published
              program ceiling so you can see maximum modeled advantage vs big banks.{" "}
              <strong>Profit percentages vary depending on capital</strong> — your enrolled rate is
              confirmed with support or a relationship agent.
            </p>
            <p>
              <strong>Personalized terms:</strong> Plan selection and monthly profit rate are set
              with your representative based on deposit size and program fit — not listed as fixed
              public tier percentages on this page.
            </p>
          </div>

          <h2 className="mt-12 text-2xl font-bold text-slate-900">Why the Output Is So Different</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Zap,
                title: "Higher yields than branch savings",
                desc: `Even megabank promotional CDs top out around 4–4.5% APY. AWS Vision programs can illustrate up to ${AWS_COMPARE_MAX_MONTHLY_RATE}% monthly on enrolled capital — a different product structure. Your rate depends on capital.`,
              },
              {
                icon: TrendingUp,
                title: "Structured wealth programs",
                desc: "Traditional CDs lock in low single-digit APY. AWS Vision investment and FD packages are structured wealth programs — terms are finalized with support based on your capital.",
              },
              {
                icon: Building2,
                title: "Non-profit fund option",
                desc: "AWS Vision's non-profit program serves organization capital with a dedicated portal. Returns are confirmed on a call with your representative.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-slate-200 p-6">
                <item.icon className="h-7 w-7 text-teal-600" />
                <h3 className="mt-4 font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-xl border border-violet-200 bg-violet-50/50 p-6 sm:p-8">
            <h3 className="text-lg font-bold text-slate-900">Non-Profit Organizations</h3>
            <p className="mt-2 text-sm text-slate-600">
              Traditional banks do not offer a comparable dedicated non-profit fund package. AWS
              Vision capital tiers — returns finalized with your representative:
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[400px] text-sm">
                <thead>
                  <tr className="border-b border-violet-200 text-left text-slate-500">
                    <th className="py-2 pr-4">Tier</th>
                    <th className="py-2 pr-4">Enrolled capital</th>
                    <th className="py-2">Monthly rate</th>
                  </tr>
                </thead>
                <tbody>
                  {NONPROFIT_CAPITAL_TIERS.map((t) => (
                    <tr key={t.capital} className="border-b border-violet-100">
                      <td className="py-3 font-medium text-slate-900">{t.label}</td>
                      <td className="py-3 font-medium">{formatCompareUsd(t.capital)}</td>
                      <td className="py-3 text-violet-700 font-semibold">Discuss on call</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex flex-wrap gap-4">
              <Link
                href="/nonprofit"
                className="text-sm font-semibold text-violet-700 hover:underline"
              >
                Explore non-profit package →
              </Link>
              <Link
                href="/contact"
                className="text-sm font-semibold text-violet-700 hover:underline"
              >
                Talk to representative →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Rate reference table */}
      <section className="py-14 bg-slate-100">
        <div className="page-container">
          <h2 className="text-xl font-bold text-slate-900">
            Published competitor rates ({COMPARISON_LAST_UPDATED})
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Banks show deposit/CD APYs. Brokerages and robos show cash / money-market / cash-reserve
            yields — not stock-market returns. Figures are illustrative and change often.
          </p>

          <h3 className="mt-8 text-lg font-semibold text-slate-900">U.S. banks</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COMPETITOR_RETAIL_BANKS.map((bank) => (
              <div key={bank.id} className="rounded-lg border border-slate-200 bg-white p-4 text-sm">
                <p className="font-bold text-slate-900">{bank.name}</p>
                <p className="text-xs text-slate-400">{competitorCategoryLabel(bank.category)}</p>
                <ul className="mt-2 space-y-1 text-slate-600">
                  <li>Best published: {formatComparePercent(bestComparableApy(bank))} APY</li>
                  <li>Standard savings: {formatComparePercent(bank.savingsApy)} APY</li>
                  <li>12-mo CD: {formatComparePercent(bank.cd12MonthApy)} APY</li>
                  {bank.bestPromoApy && (
                    <li>
                      Best promo: {formatComparePercent(bank.bestPromoApy)} — {bank.bestPromoNote}
                    </li>
                  )}
                  <li>Min CD: {bank.minCdDeposit}</li>
                </ul>
                {bank.sourceUrl && (
                  <a
                    href={bank.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs text-teal-600 hover:underline"
                  >
                    View source →
                  </a>
                )}
              </div>
            ))}
          </div>

          <h3 className="mt-10 text-lg font-semibold text-slate-900">
            U.S. investment firms (cash &amp; MM benchmarks)
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            Fidelity, Schwab, Vanguard, E*TRADE, Merrill, Betterment, Wealthfront, Edward Jones,
            Fisher — cash yields only for an apples-to-apples deposit-style comparison.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COMPETITOR_INVESTMENT_FIRMS.map((bank) => (
              <div key={bank.id} className="rounded-lg border border-slate-200 bg-white p-4 text-sm">
                <p className="font-bold text-slate-900">{bank.name}</p>
                <p className="text-xs text-slate-400">{competitorCategoryLabel(bank.category)}</p>
                <ul className="mt-2 space-y-1 text-slate-600">
                  <li>Best cash/MM: {formatComparePercent(bestComparableApy(bank))} APY</li>
                  <li>Cash / sweep: {formatComparePercent(bank.savingsApy)} APY</li>
                  {bank.cd12MonthApy > 0 && (
                    <li>12-mo CD / brokered: {formatComparePercent(bank.cd12MonthApy)} APY</li>
                  )}
                  {bank.bestPromoApy && (
                    <li>
                      Best promo: {formatComparePercent(bank.bestPromoApy)} — {bank.bestPromoNote}
                    </li>
                  )}
                  {bank.monthlyFeeNote && <li>Fees: {bank.monthlyFeeNote}</li>}
                </ul>
                <p className="mt-2 text-xs text-slate-500">{bank.savingsNote}</p>
                {bank.sourceUrl && (
                  <a
                    href={bank.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs text-teal-600 hover:underline"
                  >
                    View source →
                  </a>
                )}
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-slate-600">
            Deeper write-ups:{" "}
            <Link href="/guides/aws-vision-vs-us-banks" className="text-teal-700 hover:underline">
              vs U.S. banks
            </Link>
            {" · "}
            <Link
              href="/guides/aws-vision-vs-investment-firms"
              className="text-teal-700 hover:underline"
            >
              vs Fidelity / Schwab / robos
            </Link>
            {" · "}
            <Link href="/guides/aws-vision-vs-chase-bank" className="text-teal-700 hover:underline">
              vs Chase
            </Link>
            {" · "}
            <Link href="/guides/aws-vision-vs-fidelity" className="text-teal-700 hover:underline">
              vs Fidelity
            </Link>
            {" · "}
            <Link href="/guides/aws-vision-vs-schwab" className="text-teal-700 hover:underline">
              vs Schwab
            </Link>
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-teal-700 py-14">
        <div className="page-container text-center">
          <h2 className="text-2xl font-bold text-white">Ready for a different kind of return?</h2>
          <p className="mt-2 text-teal-100 max-w-xl mx-auto">
            Profit percentages vary by capital. Talk to support for your personalized rate, or open
            an account online.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-teal-700 hover:bg-slate-100">
                Talk to Support / Agent
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="lg"
                className="border border-white bg-transparent text-white hover:bg-white/10"
              >
                Open Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="border-t border-slate-200 bg-white py-10">
        <div className="page-container text-xs text-slate-500 leading-relaxed space-y-3">
          <p>
            <strong>Important disclosures:</strong> AWS Vision investment, fixed deposit, and
            non-profit fund programs are structured wealth products — not FDIC-insured bank deposits.
            Competitor savings, CD, and cash/money-market rates shown are illustrative benchmarks from
            publicly available sources as of {COMPARISON_LAST_UPDATED} and may change without notice.
            Brokerage and robo yields on this page are cash products only — not equity or mutual-fund
            performance. AWS Vision earnings on this page are illustrated at up to{" "}
            {AWS_COMPARE_MAX_MONTHLY_RATE}% monthly; actual profit percentages vary depending on
            capital and are confirmed at enrollment with support. Illustrations do not guarantee
            future performance.
          </p>
          <p>
            <strong>Sources reviewed:</strong>{" "}
            {COMPARISON_SOURCES.map((s, i) => (
              <span key={s.url}>
                <a
                  href={s.url}
                  className="text-teal-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {s.label}
                </a>
                {i < COMPARISON_SOURCES.length - 1 ? " · " : ""}
              </span>
            ))}
          </p>
        </div>
      </section>
    </div>
  );
}
