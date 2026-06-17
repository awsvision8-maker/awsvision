import Image from "next/image";
import { Wifi } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CreditCardProduct } from "@/lib/credit-cards-data";

interface CreditCardVisualProps {
  card: CreditCardProduct;
  className?: string;
  comingSoon?: boolean;
  compact?: boolean;
}

export function CreditCardVisual({
  card,
  className,
  comingSoon = true,
  compact = false,
}: CreditCardVisualProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10",
        compact ? "max-w-[300px] aspect-[1.586/1]" : "max-w-[380px] aspect-[1.586/1]",
        className
      )}
      style={{ background: card.gradient }}
    >
      {/* Decorative shapes */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-white/5" />
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(255,255,255,0.03) 8px, rgba(255,255,255,0.03) 16px)",
        }}
      />

      <div className="relative flex h-full flex-col justify-between p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* EMV chip */}
            <div className="h-8 w-11 shrink-0 rounded-md bg-gradient-to-br from-amber-100 via-amber-300 to-amber-500 shadow-inner sm:h-9 sm:w-12" />
            <Wifi className="h-5 w-5 rotate-90 text-white/70" strokeWidth={2} />
          </div>

          {/* AWS Vision logo */}
          <div className="rounded-lg bg-white/95 px-2 py-1 shadow-md backdrop-blur-sm">
            <Image
              src="/logo.png"
              alt="AWS Vision"
              width={120}
              height={48}
              className={cn("w-auto object-contain", compact ? "h-7" : "h-9 sm:h-10")}
            />
          </div>
        </div>

        <div>
          <p
            className={cn(
              "font-mono tracking-[0.2em] text-white/90",
              compact ? "text-sm" : "text-base sm:text-lg"
            )}
          >
            •••• •••• •••• 4829
          </p>
          <div className="mt-3 flex items-end justify-between gap-2">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/50">Card Member</p>
              <p className={cn("font-semibold text-white", compact ? "text-xs" : "text-sm")}>
                {card.shortName}
              </p>
            </div>
            <div className="text-right">
              <p
                className={cn(
                  "font-black italic tracking-tight text-white",
                  compact ? "text-lg" : "text-xl"
                )}
                style={{ color: card.accent }}
              >
                VISA
              </p>
              {card.tier === "premium" && (
                <p className="text-[9px] font-medium uppercase tracking-widest text-white/60">
                  Signature
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {comingSoon && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/35 backdrop-blur-[1px]">
          <span className="rounded-full bg-teal-600 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-lg ring-2 ring-white/20 sm:text-sm">
            Launching Soon
          </span>
        </div>
      )}
    </div>
  );
}
