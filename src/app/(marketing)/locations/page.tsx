import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { TEXAS_CITIES } from "@/lib/texas-cities";
import { US_STATES } from "@/lib/us-locations";
import { SeoRelatedLinks } from "@/components/seo/seo-related-links";

export const metadata = pageMetadata("/locations");

export default function LocationsPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-slate-950 to-teal-950 py-16 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">
            Service areas
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Locations we serve — Texas cities &amp; all 50 U.S. states
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-300 leading-relaxed">
            AWS Vision Financial is an online investment firm. These pages describe service-area
            coverage — not a list of retail storefronts. Sitemap includes Texas city pages plus
            state and major-city pages nationwide.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-2xl font-bold text-slate-900">Texas cities</h2>
            <Link href="/serving-texas" className="text-sm font-semibold text-teal-700 hover:underline">
              Full Texas directory →
            </Link>
          </div>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TEXAS_CITIES.filter((c) => !c.light)
              .slice(0, 12)
              .map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/serving-texas/${c.slug}`}
                    className="block rounded-2xl border border-slate-200 p-5 transition hover:border-teal-300 hover:bg-teal-50/40"
                  >
                    <h3 className="text-lg font-semibold text-slate-900">{c.name}</h3>
                    <p className="mt-1 text-sm text-slate-600">{c.metro}</p>
                    <span className="mt-3 inline-block text-sm font-semibold text-teal-700">
                      Open {c.name} page →
                    </span>
                  </Link>
                </li>
              ))}
          </ul>
          <p className="mt-4 text-sm text-slate-600">
            Plus light pages for additional Texas metros — see{" "}
            <Link href="/serving-texas" className="font-medium text-teal-700 underline">
              /serving-texas
            </Link>{" "}
            ({TEXAS_CITIES.length} cities).
          </p>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-2xl font-bold text-slate-900">All 50 U.S. states</h2>
            <Link
              href="/serving-united-states"
              className="text-sm font-semibold text-teal-700 hover:underline"
            >
              Nationwide hub →
            </Link>
          </div>
          <p className="mt-2 max-w-2xl text-slate-600">
            Each state page links to major cities. Texas city deep-links stay on /serving-texas.
          </p>
          <ul className="mt-6 grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {US_STATES.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/serving-united-states/${s.slug}`}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 transition hover:border-teal-300"
                >
                  <span>{s.name}</span>
                  <span className="text-xs text-slate-400">{s.abbr}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <SeoRelatedLinks title="Services & guides" />
    </div>
  );
}
