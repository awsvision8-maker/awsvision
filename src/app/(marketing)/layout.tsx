import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SitePromoFooter } from "@/components/marketing/site-promo-footer";
import { LiveChatWidget } from "@/components/chat/live-chat-widget";
import { MarketingJsonLd } from "@/components/seo/json-ld";
import { PageJsonLd } from "@/components/seo/page-json-ld";

/** Refresh marketing pages daily so month-specific promo copy stays current */
export const revalidate = 86400;

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white">
      <MarketingJsonLd />
      <PageJsonLd />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SitePromoFooter />
      <SiteFooter />
      <LiveChatWidget />
    </div>
  );
}
