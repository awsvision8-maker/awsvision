"use client";

import Link from "next/link";
import {
  ArrowRight,
  Scale,
  Shield,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { AppStoreBadges } from "@/components/marketing/app-store-badges";
import { HabitsMarquee } from "@/components/marketing/habits-marquee";
import { FdJunePromoBanner } from "@/components/marketing/fd-june-promo-banner";
import { ConnectWithUsSection } from "@/components/marketing/connect-with-us-section";
import {
  PRODUCT_TABS,
  NEWS_ITEMS,
  MOBILE_APP_FEATURES,
  HOME_STATS,
} from "@/lib/boa-content";

export function HomePage() {
  return (
    <>
      {/* BoA-style hero: Open an account + login */}
      <section className="relative overflow-hidden bg-slate-100">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-teal-950/70" />
        <div
          className="absolute inset-0 opacity-30 bg-cover bg-center"
          style={{ backgroundImage: "linear-gradient(135deg, #0f172a 0%, #134e4a 100%)" }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Logo size="lg" href="/" priority className="mb-8" />
              <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl leading-tight">
                Investment Firm — Savings, Fixed Deposits &amp; Wealth Management
              </h1>
              <p className="mt-6 text-lg text-slate-200 leading-relaxed max-w-lg">
                AWS Vision is an investment firm offering Savings and Fixed Deposit accounts with
                monthly and yearly gratuity — plus global sector investing with monthly profit to
                your account. We do not offer checking accounts.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                <Link href="/signup" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:min-w-[180px]">
                    Get Started Today
                  </Button>
                </Link>
                <Link href="/compare" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:min-w-[200px] border border-amber-400/60 bg-amber-500/15 text-amber-100 hover:bg-amber-500/25 hover:text-white"
                  >
                    <Scale className="h-4 w-4" />
                    Compare vs Big Banks
                  </Button>
                </Link>
                <Link href="/contact#appointment" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:min-w-[180px] border border-white bg-transparent text-white hover:bg-white/10 hover:text-white"
                  >
                    Schedule an Appointment
                  </Button>
                </Link>
              </div>
              {/* Stats row — awsvision.com + BoA style */}
              <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {HOME_STATS.map((s) => (
                  <div key={s.label} className="text-center sm:text-left">
                    <p className="text-2xl font-bold text-teal-400">{s.value}</p>
                    <p className="text-xs text-slate-400 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Login panel — BoA exact pattern */}
            <div className="rounded-xl bg-white p-5 shadow-2xl max-w-md lg:ml-auto w-full sm:p-8">
              <h2 className="text-xl font-bold text-slate-900">Log In to Online Banking</h2>
              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Online ID</label>
                  <input className="mt-1 w-full rounded border border-slate-300 px-4 py-3 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Passcode</label>
                  <input type="password" className="mt-1 w-full rounded border border-slate-300 px-4 py-3 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600" />
                </div>
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" className="rounded" />
                  Save Online ID
                </label>
                <Link href="/login" className="block">
                  <Button className="w-full" size="lg">Log In</Button>
                </Link>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  <Link href="/signup" className="text-teal-700 font-medium hover:underline">Enroll</Link>
                  <Link href="/contact#help" className="text-teal-700 hover:underline">Forgot ID/Passcode?</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product category tabs — responsive grid, no horizontal scroll */}
      <section className="border-b border-slate-200 bg-white hidden lg:block overflow-x-hidden xl:sticky xl:top-[9.75rem] xl:z-40 xl:shadow-sm">
        <div className="mx-auto max-w-7xl px-4 xl:px-6">
          <div className="grid grid-cols-3 gap-0 lg:grid-cols-5 xl:grid-cols-9">
            {PRODUCT_TABS.map((tab) => (
              <Link
                key={tab.label}
                href={tab.href}
                title={tab.label}
                className="flex items-center justify-center gap-1.5 border-b-2 border-transparent px-1.5 py-3 text-center text-xs font-medium leading-tight text-slate-700 transition-colors hover:border-teal-600 hover:text-teal-700 lg:py-3.5 xl:gap-2 xl:px-2 xl:py-4 xl:text-sm 2xl:px-3 2xl:text-base"
              >
                <tab.icon className="h-3.5 w-3.5 shrink-0 xl:h-4 xl:w-4" />
                <span className="min-w-0">
                  <span className="2xl:hidden">{tab.shortLabel}</span>
                  <span className="hidden 2xl:inline">{tab.label}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile / tablet product grid */}
      <section className="lg:hidden bg-white border-b border-slate-200 py-4 px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-3">
          {PRODUCT_TABS.map((tab) => (
            <Link key={tab.label} href={tab.href} className="flex items-center gap-2 rounded-lg border border-slate-200 p-3 text-xs font-medium text-slate-700 sm:text-sm">
              <tab.icon className="h-4 w-4 text-teal-600 shrink-0" />
              <span className="leading-snug">{tab.shortLabel}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Better Money Habits — BoA carousel section */}
      <section className="py-12 bg-white sm:py-16">
        <div className="page-container">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Your financial goals matter</h2>
          <p className="mt-3 text-slate-600 max-w-2xl">
            We can help you achieve them through Better Money Habits® financial education
            and programs that make communities stronger.
          </p>
          <div className="mt-8">
            <HabitsMarquee />
          </div>
          <Link href="/financial-education" className="mt-8 inline-flex items-center gap-2 text-teal-700 font-semibold hover:underline">
            Visit Better Money Habits® <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <FdJunePromoBanner />

      {/* News and information — BoA section */}
      <section className="py-12 bg-slate-50 sm:py-16">
        <div className="page-container">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Your news and information</h2>
          <div className="mt-8 grid gap-6 sm:mt-10 lg:grid-cols-2">
            {NEWS_ITEMS.map((item) => (
              <div key={item.title} className="rounded-xl bg-white border border-slate-200 p-6 sm:p-8 flex flex-col">
                <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-slate-600 leading-relaxed flex-1">{item.desc}</p>
                <Link href={item.href} className="mt-6 inline-flex items-center gap-1 text-teal-700 font-semibold hover:underline">
                  {item.cta} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
          <Link href="/news" className="mt-8 inline-flex items-center gap-2 text-teal-700 font-semibold hover:underline">
            View all news <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Mobile app — BoA "Get the mobile banking app" */}
      <section id="mobile-app" className="py-12 bg-slate-950 text-white sm:py-16">
        <div className="page-container">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
            <div>
              <Smartphone className="h-12 w-12 text-teal-400" />
              <h2 className="mt-4 text-3xl font-bold">Get the Mobile Banking app</h2>
              <p className="mt-4 text-slate-400 leading-relaxed">
                Do more with the AWS Vision Mobile Banking app. Set customizable alerts,
                deposit checks, and use biometric login for quicker access.
              </p>
              <ul className="mt-6 space-y-2">
                {MOBILE_APP_FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                    <Shield className="h-4 w-4 text-teal-400 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-slate-500">
                Your activities are protected by industry-leading security features.
              </p>
            </div>
            <div className="rounded-xl bg-slate-900 border border-slate-700 p-5 sm:p-8">
              <p className="font-semibold text-white">Download the AWS Vision App</p>
              <AppStoreBadges className="mt-6" />
              <p className="mt-6 text-sm text-slate-400">Or we can text a download link directly to your phone</p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  placeholder="Phone number"
                  className="min-h-11 w-full flex-1 rounded-lg border border-slate-600 bg-slate-800 px-4 py-2.5 text-sm text-white placeholder:text-slate-500"
                />
                <Button className="w-full sm:w-auto sm:shrink-0">Send</Button>
              </div>
              <Link href="/online-banking" className="mt-4 inline-block text-sm text-teal-400 hover:underline">
                Learn more about mobile banking options →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <ConnectWithUsSection />

      {/* FDIC disclaimer — BoA style */}
      <section className="bg-slate-100 py-6 px-4 sm:px-6">
        <p className="mx-auto max-w-4xl text-center text-xs text-slate-500 leading-relaxed">
          AWS Vision deposit products are FDIC insured where applicable.
          Investment products are not FDIC insured, not bank guaranteed, and may lose value.
          © {new Date().getFullYear()} AWS Vision. All rights reserved.
        </p>
      </section>
    </>
  );
}
