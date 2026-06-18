import Image from "next/image";
import { cn } from "@/lib/utils";
import type { LoanProduct } from "@/lib/loans-data";

interface LoanProductVisualProps {
  product: LoanProduct;
  className?: string;
  comingSoon?: boolean;
  compact?: boolean;
  /** Uniform thumbnail for the product grid */
  glance?: boolean;
  /** Sized for side-by-side use inside product cards */
  embedded?: boolean;
}

export function LoanProductVisual({
  product,
  className,
  comingSoon = true,
  compact = false,
  glance = false,
  embedded = false,
}: LoanProductVisualProps) {
  const Icon = product.icon;

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/10",
        glance
          ? "h-[126px] w-[200px] shadow-lg"
          : embedded
            ? "aspect-[1.586/1] w-full shadow-md"
            : compact
              ? "h-[126px] w-[200px] shadow-lg"
              : "aspect-[1.586/1] w-[320px] max-w-full shadow-xl",
        className
      )}
      style={{ background: product.gradient }}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-white/5" />

      <div
        className={cn(
          "relative flex h-full min-h-0 flex-col justify-between",
          glance ? "p-3" : embedded ? "p-4" : compact ? "p-3" : "p-5 sm:p-6"
        )}
      >
        <div className="flex items-start justify-between gap-1.5">
          <div
            className={cn(
              "flex shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm",
              glance || embedded || compact ? "h-7 w-7" : "h-10 w-10"
            )}
          >
            <Icon
              className={cn("text-white", glance || embedded || compact ? "h-3.5 w-3.5" : "h-5 w-5")}
              strokeWidth={2}
            />
          </div>
          <div className="shrink-0 rounded-md bg-white/95 px-1 py-0.5 shadow-sm">
            <Image
              src="/logo.png"
              alt="AWS Vision"
              width={100}
              height={40}
              className={cn(
                "w-auto object-contain",
                glance ? "h-4" : embedded ? "h-5" : compact ? "h-5" : "h-8"
              )}
            />
          </div>
        </div>

        <div className="min-h-0">
          <p
            className={cn(
              "truncate font-bold text-white leading-tight",
              glance ? "text-[11px]" : embedded ? "text-xs" : compact ? "text-xs" : "text-base"
            )}
          >
            {product.shortName}
          </p>
          {!embedded && !glance && (
            <p className={cn("mt-0.5 line-clamp-1 text-white/70", compact ? "text-[9px]" : "text-xs")}>
              {product.tagline}
            </p>
          )}
          <div className={cn("flex items-end justify-between gap-1", glance ? "mt-1" : embedded ? "mt-2" : "mt-2")}>
            {!embedded && !glance && (
              <p
                className={cn("line-clamp-1 font-semibold", compact ? "text-[9px]" : "text-xs")}
                style={{ color: product.accent }}
              >
                {product.rateLabel}
              </p>
            )}
            <p
              className={cn(
                "shrink-0 font-bold uppercase tracking-widest text-white/50",
                glance ? "ml-auto text-[7px]" : embedded ? "ml-auto text-[8px]" : "text-[8px]"
              )}
            >
              AWS Vision Lending
            </p>
          </div>
        </div>
      </div>

      {comingSoon && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/35 backdrop-blur-[1px]">
          <span
            className={cn(
              "rounded-full bg-teal-600 font-bold uppercase tracking-wide text-white shadow-lg ring-2 ring-white/20",
              glance
                ? "px-2 py-0.5 text-[8px]"
                : embedded
                  ? "px-2 py-1 text-[9px]"
                  : "px-3 py-1.5 text-[10px] sm:text-xs"
            )}
          >
            Launching Soon
          </span>
        </div>
      )}
    </div>
  );
}
