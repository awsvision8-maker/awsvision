import Link from "next/link";
import { ArrowRight, CheckCircle2, PiggyBank, Vault, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FIRM_SUMMARY,
  GRATUITY_MESSAGE,
  INVESTMENT_MESSAGE,
  WHAT_WE_DO_NOT_OFFER,
} from "@/lib/firm-positioning";
import { OPEN_NOW_MESSAGE } from "@/lib/product-availability";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/personal");

export default function PersonalOverviewPage() {
  const openAccounts = [
    {
      href: "/personal/savings",
      label: "Savings",
      icon: PiggyBank,
      blurb:
        "Earn monthly and yearly gratuity on your savings balance. Build capital with structured benefits from AWS Vision.",
    },
    {
      href: "/personal/cds",
      label: "Fixed Deposit (FD)",
      icon: Vault,
      blurb:
        "Lock in a fixed term and receive monthly and yearly gratuity in addition to your agreed returns.",
    },
    {
      href: "/wealth-management",
      label: "Investment",
      icon: LineChart,
      blurb:
        "We invest your capital across global sectors and pay monthly profit to your client portal.",
    },
  ];

  const comingSoon = [
    { label: "Credit Cards", href: "/credit-cards" },
    { label: "Home Loans", href: "/home-loans" },
    { label: "Auto Loans", href: "/auto-loans" },
    { label: "Personal Loans", href: "/personal-loans" },
    { label: "Insurance", href: "/insurance" },
  ];

  return (
    <div>
      <section className="bg-gradient-to-br from-slate-950 to-teal-950 py-16 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-sm font-medium text-emerald-300 mb-4">
            <CheckCircle2 className="h-4 w-4" />
            Savings · Fixed Deposits · Investment
          </div>
          <h1 className="text-4xl font-bold">Our Accounts</h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-300 leading-relaxed">
            {OPEN_NOW_MESSAGE}
          </p>
          <p className="mt-3 max-w-3xl text-sm text-slate-400">{WHAT_WE_DO_NOT_OFFER}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/signup">
              <Button size="lg">Open an Account</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-xl font-bold text-slate-900">Open today</h2>
          <p className="mt-2 text-sm text-slate-600">{GRATUITY_MESSAGE}</p>
          <p className="mt-1 text-sm text-slate-600">{INVESTMENT_MESSAGE}</p>

          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            {openAccounts.map(({ href, label, icon: Icon, blurb }) => (
              <Link
                key={href}
                href={href}
                className="group relative rounded-xl border-2 border-teal-200 bg-teal-50/30 p-8 hover:shadow-lg transition-all"
              >
                <span className="absolute top-4 right-4 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                  Available Now
                </span>
                <Icon className="h-10 w-10 text-teal-600" />
                <h2 className="mt-4 text-xl font-bold text-slate-900 group-hover:text-teal-700">
                  {label}
                </h2>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{blurb}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-teal-600">
                  Open account <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>

          <h2 className="mt-16 text-xl font-bold text-slate-900">Other products — opening soon</h2>
          <p className="mt-2 text-sm text-slate-500">
            Credit cards, loans, and insurance are not part of our core offering today.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {comingSoon.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl border border-slate-200 p-5 hover:shadow-md transition-all"
              >
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                  Opening Soon
                </span>
                <h3 className="mt-3 font-bold text-slate-900">{item.label}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
