"use client";

import { usePathname } from "next/navigation";
import { WealthPromoBanner } from "@/components/marketing/wealth-promo-banner";

/** Site-wide wealth promo before footer — skips homepage (has full hero mid-page) */
export function SitePromoFooter() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <WealthPromoBanner variant="compact" />;
}
