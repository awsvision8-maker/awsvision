import Link from "next/link";
import { BookOpen } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { SEO_GUIDES } from "@/lib/seo-guides";

export const metadata = pageMetadata("/guides");

export default function GuidesIndexPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-slate-950 to-teal-950 py-16 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <BookOpen className="h-10 w-10 text-teal-400" />
          <h1 className="mt-4 text-4xl font-bold tracking-tight">Investment guides</h1>
          <p className="mt-4 max-w-2xl text-slate-300 leading-relaxed">
            Practical guides for Texas and U.S. clients — opening accounts online, comparing
            savings vs fixed deposits, and understanding wealth plans.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-14">
        <ul className="grid gap-6 sm:grid-cols-2">
          {SEO_GUIDES.map((guide) => (
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
