"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { FileText, HelpCircle, Newspaper, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { searchSite } from "@/lib/search";
import type { SearchResultType } from "@/lib/search-index";

const TYPE_LABELS: Record<SearchResultType, string> = {
  page: "Page",
  faq: "FAQ",
  nav: "Service",
  news: "News",
};

export function HelpSearchSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const results = searchSite(initialQuery, 30);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/help?q=${encodeURIComponent(q)}` : "/help");
  };

  return (
    <div className="border-b border-white/10 bg-white/5">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search help, accounts, loans, investing…"
              className="h-12 w-full rounded-xl border border-white/20 bg-white/10 pl-12 pr-4 text-sm text-white placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/30"
            />
          </div>
          <Button type="submit" className="h-12 shrink-0 bg-teal-600 hover:bg-teal-500">
            Search
          </Button>
        </form>
      </div>

      {initialQuery.trim() && (
        <div className="mx-auto max-w-7xl px-6 pb-8">
          <p className="text-sm text-slate-300">
            {results.length > 0
              ? `${results.length} result${results.length === 1 ? "" : "s"} for “${initialQuery}”`
              : `No results for “${initialQuery}”`}
          </p>
          {results.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {results.map((result) => (
                <li key={`${result.href}-${result.title}`}>
                  <Link
                    href={result.href}
                    className="block rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
                  >
                    <div className="flex items-start gap-3">
                      {result.type === "faq" ? (
                        <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-teal-400" />
                      ) : result.type === "news" ? (
                        <Newspaper className="mt-0.5 h-5 w-5 shrink-0 text-teal-400" />
                      ) : (
                        <FileText className="mt-0.5 h-5 w-5 shrink-0 text-teal-400" />
                      )}
                      <div>
                        <p className="font-medium text-white">{result.title}</p>
                        <p className="mt-1 text-sm text-slate-300 line-clamp-2">{result.description}</p>
                        <span className="mt-2 inline-block text-xs uppercase tracking-wide text-teal-300/80">
                          {TYPE_LABELS[result.type]}
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300">
              <p>Try different keywords or browse the topics below.</p>
              <Link href="/contact" className="mt-3 inline-block font-medium text-teal-300 hover:underline">
                Contact support →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
