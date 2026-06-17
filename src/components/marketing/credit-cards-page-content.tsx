import Link from "next/link";
import { ArrowRight, Bell, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreditCardVisual } from "@/components/marketing/credit-card-visual";
import {
  CREDIT_CARD_PRODUCTS,
  CREDIT_CARDS_LAUNCH_MESSAGE,
} from "@/lib/credit-cards-data";
import { SERVICE_PAGES } from "@/lib/site-data";

const data = SERVICE_PAGES["credit-cards"];

export function CreditCardsPageContent() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white">
        <div className="page-container py-16 lg:py-20">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 px-4 py-1.5 text-sm font-semibold text-teal-300 ring-1 ring-teal-400/30">
            <Sparkles className="h-4 w-4" />
            Launching Soon
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">{data.title}</h1>
          <p className="mt-2 text-lg text-teal-300">{data.subtitle}</p>
          <p className="mt-6 max-w-3xl text-slate-300 leading-relaxed">{CREDIT_CARDS_LAUNCH_MESSAGE}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/contact#notify">
              <Button size="lg">
                <Bell className="h-4 w-4" />
                Join the Waitlist
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="lg"
                className="border border-white bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                Open a Bank Account
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Card gallery */}
      <section id="cards" className="py-16 bg-slate-50">
        <div className="page-container">
          <h2 className="text-2xl font-bold text-slate-900">Our Credit Card Lineup</h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            Every AWS Vision card features our logo and is designed for cash back, travel, business,
            and student needs. All cards shown below will be available at launch — applications open soon.
          </p>

          <div className="mt-12 grid gap-10 lg:grid-cols-2">
            {CREDIT_CARD_PRODUCTS.map((card) => (
              <div
                key={card.id}
                className="flex flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-start lg:p-8"
              >
                <CreditCardVisual card={card} className="mx-auto shrink-0 sm:mx-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-semibold text-teal-800">
                      {card.annualFee === "$0" ? "No Annual Fee" : `${card.annualFee} annual fee`}
                    </span>
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                      Coming Soon
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-slate-900">{card.name}</h3>
                  <p className="text-sm text-teal-700 font-medium">{card.tagline}</p>
                  <p className="mt-1 text-sm text-slate-500">{card.highlight}</p>
                  <ul className="mt-4 space-y-2">
                    {card.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All cards strip — compact gallery */}
      <section className="py-14 bg-white border-y border-slate-200">
        <div className="page-container">
          <h2 className="text-center text-xl font-bold text-slate-900">All Cards at a Glance</h2>
          <p className="mt-2 text-center text-sm text-slate-500">
            Branded with the AWS Vision logo · Visa network · Launching soon
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-6">
            {CREDIT_CARD_PRODUCTS.map((card) => (
              <div key={card.id} className="text-center">
                <CreditCardVisual card={card} compact comingSoon />
                <p className="mt-3 text-xs font-medium text-slate-700 max-w-[300px]">{card.shortName}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="page-container">
          <h2 className="text-2xl font-bold text-slate-900">Key Features & Benefits</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.features.map((f) => (
              <div key={f.title} className="rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
                <CheckCircle2 className="h-6 w-6 text-teal-600" />
                <h3 className="mt-4 font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
          <div className="mt-8 space-y-6">
            <div className="border-b border-slate-200 pb-6">
              <h3 className="font-semibold text-slate-900">When will AWS Vision credit cards launch?</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                We are preparing to launch our full credit card program soon. Join the waitlist on our
                contact page to receive an email notification when applications open.
              </p>
            </div>
            {data.faqs.map((faq) => (
              <div key={faq.q} className="border-b border-slate-200 pb-6">
                <h3 className="font-semibold text-slate-900">{faq.q}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-teal-700 py-14">
        <div className="page-container text-center">
          <h2 className="text-2xl font-bold text-white">Be first in line when we launch</h2>
          <p className="mt-2 text-teal-100 max-w-xl mx-auto">
            Credit card applications are not yet open. Open a bank or investment account today, or
            join our waitlist to get notified when cards go live.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/contact#notify">
              <Button size="lg" className="bg-white text-teal-700 hover:bg-slate-100">
                <Bell className="h-4 w-4" />
                Notify Me at Launch
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" className="border border-white bg-transparent text-white hover:bg-teal-600 hover:text-white">
                Contact an Advisor
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
