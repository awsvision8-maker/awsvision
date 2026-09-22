import Link from "next/link";
import type { ServiceHub } from "@/lib/service-hubs";

const btnPrimary =
  "inline-flex h-11 items-center justify-center rounded-lg bg-teal-500 px-5 text-sm font-semibold text-slate-950 transition hover:bg-teal-400";
const btnOutlineLight =
  "inline-flex h-11 items-center justify-center rounded-lg border border-white/30 px-5 text-sm font-semibold text-white transition hover:bg-white/10";
const btnTeal =
  "inline-flex h-11 items-center justify-center rounded-lg bg-teal-700 px-5 text-sm font-semibold text-white transition hover:bg-teal-800";

export function ServiceHubPage({ hub }: { hub: ServiceHub }) {
  return (
    <div>
      {hub.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: hub.faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            }),
          }}
        />
      )}

      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">{hub.eyebrow}</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">{hub.h1}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-300">{hub.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/signup" className={btnPrimary}>
              Open an account
            </Link>
            <Link href="/rates" className={btnOutlineLight}>
              View rates
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-3xl space-y-10 px-6">
          {hub.sections.map((s) => (
            <div key={s.heading}>
              <h2 className="text-xl font-bold text-slate-900">{s.heading}</h2>
              {s.body.map((p) => (
                <p key={p.slice(0, 48)} className="mt-3 text-base leading-relaxed text-slate-600">
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>

      {hub.faqs.length > 0 && (
        <section className="border-t border-slate-200 bg-slate-50 py-14">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-2xl font-bold text-slate-900">FAQ</h2>
            <div className="mt-6 space-y-5">
              {hub.faqs.map((f) => (
                <div key={f.q}>
                  <h3 className="font-semibold text-slate-900">{f.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-lg font-semibold text-slate-900">Explore related</h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {hub.related.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-teal-300"
                >
                  {r.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/serving-texas/dallas"
                className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-teal-300"
              >
                Dallas
              </Link>
            </li>
            <li>
              <Link
                href="/serving-texas/houston"
                className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-teal-300"
              >
                Houston
              </Link>
            </li>
          </ul>
          <div className="mt-8">
            <Link href="/signup" className={btnTeal}>
              Get started
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
