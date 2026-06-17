import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EDUCATION_ARTICLES } from "@/lib/site-data";

export default function FinancialEducationPage() {
  const categories = ["All", "Investing", "Savings", "Credit", "Home", "Business", "Security", "Retirement"];

  return (
    <div>
      <section className="bg-gradient-to-br from-slate-950 to-teal-950 py-16 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <BookOpen className="h-12 w-12 text-teal-400" />
          <h1 className="mt-4 text-4xl font-bold">Better Money Habits®</h1>
          <p className="mt-4 max-w-2xl text-slate-300 leading-relaxed">
            Free financial education from AWS Vision — articles, videos, and tools to help you
            save more, manage debt, build credit, buy a home, plan for retirement, and grow your
            investments with confidence.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                cat === "All"
                  ? "bg-teal-700 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {EDUCATION_ARTICLES.map((article) => (
            <article
              key={article.title}
              className="group rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700">
                {article.category}
              </span>
              <h2 className="mt-3 text-lg font-semibold text-slate-900 group-hover:text-teal-700">
                {article.title}
              </h2>
              {"desc" in article && (
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{article.desc}</p>
              )}
              <p className="mt-2 text-xs text-slate-400">{article.readTime} read</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-teal-600">
                Read article <ArrowRight className="h-4 w-4" />
              </span>
            </article>
          ))}
        </div>

        <div className="mt-16 rounded-xl bg-slate-950 p-8 text-white text-center">
          <h2 className="text-2xl font-bold">Better Money Habits®</h2>
          <p className="mt-2 text-slate-400 max-w-xl mx-auto leading-relaxed">
            Powered by AWS Vision — the same program trusted by millions to build financial
            confidence at every life stage, from first paycheck to retirement.
          </p>
          <Link href="/signup" className="mt-6 inline-block">
            <Button size="lg">Get Started with AWS Vision</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
