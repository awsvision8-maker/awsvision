"use client";

import { CheckCircle2, Sparkles, Vault } from "lucide-react";
import {
  formatPromoUsd,
  promoMaturityValue,
  promoProfitAmount,
} from "@/lib/promotions";
import { useActiveFdPromo } from "@/lib/use-active-fd-promo";

/** Dedicated Wealth Accelerator FD package card for signup */
export function FdPromoPackageCard() {
  const { promo, loading } = useActiveFdPromo();

  if (loading || !promo) return null;

  return (
    <div className="rounded-xl border-2 border-amber-400 bg-gradient-to-br from-amber-50 via-white to-teal-50 p-4 sm:p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/15 ring-1 ring-amber-400/50">
            <Vault className="h-5 w-5 text-amber-700" aria-hidden />
          </span>
          <div>
            <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-700">
              <Sparkles className="h-3 w-3" aria-hidden />
              Separate promo package
            </p>
            <h3 className="mt-1 text-lg font-bold text-slate-900">{promo.packageName}</h3>
            <p className="mt-0.5 text-sm text-slate-600">{promo.packageLabel}</p>
          </div>
        </div>
        <div className="rounded-lg border border-amber-300 bg-amber-100/80 px-3 py-2 text-center">
          <p className="text-2xl font-black tabular-nums text-amber-900">{promo.returnPercent}%</p>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-800">
            Return after {promo.termMonths} months
          </p>
        </div>
      </div>

      <dl className="mt-4 grid gap-2 rounded-lg border border-amber-200/80 bg-white/80 p-3 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-xs text-slate-500">Minimum deposit</dt>
          <dd className="font-bold text-slate-900 tabular-nums">
            {formatPromoUsd(promo.minDeposit)}+
          </dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">Your profit</dt>
          <dd className="font-bold text-teal-700 tabular-nums">
            +{formatPromoUsd(promoProfitAmount(promo.minDeposit, promo))}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">At maturity</dt>
          <dd className="font-bold text-amber-800 tabular-nums">
            {formatPromoUsd(promoMaturityValue(promo.minDeposit, promo))}
          </dd>
        </div>
      </dl>

      <ul className="mt-4 space-y-2 text-sm text-slate-700">
        {[
          `${promo.returnPercent}% return after ${promo.termMonths} months`,
          `Minimum ${formatPromoUsd(promo.minDeposit)} · Open in ${promo.monthLabel} only`,
          "Monthly and yearly gratuity eligible",
          "Relationship manager support",
        ].map((item) => (
          <li key={item} className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <p className="mt-4 rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-amber-200">
        You are registering for this package only — the {promo.returnPercent}% return is the stated
        program return for the {promo.termMonths}-month term.
      </p>
    </div>
  );
}
