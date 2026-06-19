"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  Building2,
  Loader2,
  Sparkles,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AWS_VISION_COMPARE_TIERS,
  COMPARISON_LAST_UPDATED,
  COMPARISON_SCENARIOS,
  COMPARISON_SOURCES,
  COMPETITOR_BANKS,
  apyOneYearEarnings,
  bestComparableApy,
  type ComparisonReport,
  formatComparePercent,
  formatCompareUsd,
  formatInvestmentPlanRateLabel,
  monthlyProgramEarnings,
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

  const tier = report?.aws.investmentTier;
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
              Bank Comparison · Updated {COMPARISON_LAST_UPDATED}
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
              See How AWS Vision Stacks Up Against the Big Banks
            </h1>
            <p className="mt-5 text-lg text-slate-300 leading-relaxed">
              We compared bank annual APY (savings & CDs) against AWS Vision&apos;s monthly savings
              gratuity and investment program returns — calculated from published bank rates and our
              official program terms.
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
                    stat: tier ? formatComparePercent(tier.monthlyRate, 1) : "—",
                    label: "Your AWS Vision tier",
                    sub: tier
                      ? `${tier.name} · ${tier.monthlyRate}% monthly`
                      : "Select deposit size below",
                  },
                  {
                    stat: formatCompareUsd(awsInvestmentYear),
                    label: "Est. 12-mo program profit",
                    sub: tier
                      ? `${tier.monthlyRate}% monthly × 12 months (simple)`
                      : "Select deposit size below",
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
              <Link href="/signup">
                <Button size="lg">
                  Open AWS Vision Account
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/rates">
                <Button
                  size="lg"
                  className="border border-white/30 bg-transparent text-white hover:bg-white/10"
                >
                  View Our Rates
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
            Showing projections for <strong>{formatCompareUsd(principal)}</strong>
            {tier && (
              <>
                {" "}
                — AWS Vision <strong>{tier.name}</strong> plan at {tier.monthlyRate}% monthly (
                {formatCompareUsd(awsSavingsYear)} est. over 12 months)
              </>
            )}
          </p>
        </div>
      </section>

      {/* Savings comparison */}
      <section className="py-14 bg-slate-50">
        <div className="page-container">
          <h2 className="text-2xl font-bold text-slate-900">Deposit Yields vs AWS Vision Programs</h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            Banks show best published annual APY (savings or promotional CD). AWS Vision investment
            plans pay <strong>monthly profit on capital</strong> by tier — Silver 2%/mo from $5K,
            Gold 3%/mo from $10K, Diamond 4%/mo from $30K, Platinum 5%/mo from $50K, Premium Diamond
            6%/mo from $70K, Executive 7%/mo from $100K. Earnings below use your matched plan rate ×
            12 months (simple annual).
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
                    {tier ? formatInvestmentPlanRateLabel(tier) : "—"}
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
                        {row.bank.name}
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
            Bank earnings: principal × (annual APY ÷ 100). AWS Vision: monthly plan rate × 12 months
            on principal. At {formatCompareUsd(principal)}
            {tier ? (
              <>
                , <strong>{tier.name}</strong> at {tier.monthlyRate}%/mo earns{" "}
                {formatCompareUsd(awsSavingsYear)}/yr
              </>
            ) : null}{" "}
            vs a 4.5% bank APY earning about{" "}
            {formatCompareUsd(apyOneYearEarnings(principal, 4.5))}/yr.
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
            Bank CDs use APY (annual percentage yield). AWS Vision investment programs use monthly
            profit on capital — shown here as estimated 12-month program earnings using{" "}
            {tier?.compoundInterest ? "compound" : "simple"} monthly accrual at your matched tier.
          </p>

          <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
            <table className="w-full min-w-[800px] text-sm">
              <thead>
                <tr className="bg-slate-950 text-white">
                  <th className="px-4 py-3 text-left sm:px-6">Institution</th>
                  <th className="px-4 py-3 text-left sm:px-6">12-Mo CD (standard)</th>
                  <th className="px-4 py-3 text-left sm:px-6">1-Year CD Earnings</th>
                  <th className="px-4 py-3 text-left sm:px-6">vs AWS Vision Program</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-amber-100 bg-gradient-to-r from-amber-50 to-teal-50">
                  <td className="px-4 py-4 font-bold text-slate-900 sm:px-6">
                    AWS Vision — {tier?.name ?? "—"} ({tier?.monthlyRate ?? "—"}%/mo)
                  </td>
                  <td className="px-4 py-4 text-slate-700 sm:px-6">
                    {tier
                      ? `${tier.totalRoiPercent}% total over ${tier.termMonths} mo program`
                      : "—"}
                  </td>
                  <td className="px-4 py-4 font-bold text-teal-700 sm:px-6">
                    {formatCompareUsd(awsInvestmentYear)} / yr
                  </td>
                  <td className="px-4 py-4 text-xs text-slate-600 sm:px-6">
                    {report?.aws.fdPromo
                      ? `FD promo: ${report.aws.fdPromo.returnPercent}% in ${report.aws.fdPromo.termMonths} mo on $${(report.aws.fdPromo.minDeposit / 1000).toFixed(0)}K+`
                      : "Enroll at /rates for current FD promo"}
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
                Short-term promotional CDs — often require new money, relationship tiers, or specific
                terms. Still compared against AWS Vision program earnings at your tier.
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

      {/* Investment tier cards */}
      <section className="py-14 bg-slate-950 text-white">
        <div className="page-container">
          <h2 className="text-2xl font-bold">AWS Vision Investment Tiers vs Traditional Banking</h2>
          <p className="mt-2 max-w-2xl text-slate-400">
            At {formatCompareUsd(principal)}, your matched tier is{" "}
            <strong className="text-teal-300">{tier?.name ?? "—"}</strong> — estimated{" "}
            {formatCompareUsd(investment?.awsAnnualCompound ?? 0)} in 12-month program profit vs.{" "}
            {formatCompareUsd(chaseCdYear)} from Chase&apos;s standard 12-month CD (
            {formatComparePercent(
              COMPETITOR_BANKS.find((b) => b.id === "chase")?.cd12MonthApy ?? 0
            )}{" "}
            APY).
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {AWS_VISION_COMPARE_TIERS.map((t) => (
              <div
                key={t.id}
                className={cn(
                  "rounded-xl border p-5",
                  tier?.id === t.id
                    ? "border-teal-400 bg-teal-950/50 ring-2 ring-teal-500/30"
                    : "border-white/10 bg-white/5"
                )}
              >
                {tier?.id === t.id && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300">
                    Your tier
                  </span>
                )}
                <p className="text-lg font-bold">{t.name}</p>
                <p className="mt-2 text-3xl font-black text-amber-300">{t.monthlyRate}%</p>
                <p className="text-xs text-slate-400">monthly profit on capital</p>
                <p className="mt-4 text-sm text-slate-300">
                  Min {formatCompareUsd(t.min)} · {t.totalReturn}% total / {t.termMonths} mo
                </p>
                <p className="mt-2 text-sm font-semibold text-emerald-400">
                  {formatCompareUsd(
                    monthlyProgramEarnings(
                      principal >= t.min ? principal : t.min,
                      t.monthlyRate,
                      12
                    )
                  )}
                  /yr est. (simple)
                </p>
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
              <strong>AWS Vision investment plans:</strong> Earnings = capital × (monthly rate ÷ 100)
              × 12 months (simple annual). Your matched tier is chosen by minimum capital — e.g.
              $10,000 → Gold at 3%/mo = $3,600 over 12 months; $50,000 → Platinum at 5%/mo = $30,000;
              $100,000 → Executive at 7%/mo = $84,000.
            </p>
            <p>
              <strong>AWS Vision investment / FD programs (compound):</strong> When compound interest
              is enabled on your plan, 12-month profit uses capital × ((1 + monthly rate ÷ 100)
              <sup>12</sup> − 1). Shown in the CD comparison section where applicable.
            </p>
          </div>

          <h2 className="mt-12 text-2xl font-bold text-slate-900">Why the Output Is So Different</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Zap,
                title: "Higher yields than branch savings",
                desc: "Even megabank promotional CDs top out around 4–4.5% APY. AWS Vision investment programs distribute monthly profit from 2% to 7% on enrolled capital — a different product structure with higher modeled returns.",
              },
              {
                icon: TrendingUp,
                title: "Structured wealth programs",
                desc: "Traditional CDs lock in low single-digit APY. AWS Vision FD and investment tiers align with global sector portfolios — Silver through Executive — with up to 420% total program return.",
              },
              {
                icon: Building2,
                title: "Non-profit fund option",
                desc: "No megabank offers 8%–10% monthly returns on organization fund capital. AWS Vision's non-profit program serves $100K–$1M enrolled capital with a dedicated portal.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-slate-200 p-6">
                <item.icon className="h-7 w-7 text-teal-600" />
                <h3 className="mt-4 font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Non-profit quick compare */}
          <div className="mt-12 rounded-xl border border-violet-200 bg-violet-50/50 p-6 sm:p-8">
            <h3 className="text-lg font-bold text-slate-900">Non-Profit Organizations</h3>
            <p className="mt-2 text-sm text-slate-600">
              Traditional banks do not offer comparable monthly returns on endowed or reserve fund
              capital. AWS Vision non-profit tiers:
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[480px] text-sm">
                <thead>
                  <tr className="border-b border-violet-200 text-left text-slate-500">
                    <th className="py-2 pr-4">Enrolled capital</th>
                    <th className="py-2 pr-4">Monthly rate</th>
                    <th className="py-2">Est. monthly profit</th>
                  </tr>
                </thead>
                <tbody>
                  {NONPROFIT_CAPITAL_TIERS.map((t) => (
                    <tr key={t.capital} className="border-b border-violet-100">
                      <td className="py-3 font-medium">{formatCompareUsd(t.capital)}</td>
                      <td className="py-3 text-violet-700 font-semibold">{t.monthlyRate}%</td>
                      <td className="py-3 font-bold text-emerald-700">
                        {formatCompareUsd((t.capital * t.monthlyRate) / 100)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Link
              href="/nonprofit"
              className="mt-4 inline-block text-sm font-semibold text-violet-700 hover:underline"
            >
              Explore non-profit program →
            </Link>
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
            Reference figures from bank websites and independent rate publishers. Your actual rate may
            vary by location, balance, and relationship requirements.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COMPETITOR_BANKS.map((bank) => (
              <div key={bank.id} className="rounded-lg border border-slate-200 bg-white p-4 text-sm">
                <p className="font-bold text-slate-900">{bank.name}</p>
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
        </div>
      </section>

      {/* CTA */}
      <section className="bg-teal-700 py-14">
        <div className="page-container text-center">
          <h2 className="text-2xl font-bold text-white">Ready for a different kind of return?</h2>
          <p className="mt-2 text-teal-100 max-w-xl mx-auto">
            Open savings, fixed deposit, or investment accounts online — or enroll your non-profit
            organization from $100K.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-teal-700 hover:bg-slate-100">
                Open Account
              </Button>
            </Link>
            <Link href="/signup/nonprofit">
              <Button
                size="lg"
                className="border border-white bg-transparent text-white hover:bg-white/10"
              >
                Non-Profit Enrollment
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
            Competitor savings and CD rates shown are illustrative benchmarks from publicly available
            sources as of {COMPARISON_LAST_UPDATED} and may change without notice. Relationship rates,
            promotional CDs, and ZIP-specific pricing may differ. AWS Vision earnings illustrations
            use program terms at enrollment and do not guarantee future performance.
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
