import { Mail, Phone } from "lucide-react";
import { SITE } from "@/lib/site-config";
import { cn } from "@/lib/utils";

interface ContactHighlightProps {
  className?: string;
  compact?: boolean;
}

/** Prominent phone + email strip for marketing pages */
export function ContactHighlight({ className, compact = false }: ContactHighlightProps) {
  const textClass = cn(
    "font-bold tracking-tight whitespace-nowrap",
    compact ? "text-base" : "text-base sm:text-lg"
  );

  const contactItems = [
    ...SITE.phones.map((p) => ({
      key: p.tel,
      href: `tel:${p.tel}`,
      label: p.display,
      icon: Phone,
    })),
    {
      key: SITE.email,
      href: `mailto:${SITE.email}`,
      label: SITE.email,
      icon: Mail,
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-3 rounded-2xl border-2 border-teal-300 bg-gradient-to-r from-teal-50 via-emerald-50/80 to-teal-50 px-4 py-4 shadow-md shadow-teal-900/5 ring-1 ring-teal-200/60 sm:flex-nowrap sm:gap-0 sm:px-6 sm:py-5",
        compact && "px-4 py-3.5",
        className
      )}
    >
      {contactItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div key={item.key} className="flex items-center sm:gap-6">
            {index > 0 && (
              <span className="mx-3 hidden h-8 w-px shrink-0 bg-teal-300 sm:mx-6 sm:block" aria-hidden />
            )}
            <a
              href={item.href}
              className="group flex items-center gap-2.5 text-teal-900 transition-colors hover:text-teal-600"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white shadow-sm group-hover:bg-teal-700">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <span className={textClass}>{item.label}</span>
            </a>
          </div>
        );
      })}
    </div>
  );
}
