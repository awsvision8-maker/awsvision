"use client";

import Link from "next/link";
import { CheckCircle2, HeartHandshake, Phone } from "lucide-react";
import {
  NONPROFIT_MIN_CAPITAL,
  formatNonprofitUsd,
  getTierForCapital,
} from "@/lib/nonprofit-program";

interface NonprofitPackageCardProps {
  fundCapital?: number;
}

/** Dedicated non-profit fund package card for signup — no public percentages */
export function NonprofitPackageCard({ fundCapital }: NonprofitPackageCardProps) {
  const capital = fundCapital && fundCapital > 0 ? fundCapital : NONPROFIT_MIN_CAPITAL;
  const tier = getTierForCapital(capital);

  return (
    <div className="rounded-xl border-2 border-violet-300 bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-4 sm:p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-500/15 ring-1 ring-violet-400/40">
            <HeartHandshake className="h-5 w-5 text-violet-700" aria-hidden />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-violet-700">
              Separate non-profit package
            </p>
            <h3 className="mt-1 text-lg font-bold text-slate-900">
              Non-Profit Fund Account
            </h3>
            <p className="mt-0.5 text-sm text-slate-600">
              {tier.label} tier · from {formatNonprofitUsd(capital)}
            </p>
          </div>
        </div>
        <Link
          href="/contact"
          className="inline-flex items-center gap-1.5 rounded-lg border border-violet-300 bg-white px-3 py-2 text-xs font-semibold text-violet-800 hover:bg-violet-50"
        >
          <Phone className="h-3.5 w-3.5" />
          Talk to Representative
        </Link>
      </div>

      <ul className="mt-4 space-y-2 text-sm text-slate-700">
        {[
          `Minimum fund capital from ${formatNonprofitUsd(NONPROFIT_MIN_CAPITAL)}`,
          "Dedicated enrollment for tax-exempt organizations",
          "Profit terms customized on a support call",
          "Talk to representative to finalize your package",
        ].map((item) => (
          <li key={item} className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <p className="mt-4 rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-violet-200">
        Percentages are not shown publicly. Your relationship manager will confirm final returns
        during your support call.
      </p>
    </div>
  );
}
