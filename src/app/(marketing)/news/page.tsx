import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NEWS_ARTICLES } from "@/lib/boa-content";
import { Button } from "@/components/ui/button";
import { NewsJsonLd } from "@/components/seo/news-json-ld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/news");

export default function NewsPage() {
  return (
    <div>
      <NewsJsonLd />
      <section className="bg-gradient-to-br from-slate-950 to-teal-950 py-16 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="text-4xl font-bold">News & Updates</h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            Performance reports, product launches, and media coverage from AWS Vision.
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-4xl px-6 py-16 space-y-10">
        {NEWS_ARTICLES.map((article) => (
          <article key={article.id} id={article.id} className="border-b border-slate-200 pb-10 last:border-0">
            <p className="text-sm text-teal-600 font-medium">{article.date}</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">{article.title}</h2>
            <p className="mt-3 text-slate-600 leading-relaxed">{article.excerpt}</p>
            <p className="mt-4 text-sm text-slate-500 leading-relaxed">{article.body}</p>
          </article>
        ))}
        <div className="rounded-xl bg-teal-50 p-8 text-center">
          <h3 className="font-bold text-slate-900">Sign up for our newsletter</h3>
          <p className="mt-2 text-sm text-slate-600">Market insights and performance updates. We never share your data.</p>
          <Link href="/contact" className="mt-4 inline-block">
            <Button>Subscribe</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
