"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { FileText, HelpCircle, Newspaper, Search, X } from "lucide-react";
import { searchSite } from "@/lib/search";
import type { SearchResult, SearchResultType } from "@/lib/search-index";
import { cn } from "@/lib/utils";

const TYPE_LABELS: Record<SearchResultType, string> = {
  page: "Page",
  faq: "FAQ",
  nav: "Service",
  news: "News",
};

const TYPE_ICONS: Record<SearchResultType, typeof Search> = {
  page: Search,
  faq: HelpCircle,
  nav: FileText,
  news: Newspaper,
};

function ResultItem({
  result,
  active,
  onSelect,
}: {
  result: SearchResult;
  active: boolean;
  onSelect: () => void;
}) {
  const Icon = TYPE_ICONS[result.type];
  return (
    <Link
      href={result.href}
      onClick={onSelect}
      className={cn(
        "flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors",
        active ? "bg-teal-50 text-teal-900" : "hover:bg-slate-50"
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-900">{result.title}</p>
        <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{result.description}</p>
        <span className="mt-1 inline-block text-[10px] font-medium uppercase tracking-wide text-slate-400">
          {TYPE_LABELS[result.type]}
        </span>
      </div>
    </Link>
  );
}

export function SiteSearchDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const results = searchSite(query, 8);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const goToHelp = useCallback(() => {
    const q = query.trim();
    if (!q) return;
    onClose();
    router.push(`/help?q=${encodeURIComponent(q)}`);
  }, [query, onClose, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results[activeIndex]) {
      onClose();
      router.push(results[activeIndex].href);
      return;
    }
    goToHelp();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-[12vh] sm:pt-[15vh]">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        aria-label="Close search"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200">
        <form onSubmit={handleSubmit} className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
          <Search className="h-5 w-5 shrink-0 text-slate-400" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search accounts, loans, investing, help…"
            className="flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            autoComplete="off"
            aria-label="Search site"
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </form>

        <div className="max-h-[50vh] overflow-y-auto p-2">
          {query.trim() && results.length === 0 && (
            <div className="px-3 py-8 text-center">
              <p className="text-sm text-slate-600">No results for &ldquo;{query}&rdquo;</p>
              <button
                type="button"
                onClick={goToHelp}
                className="mt-3 text-sm font-medium text-teal-700 hover:underline"
              >
                Search Help Center
              </button>
            </div>
          )}

          {!query.trim() && (
            <div className="px-3 py-6 text-center text-sm text-slate-500">
              Try &ldquo;savings&rdquo;, &ldquo;withdrawal&rdquo;, &ldquo;fixed deposit&rdquo;, or &ldquo;online banking&rdquo;
            </div>
          )}

          {results.map((result, index) => (
            <ResultItem
              key={`${result.href}-${result.title}`}
              result={result}
              active={index === activeIndex}
              onSelect={onClose}
            />
          ))}
        </div>

        {query.trim() && results.length > 0 && (
          <div className="border-t border-slate-100 px-4 py-2.5 text-center">
            <button
              type="button"
              onClick={goToHelp}
              className="text-xs font-medium text-teal-700 hover:underline"
            >
              View all results for &ldquo;{query}&rdquo;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function SiteSearchButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "rounded-lg p-2 text-slate-500 hover:bg-slate-100 cursor-pointer",
          className
        )}
        aria-label="Search"
      >
        <Search className="h-5 w-5" />
      </button>
      <SiteSearchDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
