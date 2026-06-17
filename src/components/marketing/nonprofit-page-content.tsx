import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2, HeartHandshake, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NONPROFIT_CAPITAL_TIERS,
  NONPROFIT_MAX_CAPITAL,
  NONPROFIT_MIN_CAPITAL,
  estimateMonthlyProfit,
  formatNonprofitUsd,
} from "@/lib/nonprofit-program";

export function NonprofitPageContent() {
  return (
    <div>
      <section className="bg-gradient-to-br from-violet-950 via-indigo-950 to-slate-950 text-white">
        <div className="page-container py-16 lg:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-500/20 px-4 py-1.5 text-sm font-semibold text-violet-200 ring-1 ring-violet-400/30">
              <CheckCircle2 className="h-4 w-4" />
              Non-Profit Fund Program — Available Now
            </div>
            <div className="mt-6 mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-violet-600/30 text-violet-300">
              <HeartHandshake className="h-7 w-7" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Non-Profit Organization Fund Accounts
            </h1>
            <p className="mt-2 text-lg text-violet-200">
              High monthly returns for tax-exempt organizations with dedicated fund capital
            </p>
            <p className="mt-6 text-slate-300 leading-relaxed">
              AWS Vision offers a dedicated program for non-profit organizations managing endowed
              funds, reserves, and mission-driven capital. Enroll with a minimum of{" "}
              {formatNonprofitUsd(NONPROFIT_MIN_CAPITAL)} and earn between 8% and 10% monthly profit
              based on your enrolled capital — distributed on a monthly basis to support your
              organization&apos;s mission.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/signup/nonprofit">
                <Button size="lg" className="bg-violet-600 hover:bg-violet-700">
                  Open Non-Profit Account
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  className="border border-white bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  Organization Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-100">
        <div className="page-container">
          <h2 className="text-2xl font-bold text-slate-900">Monthly Profit Tiers</h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            Profit is calculated and distributed monthly. Higher enrolled capital unlocks higher
            monthly rates — from 8% at {formatNonprofitUsd(NONPROFIT_MIN_CAPITAL)} up to 10% at{" "}
            {formatNonprofitUsd(NONPROFIT_MAX_CAPITAL)}.
          </p>
          <div className="mt-10 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 font-semibold text-slate-700 sm:px-6">Tier</th>
                  <th className="px-4 py-3 font-semibold text-slate-700 sm:px-6">Enrolled Capital</th>
                  <th className="px-4 py-3 font-semibold text-slate-700 sm:px-6">Monthly Rate</th>
                  <th className="px-4 py-3 font-semibold text-slate-700 sm:px-6">Est. Monthly Profit</th>
                </tr>
              </thead>
              <tbody>
                {NONPROFIT_CAPITAL_TIERS.map((tier) => (
                  <tr key={tier.capital} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-4 font-medium text-slate-900 sm:px-6">{tier.label}</td>
                    <td className="px-4 py-4 text-slate-700 sm:px-6">
                      {formatNonprofitUsd(tier.capital)}
                    </td>
                    <td className="px-4 py-4 font-semibold text-violet-700 sm:px-6">
                      {tier.monthlyRate}%
                    </td>
                    <td className="px-4 py-4 text-emerald-700 sm:px-6">
                      {formatNonprofitUsd(estimateMonthlyProfit(tier.capital))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="page-container">
          <h2 className="text-2xl font-bold text-slate-900">Program Features</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Building2,
                title: "Dedicated Non-Profit Enrollment",
                desc: "A separate application designed for 501(c) organizations, foundations, and tax-exempt entities — not the individual account flow.",
              },
              {
                icon: HeartHandshake,
                title: "Mission-Aligned Returns",
                desc: "Monthly profit distributions help sustain programs, endowments, and operating reserves without sacrificing liquidity planning.",
              },
              {
                icon: Shield,
                title: "Organization Dashboard",
                desc: "Your client portal clearly identifies your account as a non-profit organization profile with fund capital, rate tier, and monthly profit tracking.",
              },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border border-slate-200 p-6">
                <f.icon className="h-6 w-6 text-violet-600" />
                <h3 className="mt-4 font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-violet-700 py-14">
        <div className="page-container text-center">
          <h2 className="text-2xl font-bold text-white">Ready to enroll your organization?</h2>
          <p className="mt-2 text-violet-100 max-w-xl mx-auto">
            Minimum enrollment from {formatNonprofitUsd(NONPROFIT_MIN_CAPITAL)}. You will need your
            EIN, tax-exempt determination letter, and authorized representative details.
          </p>
          <Link href="/signup/nonprofit" className="mt-6 inline-block">
            <Button size="lg" className="bg-white text-violet-700 hover:bg-slate-100">
              Start Non-Profit Application
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
