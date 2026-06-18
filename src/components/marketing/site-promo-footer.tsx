"use client";

import { usePathname } from "next/navigation";
import { AmbassadorJoinBanner } from "@/components/marketing/ambassador-join-banner";
import { WealthPromoBanner } from "@/components/marketing/wealth-promo-banner";

/** Site-wide pre-footer promos — skips homepage wealth compact (has hero mid-page) */
export function SitePromoFooter() {
  const pathname = usePathname();
  const hideWealth = pathname === "/" || pathname === "/referral-program";
  return (
    <>
      {pathname !== "/referral-program" && <AmbassadorJoinBanner />}
      {!hideWealth && <WealthPromoBanner variant="compact" />}
    </>
  );
}
