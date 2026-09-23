import Link from "next/link";
import type { UsStatePage } from "@/lib/us-locations";
import { SITE } from "@/lib/site-config";

const btnPrimary =
  "inline-flex h-11 items-center justify-center rounded-lg bg-teal-500 px-5 text-sm font-semibold text-slate-950 transition hover:bg-teal-400";
const btnOutlineLight =
  "inline-flex h-11 items-center justify-center rounded-lg border border-white/30 px-5 text-sm font-semibold text-white transition hover:bg-white/10";
const btnTeal =
  "inline-flex h-11 items-center justify-center rounded-lg bg-teal-700 px-5 text-sm font-semibold text-white transition hover:bg-teal-800";
const btnOutline =
  "inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50";

export function UsStatePageContent({ state }: { state: UsStatePage }) {
  const isTexas = state.slug === "texas";

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: state.faqs.map((f) => ({
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
            {state.region} · {state.abbr}
          </p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
            {state.headline}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            {state.intro}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/signup" className={btnPrimary}>
              Open an account
            </Link>
            <Link href="/serving-united-states" className={btnOutlineLight}>
              All U.S. states
            </Link>
            {isTexas && (
              <Link href="/serving-texas" className={btnOutlineLight}>
                Full Texas city list
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 py-10">
        <div className="mx-auto max-w-7xl px-6">
          <ul className="grid gap-3 sm:grid-cols-3">
            {state.bullets.map((b) => (
              <li
                key={b.slice(0, 48)}
                className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-sm leading-relaxed text-slate-600"
              >
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-xl font-bold text-slate-900">
            Major cities in {state.name}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Light local pages for indexing and clarity — service area, not storefront claims.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {state.cities.map((c) => (
              <li key={c.slug}>
                <Link
                  href={c.href}
                  className="inline-block rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-teal-300"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
          {isTexas && (
            <p className="mt-4 text-sm text-slate-600">
              Texas has an expanded city directory:{" "}
              <Link href="/serving-texas" className="font-medium text-teal-700 underline">
                /serving-texas
              </Link>
              .
            </p>
          )}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-12">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-xl font-bold text-slate-900">FAQ — {state.name}</h2>
          <div className="mt-5 space-y-5">
            {state.faqs.map((f) => (
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
            <Link href="/wealth-management" className={btnOutline}>
              Wealth plans
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
