import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SitePromoFooter } from "@/components/marketing/site-promo-footer";

/** Refresh marketing pages daily so month-specific promo copy stays current */
export const revalidate = 86400;

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SitePromoFooter />
      <SiteFooter />
    </div>
  );
}
