import Link from "next/link";
import { ArrowRight, Headphones } from "lucide-react";
import { CONNECT_LINKS } from "@/lib/boa-content";
import { ContactHighlight } from "@/components/marketing/contact-highlight";
import { cn } from "@/lib/utils";

export function ConnectWithUsSection() {
  return (
    <section className="relative overflow-hidden border-t border-slate-200 bg-gradient-to-b from-slate-50 via-white to-slate-50 py-16 lg:py-20">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 10% 20%, rgba(13,148,136,0.08) 0%, transparent 45%), radial-gradient(circle at 90% 80%, rgba(14,165,233,0.06) 0%, transparent 40%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-teal-800">
            <Headphones className="h-3.5 w-3.5" aria-hidden />
            Client Support
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Connect with us
          </h2>
          <p className="mt-3 text-slate-600 leading-relaxed">
            Speak with a relationship manager, visit a location, or get answers through our help
            center — we&apos;re here when you need us.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {CONNECT_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "group relative flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
                  link.accent
                )}
              >
                <div
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-xl text-white shadow-md transition-transform duration-300 group-hover:scale-105",
                    link.iconBg
                  )}
                >
                  <Icon className="h-7 w-7" strokeWidth={1.75} aria-hidden />
                </div>

                <h3 className="mt-5 text-base font-bold text-slate-900 group-hover:text-teal-800 leading-snug">
                  {link.label}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">
                  {link.desc}
                </p>

                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-teal-700 transition-colors group-hover:text-teal-800">
                  Learn more
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 mx-auto max-w-5xl">
          <p className="mb-4 text-center text-sm font-medium text-slate-600">
            Prefer to reach us directly?
          </p>
          <ContactHighlight />
        </div>
      </div>
    </section>
  );
}
