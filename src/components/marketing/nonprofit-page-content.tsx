import Link from "next/link";
import { ArrowRight, Building2, CheckCircle2, HeartHandshake, Phone, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NONPROFIT_CAPITAL_TIERS,
  NONPROFIT_MIN_CAPITAL,
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
              Separate Non-Profit Fund Package — Available Now
            </div>
            <div className="mt-6 mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-violet-600/30 text-violet-300">
              <HeartHandshake className="h-7 w-7" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Non-Profit Organization Fund Accounts
            </h1>
            <p className="mt-2 text-lg text-violet-200">
              A dedicated package for tax-exempt organizations — capital tiers only; returns
              finalized with your representative
            </p>
            <p className="mt-6 text-slate-300 leading-relaxed">
              AWS Vision offers a separate enrollment path for non-profit organizations managing
              endowed funds, reserves, and mission-driven capital. Choose a fund capital tier
              starting at {formatNonprofitUsd(NONPROFIT_MIN_CAPITAL)}. Profit terms are customized
              on a call with our support team — percentages are not listed publicly.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/signup/nonprofit">
                <Button size="lg" className="bg-violet-600 hover:bg-violet-700">
                  Register Non-Profit Package
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  className="border border-white bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  Talk to Representative
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-100">
        <div className="page-container">
          <h2 className="text-2xl font-bold text-slate-900">Fund Capital Tiers</h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            Select how much your organization can enroll. Monthly profit rates and program terms
            are confirmed with a representative on your support call.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {NONPROFIT_CAPITAL_TIERS.map((tier) => (
              <div
                key={tier.capital}
                className="rounded-xl border border-violet-200 bg-white p-5 shadow-sm"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">
                  {tier.label} tier
                </p>
                <p className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
                  {formatNonprofitUsd(tier.capital)}
                </p>
                <p className="mt-1 text-sm text-slate-500">Minimum fund capital</p>
                <p className="mt-4 flex items-center gap-1.5 text-sm font-medium text-violet-800">
                  <Phone className="h-3.5 w-3.5" />
                  Talk to representative for returns
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/contact">
              <Button variant="outline">Talk to Support / Representative</Button>
            </Link>
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
                title: "Separate Non-Profit Package",
                desc: "A dedicated application for 501(c) organizations, foundations, and tax-exempt entities — not the individual account flow.",
              },
              {
                icon: HeartHandshake,
                title: "Mission-Aligned Funding",
                desc: "Enroll organization capital at a clear tier. Profit terms are personalized with your representative to support your programs.",
              },
              {
                icon: Shield,
                title: "Organization Dashboard",
                desc: "Your client portal identifies your account as a non-profit organization profile with fund capital and monthly tracking.",
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
            EIN, tax-exempt determination letter, and authorized representative details. Final
            returns are confirmed on a call with support.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/signup/nonprofit">
              <Button size="lg" className="bg-white text-violet-700 hover:bg-slate-100">
                Start Non-Profit Registration
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                className="border border-white bg-transparent text-white hover:bg-white/10"
              >
                Talk to Representative
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
