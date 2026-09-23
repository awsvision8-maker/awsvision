import Link from "next/link";
import type { SeoGuide } from "@/lib/seo-guides";
import { SeoRelatedLinks } from "@/components/seo/seo-related-links";
import { guideArticleJsonLd, guideFaqJsonLd } from "@/lib/seo";

export function SeoGuideArticle({ guide }: { guide: SeoGuide }) {
  const articleLd = guideArticleJsonLd(guide);
  const faqLd = guideFaqJsonLd(guide);

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      {faqLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      ) : null}

      <header className="bg-gradient-to-br from-slate-950 to-teal-950 py-14 text-white">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-300">
            {guide.category} · {guide.readTime} read
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{guide.title}</h1>
          <p className="mt-4 text-base leading-relaxed text-slate-300">{guide.description}</p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="space-y-10">
          {guide.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-bold text-slate-900">{section.heading}</h2>
              {section.body.map((p) => (
                <p key={p.slice(0, 40)} className="mt-3 text-base leading-relaxed text-slate-600">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        <aside className="mt-12 rounded-2xl border border-teal-200 bg-teal-50/60 p-6">
          <h2 className="text-lg font-semibold text-slate-900">Related</h2>
          <ul className="mt-3 space-y-2">
            {guide.related.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="text-sm font-medium text-teal-800 hover:underline">
                  {r.label} →
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <p className="mt-10 text-center">
          <Link
            href="/signup"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-teal-700 px-5 text-sm font-semibold text-white hover:bg-teal-800"
          >
            Get started
          </Link>
        </p>
      </div>

      <SeoRelatedLinks title="More Texas investment resources" />
    </article>
  );
}
