import { Mail, Phone } from "lucide-react";
import { SITE } from "@/lib/site-config";
import { cn } from "@/lib/utils";

interface ContactHighlightProps {
  className?: string;
  compact?: boolean;
}

/** Prominent phone + email strip for marketing pages */
export function ContactHighlight({ className, compact = false }: ContactHighlightProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-teal-300 bg-gradient-to-r from-teal-50 via-emerald-50/80 to-teal-50 px-6 py-5 shadow-md shadow-teal-900/5 ring-1 ring-teal-200/60 sm:flex-row sm:gap-8",
        compact && "px-4 py-3.5 sm:gap-6",
        className
      )}
    >
      <a
        href={`tel:${SITE.phoneDisplay}`}
        className="group flex items-center gap-2.5 text-teal-900 transition-colors hover:text-teal-600"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-white shadow-sm group-hover:bg-teal-700">
          <Phone className="h-4 w-4" aria-hidden />
        </span>
        <span className={cn("font-bold tracking-tight break-all", compact ? "text-base" : "text-base sm:text-lg md:text-xl")}>
          {SITE.phone}
        </span>
      </a>

      <span className="hidden h-8 w-px bg-teal-300 sm:block" aria-hidden />

      <a
        href={`mailto:${SITE.email}`}
        className="group flex items-center gap-2.5 text-teal-900 transition-colors hover:text-teal-600"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-white shadow-sm group-hover:bg-teal-700">
          <Mail className="h-4 w-4" aria-hidden />
        </span>
        <span className={cn("font-bold tracking-tight break-all", compact ? "text-base" : "text-base sm:text-lg md:text-xl")}>
          {SITE.email}
        </span>
      </a>
    </div>
  );
}
