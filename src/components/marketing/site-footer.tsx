import Link from "next/link";
import { Phone, MapPin, Globe, Mail } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { DeveloperCredit } from "@/components/marketing/developer-credit";
import { FOOTER_LINKS, MARYLAND_HEADQUARTERS, SITE } from "@/lib/site-data";

export function SiteFooter() {
  const columns = [
    { title: "Personal Banking", links: FOOTER_LINKS.personal },
    { title: "Non-Profit", links: FOOTER_LINKS.nonprofit },
    { title: "Business Banking", links: FOOTER_LINKS.business },
    { title: "Investing", links: FOOTER_LINKS.investing },
    { title: "Support", links: FOOTER_LINKS.support },
    { title: "Company", links: FOOTER_LINKS.company },
  ];

  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="mb-4 text-sm font-semibold text-white">{col.title}</h3>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-slate-400 hover:text-teal-400 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <div className="flex flex-col items-center justify-center gap-2 text-center text-sm sm:flex-row sm:flex-wrap sm:gap-8">
            <div className="flex flex-col items-center gap-1 sm:items-start">
              {SITE.phones.map((p) => (
                <a
                  key={p.tel}
                  href={`tel:${p.tel}`}
                  className="flex items-center gap-2 hover:text-teal-400 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  {p.display}
                </a>
              ))}
            </div>
            <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 hover:text-teal-400 transition-colors">
              <Mail className="h-4 w-4" />
              {SITE.email}
            </a>
            <Link href="/contact#branches" className="flex items-center gap-2 hover:text-teal-400 transition-colors">
              <MapPin className="h-4 w-4" />
              {SITE.address.city}, {SITE.address.state} & {MARYLAND_HEADQUARTERS.city}, {MARYLAND_HEADQUARTERS.state}
            </Link>
            <span className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {SITE.domain}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Logo size="sm" href="/" />
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
            Investment products are not FDIC insured, not bank guaranteed, and may lose value.
            Banking products and services are subject to approval. Rates and fees subject to change.
            © {new Date().getFullYear()} AWS Vision Financial. All rights reserved.
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
          <Link href="/about#privacy" className="hover:text-teal-400">Privacy</Link>
          <Link href="/about#terms" className="hover:text-teal-400">Terms of Use</Link>
          <Link href="/security" className="hover:text-teal-400">Security</Link>
          <Link href="/about#accessibility" className="hover:text-teal-400">Accessibility</Link>
          <Link href="/about#disclosures" className="hover:text-teal-400">Disclosures</Link>
        </div>
        <DeveloperCredit className="mt-6 text-center sm:text-left" />
      </div>
    </footer>
  );
}
