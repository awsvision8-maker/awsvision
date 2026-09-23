import Link from "next/link";
import { BookOpen } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { SEO_GUIDES } from "@/lib/seo-guides";

export const metadata = pageMetadata("/guides");

const COMPARE_SLUGS = new Set(
  SEO_GUIDES.filter(
    (g) =>
      g.slug.includes("vs-") ||
      g.category.toLowerCase().includes("compar") ||
      g.title.toLowerCase().includes(" vs ")
  ).map((g) => g.slug)
);

export default function GuidesIndexPage() {
  const compareGuides = SEO_GUIDES.filter((g) => COMPARE_SLUGS.has(g.slug));
  const otherGuides = SEO_GUIDES.filter((g) => !COMPARE_SLUGS.has(g.slug));

  return (
    <div>
      <section className="bg-gradient-to-br from-slate-950 to-teal-950 py-16 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <BookOpen className="h-10 w-10 text-teal-400" />
          <h1 className="mt-4 text-4xl font-bold tracking-tight">
            Investment guides for Texas &amp; the U.S.
          </h1>
          <p className="mt-4 max-w-2xl text-slate-300 leading-relaxed">
            Practical guides for opening accounts online, choosing an investment firm in Texas,
            and comparing AWS Vision with banks and traditional options.
          </p>
          <p className="mt-4 text-sm text-slate-400">
            Also:{" "}
            <Link href="/compare" className="font-medium text-teal-300 underline-offset-2 hover:underline">
              Interactive bank compare tool
            </Link>
            {" · "}
            <Link href="/serving-texas" className="font-medium text-teal-300 underline-offset-2 hover:underline">
              Serving Texas
            </Link>
            {" · "}
            <Link href="/investment-management" className="font-medium text-teal-300 underline-offset-2 hover:underline">
              Investment management
            </Link>
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-14">
        {compareGuides.length > 0 && (
          <section className="mb-14">
            <h2 className="text-2xl font-bold text-slate-900">Compare AWS Vision</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Side-by-side style guides plus our live{" "}
              <Link href="/compare" className="font-medium text-teal-700 hover:underline">
                /compare
              </Link>{" "}
              calculator for banks and investment firms.
            </p>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2">
              {compareGuides.map((guide) => (
                <li key={guide.slug}>
                  <Link
                    href={`/guides/${guide.slug}`}
                    className="block h-full rounded-2xl border border-amber-200 bg-amber-50/40 p-6 transition hover:border-amber-300 hover:bg-amber-50"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                      {guide.category} · {guide.readTime}
                    </span>
                    <h3 className="mt-2 text-lg font-semibold text-slate-900">{guide.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{guide.description}</p>
                    <span className="mt-4 inline-block text-sm font-semibold text-amber-800">
                      Read guide →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h2 className="text-2xl font-bold text-slate-900">All guides</h2>
          <ul className="mt-6 grid gap-6 sm:grid-cols-2">
            {otherGuides.map((guide) => (
              <li key={guide.slug}>
                <Link
                  href={`/guides/${guide.slug}`}
                  className="block h-full rounded-2xl border border-slate-200 p-6 transition hover:border-teal-300 hover:bg-teal-50/40"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-teal-700">
                    {guide.category} · {guide.readTime}
                  </span>
                  <h2 className="mt-2 text-lg font-semibold text-slate-900">{guide.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{guide.description}</p>
                  <span className="mt-4 inline-block text-sm font-semibold text-teal-700">
                    Read guide →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-12 text-center text-sm text-slate-500">
          Also see{" "}
          <Link href="/financial-education" className="font-medium text-teal-700 hover:underline">
            Financial Education
          </Link>
          ,{" "}
          <Link href="/serving-texas" className="font-medium text-teal-700 hover:underline">
            Serving Texas
          </Link>
          , and{" "}
          <Link href="/faq" className="font-medium text-teal-700 hover:underline">
            FAQ
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
