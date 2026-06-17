"use client";

import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  Sparkles,
  Shield,
  Zap,
  Calendar,
  Vault,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getActiveFdPromo,
  formatPromoUsd,
  promoMaturityValue,
  promoProfitAmount,
} from "@/lib/promotions";
import { cn } from "@/lib/utils";

type WealthPromoVariant = "hero" | "compact" | "strip";

interface WealthPromoBannerProps {
  variant?: WealthPromoVariant;
  className?: string;
}

function WealthGrowthVisual({ compact = false }: { compact?: boolean }) {
  const promo = getActiveFdPromo();
  const start = promo.minDeposit;
  const end = promoMaturityValue(start, promo);
  const bars = [28, 42, 58, 72, 88, 100];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-amber-400/40 bg-gradient-to-br from-slate-900 via-slate-950 to-teal-950 p-5 shadow-2xl shadow-teal-900/30 promo-pulse-glow",
        compact ? "p-4" : "p-6 sm:p-8"
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 80% 10%, rgba(245,158,11,0.25) 0%, transparent 50%), radial-gradient(circle at 10% 90%, rgba(13,148,136,0.2) 0%, transparent 45%)",
        }}
        aria-hidden
      />

      <div className="relative text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400/90 sm:text-xs">
          Total Wealth Growth
        </p>
        <p
          className={cn(
            "mt-2 font-black tabular-nums text-white",
            compact ? "text-5xl" : "text-6xl sm:text-7xl lg:text-8xl"
          )}
        >
          <span className="promo-shimmer-text">{promo.returnPercent}%</span>
        </p>
        <p className="mt-1 text-sm font-semibold text-teal-300 sm:text-base">
          in {promo.termMonths} months
        </p>
      </div>

      <div className="relative mt-5 flex items-end justify-center gap-1.5 sm:gap-2">
        {bars.map((h, i) => (
          <div
            key={i}
            className="w-3 rounded-t-sm bg-gradient-to-t from-teal-600 to-amber-400 sm:w-4"
            style={{ height: `${h * (compact ? 0.5 : 0.65)}px` }}
            aria-hidden
          />
        ))}
        <TrendingUp className="mb-0.5 h-5 w-5 text-emerald-400 sm:h-6 sm:w-6" aria-hidden />
      </div>

      <div className="relative mt-5 space-y-2 rounded-xl border border-white/10 bg-white/5 p-3 text-sm backdrop-blur-sm sm:p-4">
        <div className="flex justify-between gap-2 text-slate-300">
          <span>You deposit</span>
          <span className="font-bold text-white tabular-nums">{formatPromoUsd(start)}</span>
        </div>
        <div className="flex justify-between gap-2 text-emerald-300">
          <span className="flex items-center gap-1">
            <Zap className="h-3.5 w-3.5" aria-hidden />
            Your profit
          </span>
          <span className="font-bold tabular-nums">+{formatPromoUsd(promoProfitAmount(start, promo))}</span>
        </div>
        <div className="flex justify-between gap-2 border-t border-white/15 pt-2">
          <span className="font-medium text-amber-200">At maturity</span>
          <span className="text-lg font-black text-amber-300 tabular-nums">
            {formatPromoUsd(end)}
          </span>
        </div>
      </div>
    </div>
  );
}

