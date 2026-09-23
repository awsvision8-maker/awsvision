import Link from "next/link";
import { Globe2, Laptop, Shield } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site-config";
import { US_STATES } from "@/lib/us-locations";

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
  const stateListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "AWS Vision Financial — U.S. states served online",
    numberOfItems: US_STATES.length,
    itemListElement: US_STATES.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.name,
      url: `https://awsvision.com/serving-united-states/${s.slug}`,
    })),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(stateListLd) }}
      />
      <section className="bg-gradient-to-br from-slate-950 to-teal-950 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">
            Service area · United States
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            Online financial services across the United States
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">
            AWS Vision Financial serves clients in all 50 states. Open an investment account with
            digital KYC, savings and fixed deposit products, and wealth management — without needing
            a local branch. Pick your state below for major-city pages.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup" className={btnPrimary}>
              Open an account
            </Link>
            <Link href="/serving-texas" className={btnOutlineLight}>
              Texas city directory
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
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-2xl font-bold text-slate-900">All 50 states</h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            Each state page links to major cities from our coverage list. Texas keeps its deeper
            city set under /serving-texas — we do not duplicate those URLs.
          </p>
          <ul className="mt-8 grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {US_STATES.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/serving-united-states/${s.slug}`}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 transition hover:border-teal-300 hover:text-teal-800"
                >
                  <span>{s.name}</span>
                  <span className="text-xs text-slate-400">{s.abbr}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-slate-200 py-16">
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
        </div>
      </section>
    </div>
  );
}
