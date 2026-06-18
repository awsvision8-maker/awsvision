"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronDown,
  Menu,
  Phone,
  X,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PromoTopBar } from "@/components/marketing/promo-top-bar";
import { SiteSearchButton } from "@/components/marketing/site-search";
import { Logo } from "@/components/ui/logo";
import { MAIN_NAV, SITE, formatSitePhones } from "@/lib/site-data";
import { cn } from "@/lib/utils";

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

export function SiteHeader() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <PromoTopBar />
      {/* Utility bar */}
      <div className="hidden border-b border-slate-100 bg-slate-50 lg:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-6 text-xs text-slate-600">
          <div className="flex items-center gap-6">
            <Link href="/news" className="hover:text-teal-700 transition-colors">
              News
            </Link>
            <Link href="/faq" className="hover:text-teal-700 transition-colors">
              FAQ
            </Link>
            <Link href="/contact" className="flex items-center gap-1 hover:text-teal-700 transition-colors">
              <MapPin className="h-3 w-3" />
              Contact
            </Link>
            <Link href="/financial-education" className="hover:text-teal-700 transition-colors">
              Financial Education
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <a href={`tel:${SITE.phoneDisplay}`} className="flex items-center gap-1 hover:text-teal-700">
              <Phone className="h-3 w-3" />
              {formatSitePhones(" · ")}
            </a>
            <span className="text-slate-300">|</span>
            <Link href="/rates" className="hover:text-teal-700">Rates</Link>
            <Link href="/help" className="hover:text-teal-700">Help Center</Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="border-b border-slate-200">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6">
          <Logo size="md" priority className="h-11" href="/" />

          <nav className="hidden items-center lg:flex">
            {MAIN_NAV.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setActiveMenu(item.label)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 px-4 py-5 text-sm font-medium transition-colors",
                    activeMenu === item.label
                      ? "text-teal-700"
                      : "text-slate-700 hover:text-teal-700"
                  )}
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5" />
                </Link>

                {activeMenu === item.label && (
                  <div className="absolute left-0 top-full z-50 w-[min(520px,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] rounded-b-xl border border-slate-200 bg-white p-4 shadow-xl sm:p-6">
                    <div className="grid grid-cols-2 gap-6">
                      {item.sections.map((section) => (
                        <div key={section.title}>
                          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            {section.title}
                          </p>
                          <ul className="space-y-2">
                            {section.links.map((link) => (
                              <li key={link.href + link.label}>
                                {isExternalHref(link.href) ? (
                                  <a
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group block rounded-lg p-2 hover:bg-slate-50 transition-colors"
                                  >
                                    <p className="text-sm font-medium text-slate-900 group-hover:text-teal-700">
                                      {link.label}
                                    </p>
                                    <p className="text-xs text-slate-500">{link.desc}</p>
                                  </a>
                                ) : (
                                  <Link
                                    href={link.href}
                                    className="group block rounded-lg p-2 hover:bg-slate-50 transition-colors"
                                  >
                                    <p className="text-sm font-medium text-slate-900 group-hover:text-teal-700">
                                      {link.label}
                                    </p>
                                    <p className="text-xs text-slate-500">{link.desc}</p>
                                  </Link>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <Link
              href="/rates"
              className="px-4 py-5 text-sm font-medium text-slate-700 hover:text-teal-700 transition-colors"
            >
              Rates
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <SiteSearchButton className="hidden md:flex" />
            <Link href="/login" className="shrink-0">
              <Button variant="outline" size="sm" className="border-teal-700 px-2.5 text-xs text-teal-700 hover:bg-teal-50 sm:px-3 sm:text-sm">
                Sign In
              </Button>
            </Link>
            <Link href="/signup" className="hidden shrink-0 sm:block">
              <Button size="sm">Open Account</Button>
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-lg p-2 text-slate-700 lg:hidden cursor-pointer"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-b border-slate-200 bg-white lg:hidden max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-4 space-y-1">
            {MAIN_NAV.map((item) => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                >
                  {item.label}
                </Link>
                {item.sections.flatMap((s) => s.links).map((link) =>
                  isExternalHref(link.href) ? (
                    <a
                      key={link.href + link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-lg px-6 py-2 text-sm text-slate-600 hover:bg-slate-50"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.href + link.label}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-lg px-6 py-2 text-sm text-slate-600 hover:bg-slate-50"
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </div>
            ))}
            <Link href="/rates" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50">
              Rates
            </Link>
            <Link href="/help" onClick={() => setMobileOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-50">
              Search & Help
            </Link>
            {SITE.phones.map((p) => (
              <a
                key={p.tel}
                href={`tel:${p.tel}`}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                <Phone className="h-4 w-4 text-teal-600" />
                {p.display}
              </a>
            ))}
            <div className="flex gap-2 pt-4 border-t border-slate-100">
              <Link href="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full" size="sm">Sign In</Button>
              </Link>
              <Link href="/signup" className="flex-1" onClick={() => setMobileOpen(false)}>
                <Button className="w-full" size="sm">Open Account</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
