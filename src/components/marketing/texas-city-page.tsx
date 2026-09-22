import Link from "next/link";
import type { TexasCity } from "@/lib/texas-cities";
import { TEXAS_CITIES } from "@/lib/texas-cities";
import { SITE } from "@/lib/site-config";

const btnPrimary =
  "inline-flex h-11 items-center justify-center rounded-lg bg-teal-500 px-5 text-sm font-semibold text-slate-950 transition hover:bg-teal-400";
const btnOutlineLight =
  "inline-flex h-11 items-center justify-center rounded-lg border border-white/30 px-5 text-sm font-semibold text-white transition hover:bg-white/10";
const btnTeal =
  "inline-flex h-11 items-center justify-center rounded-lg bg-teal-700 px-5 text-sm font-semibold text-white transition hover:bg-teal-800";
const btnOutline =
  "inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50";

export function TexasCityPageContent({ city }: { city: TexasCity }) {
  const others = TEXAS_CITIES.filter((c) => c.slug !== city.slug);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: city.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />

      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">
            Serving {city.metro} · Texas
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            {city.headline}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">{city.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup" className={btnPrimary}>
              Open an account
            </Link>
            <Link href="/serving-texas" className={btnOutlineLight}>
              All Texas coverage
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-xl font-bold text-slate-900">Who we help in {city.name}</h2>
          <ul className="mt-4 grid gap-3 md:grid-cols-3">
            {city.localFocus.map((item) => (
              <li key={item} className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-sm leading-relaxed text-slate-600">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Investment management",
              href: "/investment-management",
              text: `Online investment management for ${city.name} clients.`,
            },
            {
              title: "Wealth management",
              href: "/wealth-management",
              text: "Monthly profit distribution with portal statements.",
            },
            {
              title: "Portfolio management",
              href: "/portfolio-management",
              text: "Track balances, statements, and plan activity online.",
            },
            {
              title: "Financial planning",
              href: "/financial-planning",
              text: "Guides and account options for long-term goals.",
            },
            {
              title: "Savings",
              href: "/personal/savings",
              text: `Flexible capital growth for ${city.name} households.`,
            },
            {
              title: "Fixed deposits",
              href: "/personal/cds",
              text: "Locked program rates with clear maturity terms.",
            },
          ].map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="rounded-2xl border border-slate-200 p-6 transition hover:border-teal-300 hover:bg-teal-50/40"
            >
              <h2 className="text-lg font-semibold text-slate-900">{s.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{s.text}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-teal-700">Learn more →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-14">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-2xl font-bold text-slate-900">FAQ — {city.name}</h2>
          <div className="mt-6 space-y-5">
            {city.faqs.map((f) => (
              <div key={f.q}>
                <h3 className="font-semibold text-slate-900">{f.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.a}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-slate-500">
            Support: {SITE.phone} · {SITE.email}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/rates" className={btnTeal}>
              View rates
            </Link>
            <Link href="/guides/texas-online-wealth-management" className={btnOutline}>
              Texas wealth guide
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-lg font-semibold text-slate-900">Other Texas cities</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {others.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/serving-texas/${c.slug}`}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-teal-300"
                >
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/serving-united-states"
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-teal-300"
              >
                Nationwide U.S.
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