/** Premium wealth-growth promotional banner — AWS Vision teal & gold theme */
export function WealthPromoBanner({ variant = "hero", className }: WealthPromoBannerProps) {
  const promo = getActiveFdPromo();
  const {
    badge,
    headline,
    subheadline,
    wealthHook,
    minDeposit,
    termMonths,
    monthLabel,
    endsLabel,
    signupHref,
    cdsHref,
    returnPercent,
  } = promo;

  if (variant === "strip") {
    return (
      <div
        className={cn(
          "relative overflow-hidden border-b border-amber-500/40 bg-gradient-to-r from-slate-950 via-teal-950 to-slate-900",
          className
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(90deg, transparent 0%, rgba(245,158,11,0.08) 50%, transparent 100%)",
          }}
          aria-hidden
        />
        <div className="page-container relative flex flex-col items-center justify-between gap-3 py-3 sm:flex-row sm:py-2.5">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500/20 ring-1 ring-amber-400/40">
              <TrendingUp className="h-4 w-4 text-amber-400" aria-hidden />
            </span>
            <div className="text-center sm:text-left">
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400/90 sm:text-xs">
                {badge}
              </p>
              <p className="text-xs font-semibold text-white sm:text-sm">
                <span className="promo-shimmer-text font-black">{returnPercent}%</span>
                <span className="text-slate-300"> wealth growth · </span>
                {formatPromoUsd(minDeposit)}+ · {termMonths} months
              </p>
            </div>
          </div>
          <Link
            href={signupHref}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 px-5 py-2 text-xs font-bold text-slate-950 shadow-lg shadow-amber-900/30 transition hover:from-amber-400 hover:to-amber-300 sm:w-auto sm:text-sm"
          >
            Grow My Wealth Now
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <section
        className={cn(
          "relative overflow-hidden border-y border-teal-800/50 bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900",
          className
        )}
        aria-label={`${promo.monthLong} wealth promotion`}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 20% 50%, rgba(13,148,136,0.35) 0%, transparent 55%), radial-gradient(ellipse at 80% 50%, rgba(245,158,11,0.2) 0%, transparent 50%)",
          }}
          aria-hidden
        />
        <div className="page-container relative py-8 sm:py-10">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto] lg:gap-12">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                {badge}
              </div>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {headline}
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
                {wealthHook} Deposit {formatPromoUsd(minDeposit)}+ in {monthLabel} — mature to{" "}
                <strong className="text-amber-300">{formatPromoUsd(promoMaturityValue(minDeposit, promo))}</strong>{" "}
                in just {termMonths} months.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link href={signupHref} className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-lg shadow-amber-900/30 hover:from-amber-400 hover:to-amber-300 sm:w-auto"
                  >
                    Start Growing Wealth
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={cdsHref} className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full border border-teal-500/50 bg-teal-900/30 text-white hover:bg-teal-800/40 sm:w-auto"
                  >
                    View FD Program
                  </Button>
                </Link>
              </div>
            </div>
            <div className="w-full max-w-xs mx-auto lg:mx-0">
              <WealthGrowthVisual compact />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // hero — full homepage treatment
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#0a1628] to-teal-950",
        className
      )}
      aria-labelledby="wealth-promo-heading"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 50%, rgba(13,148,136,0.18) 0%, transparent 42%), radial-gradient(circle at 85% 30%, rgba(245,158,11,0.12) 0%, transparent 40%), linear-gradient(180deg, transparent 0%, rgba(15,23,42,0.4) 100%)",
        }}
        aria-hidden
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" aria-hidden />

      <div className="page-container relative py-14 sm:py-16 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/40 bg-teal-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-teal-300 sm:text-sm">
              <Sparkles className="h-4 w-4 text-amber-400" aria-hidden />
              {badge} · {monthLabel}
            </div>

            <h2
              id="wealth-promo-heading"
              className="mt-6 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-[3.25rem]"
            >
              Multiply Your Capital.{" "}
              <span className="promo-shimmer-text">Build Wealth Faster.</span>
            </h2>

            <p className="mt-2 text-xl font-semibold text-teal-300 sm:text-2xl">{headline}</p>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              {subheadline}
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Vault, label: `${formatPromoUsd(minDeposit)} min.`, sub: "Fixed Deposit" },
                { icon: Zap, label: `${returnPercent}% return`, sub: `${termMonths}-month term` },
                { icon: Shield, label: "AWS Vision", sub: "Licensed & trusted" },
              ].map((item) => (
                <li
                  key={item.sub}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-600/30 text-teal-300">
                    <item.icon className="h-4 w-4" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white">{item.label}</p>
                    <p className="text-xs text-slate-400">{item.sub}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href={signupHref} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold shadow-xl shadow-amber-900/40 hover:from-amber-400 hover:to-amber-300 sm:min-w-[220px]"
                >
                  Open Wealth FD — {monthLabel}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/compare" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full border border-teal-400/50 bg-teal-500/15 text-teal-100 hover:bg-teal-500/25 hover:text-white sm:min-w-[200px]"
                >
                  Compare vs Big Banks
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href={cdsHref} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full border border-white/25 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 sm:min-w-[180px]"
                >
                  Explore Returns
                </Button>
              </Link>
            </div>

            <p className="mt-5 flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {endsLabel}. Capital growth illustration based on program terms at enrollment.
            </p>
          </div>

          <div className="mx-auto w-full max-w-md lg:max-w-lg">
            <WealthGrowthVisual />
          </div>
        </div>
      </div>
    </section>
  );
}
