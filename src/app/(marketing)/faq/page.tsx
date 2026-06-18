import Link from "next/link";
import { FAQ_CATEGORIES } from "@/lib/boa-content";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site-config";
import { pageMetadata } from "@/lib/seo";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";

export const metadata = pageMetadata("/faq");

export default function FAQPage() {
  return (
    <div>
      <FaqJsonLd />
      <section className="bg-gradient-to-br from-slate-950 to-teal-950 py-16 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            Find answers about accounts, investments, loans, credit cards, and security.
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-4xl px-6 py-16 space-y-12">
        {FAQ_CATEGORIES.map((cat) => (
          <section key={cat.title}>
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-3">{cat.title}</h2>
            <div className="mt-6 space-y-6">
              {cat.items.map((item) => (
                <div key={item.q}>
                  <h3 className="font-semibold text-slate-900">{item.q}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </section>
        ))}
        <div className="rounded-xl bg-slate-50 p-8 text-center">
          <p className="text-slate-600">Still have questions?</p>
          <p className="mt-2 text-sm">
            Call{" "}
            {SITE.phones.map((p, i) => (
              <span key={p.tel}>
                {i > 0 ? " or " : ""}
                <a href={`tel:${p.tel}`} className="text-teal-700 font-medium">{p.display}</a>
              </span>
            ))}
            {" or email "}
            <a href={`mailto:${SITE.email}`} className="text-teal-700 font-medium">{SITE.email}</a>
          </p>
          <Link href="/contact" className="mt-4 inline-block">
            <Button>Contact Us</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
