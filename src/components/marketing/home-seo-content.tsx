import Link from "next/link";
import { MARYLAND_HEADQUARTERS, SITE } from "@/lib/site-config";

const SERVICES = [
  {
    title: "Wealth Management & Investment Plans",
    desc: "Professional asset management with tiered monthly returns, global sector portfolios, and a secure client portal for real-time profit tracking.",
    href: "/wealth-management",
  },
  {
    title: "Fixed Deposit & CD Accounts",
    desc: "Lock in competitive fixed deposit rates with structured monthly program returns and flexible maturity terms from a licensed financial firm.",
    href: "/personal/cds",
  },
  {
    title: "High Yield Savings Accounts",
    desc: "Savings accounts with balance-based gratuity tiers, FDIC-insured deposits, and full online banking access.",
    href: "/personal/savings",
  },
  {
    title: "Non-Profit Investment Program",
    desc: "Dedicated fund management for tax-exempt organizations with scaled monthly program rates and organization portal access.",
    href: "/nonprofit",
  },
];

/** Server-rendered keyword-rich section for homepage SEO */
export function HomeSeoContent() {
  return (
    <section className="border-t border-slate-200 bg-white py-16" aria-labelledby="financial-services-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 id="financial-services-heading" className="text-2xl font-bold text-slate-900 sm:text-3xl">
          A Full-Service Financial Firm for Modern Investors
        </h2>
        <p className="mt-4 max-w-3xl text-slate-600 leading-relaxed">
          {SITE.name} is a licensed financial services and investment management company with U.S. headquarters in{" "}
          {SITE.address.city}, {SITE.address.state} and {MARYLAND_HEADQUARTERS.city}, {MARYLAND_HEADQUARTERS.state}. We combine quantitative fintech-driven asset management
          with transparent savings, fixed deposit (FD), and wealth management products — so individuals,
          families, and non-profit organizations can grow capital with monthly profit distribution and
          bank-grade security.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {SERVICES.map((service) => (
            <article key={service.href} className="rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900">
                <Link href={service.href} className="hover:text-teal-700 transition-colors">
                  {service.title}
                </Link>
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{service.desc}</p>
              <Link
                href={service.href}
                className="mt-3 inline-block text-sm font-medium text-teal-700 hover:underline"
              >
                Learn more →
              </Link>
            </article>
          ))}
        </div>

        <p className="mt-10 text-sm text-slate-500 leading-relaxed">
          Compare our program rates on the{" "}
          <Link href="/rates" className="text-teal-700 hover:underline">rates page</Link>, see how we stack up
          against major banks on our{" "}
          <Link href="/compare" className="text-teal-700 hover:underline">comparison guide</Link>, or{" "}
          <Link href="/signup" className="text-teal-700 hover:underline">open an account online</Link> in minutes.
          Investment products are not FDIC insured and may lose value. Banking deposits are subject to approval.
        </p>
      </div>
    </section>
  );
}
