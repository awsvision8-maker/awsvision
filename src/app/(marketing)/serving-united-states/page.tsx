import Link from "next/link";
import { Globe2, Laptop, Shield } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site-config";

export const metadata = pageMetadata("/serving-united-states");

const btnPrimary =
  "inline-flex h-11 items-center justify-center rounded-lg bg-teal-500 px-5 text-sm font-semibold text-slate-950 transition hover:bg-teal-400";
const btnOutlineLight =
  "inline-flex h-11 items-center justify-center rounded-lg border border-white/30 px-5 text-sm font-semibold text-white transition hover:bg-white/10";
const btnOutline =
  "inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50";
const btnTeal =
  "inline-flex h-11 items-center justify-center rounded-lg bg-teal-700 px-5 text-sm font-semibold text-white transition hover:bg-teal-800";

export default function ServingUnitedStatesPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-slate-950 to-teal-950 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">
            Service area · United States
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Online financial services across the United States
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
            AWS Vision Financial serves clients nationwide. Open an investment account from any
            U.S. state with digital KYC, savings and fixed deposit products, and wealth management —
            without needing a local branch.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup" className={btnPrimary}>
              Open an account
            </Link>
            <Link href="/serving-texas" className={btnOutlineLight}>
              Texas residents
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-3">
          {[
            {
              icon: Globe2,
              title: "Nationwide reach",
              text: "Clients across the United States enroll online and manage portfolios in one portal.",
            },
            {
              icon: Laptop,
              title: "Service-based model",
              text: "Digital onboarding, statements, and support — built for remote financial services.",
            },
            {
              icon: Shield,
              title: "Licensed operations",
              text: `${SITE.licenses}. Contact ${SITE.phone} for account questions.`,
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 p-6">
              <item.icon className="h-6 w-6 text-teal-700" />
              <h2 className="mt-3 text-lg font-semibold text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Ready to get started?</h2>
          <p className="mt-3 text-slate-600">
            Compare rates, review wealth plans, or speak with support before you apply.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/rates" className={btnTeal}>
              View rates
            </Link>
            <Link href="/wealth-management" className={btnOutline}>
              Wealth plans
            </Link>
            <Link href="/guides/open-investment-account-online-usa" className={btnOutline}>
              How to open an account
            </Link>
            <Link href="/contact" className={btnOutline}>
              Contact
            </Link>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Texas focus:{" "}
            <Link href="/serving-texas/dallas" className="text-teal-700 hover:underline">
              Dallas
            </Link>
            {" · "}
            <Link href="/serving-texas/houston" className="text-teal-700 hover:underline">
              Houston
            </Link>
            {" · "}
            <Link href="/serving-texas/austin" className="text-teal-700 hover:underline">
              Austin
            </Link>
            {" · "}
            <Link href="/guides" className="text-teal-700 hover:underline">
              All guides
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
