import Link from "next/link";
import { ArrowRight, CheckCircle2, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InvestmentPlansSection } from "@/components/marketing/investment-plans-section";
import { INVESTMENT_MESSAGE } from "@/lib/firm-positioning";
import { OPEN_NOW_MESSAGE } from "@/lib/product-availability";
import { SERVICE_PAGES } from "@/lib/site-data";

const data = SERVICE_PAGES["wealth-management"];

export function InvestmentPageContent() {
  return (
    <div>
      <section id="plans" className="bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white">
        <div className="page-container py-16 lg:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-1.5 text-sm font-semibold text-emerald-300 ring-1 ring-emerald-400/30">
              <CheckCircle2 className="h-4 w-4" />
              Investment Plans — Available Now
            </div>
            <div className="mt-6 mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-teal-600/20 text-teal-400">
              <LineChart className="h-7 w-7" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{data.title}</h1>
            <p className="mt-2 text-lg text-teal-300">{data.subtitle}</p>
            <p className="mt-6 text-slate-300 leading-relaxed">{INVESTMENT_MESSAGE}</p>
            <p className="mt-4 text-sm text-emerald-200/90">{OPEN_NOW_MESSAGE}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/signup?account=investment">
                <Button size="lg">
                  Open Investment Account
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  className="border border-white bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  Client Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-100">
        <div className="page-container">
          <InvestmentPlansSection />
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="page-container">
          <h2 className="text-2xl font-bold text-slate-900">Program Features</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.features.map((f) => (
              <div key={f.title} className="rounded-xl border border-slate-200 p-6">
                <CheckCircle2 className="h-6 w-6 text-teal-600" />
                <h3 className="mt-4 font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-teal-700 py-14">
        <div className="page-container text-center">
          <h2 className="text-2xl font-bold text-white">Ready to select your plan?</h2>
          <p className="mt-2 text-teal-100 max-w-xl mx-auto">
            Choose Silver through Executive tiers. Monthly profit from 2% to 7% based on capital
            and term.
          </p>
          <Link href="/signup?account=investment" className="mt-6 inline-block">
            <Button size="lg" className="bg-white text-teal-700 hover:bg-slate-100">
              Start Application
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
