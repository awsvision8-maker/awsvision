import Link from "next/link";
import type { UsCityPage } from "@/lib/us-locations";
import { SITE } from "@/lib/site-config";

const btnPrimary =
  "inline-flex h-11 items-center justify-center rounded-lg bg-teal-500 px-5 text-sm font-semibold text-slate-950 transition hover:bg-teal-400";
const btnOutlineLight =
  "inline-flex h-11 items-center justify-center rounded-lg border border-white/30 px-5 text-sm font-semibold text-white transition hover:bg-white/10";
const btnTeal =
  "inline-flex h-11 items-center justify-center rounded-lg bg-teal-700 px-5 text-sm font-semibold text-white transition hover:bg-teal-800";
const btnOutline =
  "inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50";

export function UsCityPageContent({ city }: { city: UsCityPage }) {
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

      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 py-14 text-white sm:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">
            {city.stateName} · {city.stateAbbr} · {city.region}
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
            {city.headline}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            {city.intro}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/signup" className={btnPrimary}>
              Open an account
            </Link>
            <Link
              href={`/serving-united-states/${city.stateSlug}`}
              className={btnOutlineLight}
            >
              {city.stateName} overview
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 py-10">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-lg font-bold text-slate-900">Who this helps in {city.name}</h2>
          <ul className="mt-4 grid gap-3 md:grid-cols-3">
            {city.localFocus.map((item) => (
              <li
                key={item.slice(0, 40)}
                className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-sm leading-relaxed text-slate-600"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-xl font-bold text-slate-900">Getting started</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {city.processSteps.map((step, i) => (
              <li key={step.title} className="rounded-2xl border border-slate-200 p-5">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  Step {i + 1}
                </span>
                <h3 className="mt-2 font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-slate-600">{city.note}</p>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-12">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-xl font-bold text-slate-900">FAQ — {city.name}</h2>
          <div className="mt-5 space-y-5">
            {city.faqs.map((f) => (
              <div key={f.q}>
                <h3 className="font-semibold text-slate-900">{f.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.a}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-slate-500">
            {SITE.phone} · {SITE.email}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/rates" className={btnTeal}>
              View rates
            </Link>
            <Link href="/guides/open-investment-account-online-usa" className={btnOutline}>
              How to open an account
            </Link>
          </div>
        </div>
      </section>

      {city.siblingCities.length > 0 && (
        <section className="py-10">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-base font-semibold text-slate-900">
              More cities in {city.stateName}
            </h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {city.siblingCities.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 hover:border-teal-300"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/serving-united-states"
                  className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-800"
                >
                  All states
                </Link>
              </li>
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
