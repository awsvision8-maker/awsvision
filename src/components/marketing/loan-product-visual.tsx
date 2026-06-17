import Image from "next/image";
import { cn } from "@/lib/utils";
import type { LoanProduct } from "@/lib/loans-data";

interface LoanProductVisualProps {
  product: LoanProduct;
  className?: string;
  comingSoon?: boolean;
  compact?: boolean;
}

export function LoanProductVisual({
  product,
  className,
  comingSoon = true,
  compact = false,
}: LoanProductVisualProps) {
  const Icon = product.icon;

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10",
        compact ? "max-w-[300px] aspect-[1.586/1]" : "max-w-[380px] aspect-[1.586/1]",
        className
      )}
      style={{ background: product.gradient }}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-white/5" />

      <div className="relative flex h-full flex-col justify-between p-5 sm:p-6">
        <div className="flex items-start justify-between gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
            <Icon className="h-5 w-5 text-white" strokeWidth={2} />
          </div>
          <div className="rounded-lg bg-white/95 px-2 py-1 shadow-md">
            <Image
              src="/logo.png"
              alt="AWS Vision"
              width={100}
              height={40}
              className={cn("w-auto object-contain", compact ? "h-6" : "h-8")}
            />
          </div>
        </div>

        <div>
          <p className={cn("font-bold text-white leading-tight", compact ? "text-sm" : "text-base")}>
            {product.shortName}
          </p>
          <p className={cn("mt-1 text-white/70", compact ? "text-[10px]" : "text-xs")}>
            {product.tagline}
          </p>
          <div className="mt-3 flex items-end justify-between gap-2">
            <p
              className={cn("font-semibold", compact ? "text-[10px]" : "text-xs")}
              style={{ color: product.accent }}
            >
              {product.rateLabel}
            </p>
            <p className="text-[9px] font-bold uppercase tracking-widest text-white/50">
              AWS Vision Lending
            </p>
          </div>
        </div>
      </div>

      {comingSoon && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/35 backdrop-blur-[1px]">
          <span className="rounded-full bg-teal-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg ring-2 ring-white/20 sm:text-xs">
            Launching Soon
          </span>
        </div>
      )}
    </div>
  );
}
