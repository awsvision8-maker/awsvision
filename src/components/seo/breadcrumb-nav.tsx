"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { breadcrumbsForPath } from "@/lib/seo-breadcrumbs";

/** Visible breadcrumb trail (pairs with BreadcrumbList JSON-LD) */
export function BreadcrumbNav() {
  const pathname = usePathname() || "/";
  const crumbs = breadcrumbsForPath(pathname);
  if (crumbs.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="border-b border-slate-100 bg-slate-50/80">
      <ol className="mx-auto flex max-w-7xl flex-wrap items-center gap-1 px-4 py-2.5 text-xs text-slate-500 sm:px-6">
        {crumbs.map((crumb, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={crumb.path} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3 w-3 shrink-0 text-slate-300" aria-hidden />}
              {last ? (
                <span className="font-medium text-slate-700" aria-current="page">
                  {crumb.name}
                </span>
              ) : (
                <Link href={crumb.path} className="hover:text-teal-700 hover:underline">
                  {crumb.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
