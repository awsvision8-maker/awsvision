import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { TEXAS_CITIES } from "@/lib/texas-cities";
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
            Locations we serve — Texas cities &amp; nationwide U.S.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-300 leading-relaxed">
            AWS Vision Financial is an online investment firm. These pages describe service-area
            coverage — not a list of retail storefronts.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-2xl font-bold text-slate-900">Texas cities</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TEXAS_CITIES.map((c) => (
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
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/serving-texas" className="font-semibold text-teal-700 hover:underline">
              All Texas coverage →
            </Link>
            <Link href="/serving-united-states" className="font-semibold text-teal-700 hover:underline">
              Nationwide U.S. →
            </Link>
          </div>
        </div>
      </section>

      <SeoRelatedLinks title="Services & guides" />
    </div>
  );
}
