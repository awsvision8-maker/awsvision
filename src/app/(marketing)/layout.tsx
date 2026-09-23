import { Suspense } from "react";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SitePromoFooter } from "@/components/marketing/site-promo-footer";
import { LiveChatWidget } from "@/components/chat/live-chat-widget";
import { MarketingJsonLd } from "@/components/seo/json-ld";
import { PageJsonLd } from "@/components/seo/page-json-ld";
import { BreadcrumbNav } from "@/components/seo/breadcrumb-nav";
import { SiteVisitorTracker } from "@/components/analytics/site-visitor-tracker";
import { ContentProtection } from "@/components/security/content-protection";

/** Refresh marketing pages daily so month-specific promo copy stays current */
export const revalidate = 86400;

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="content-protected flex min-h-screen flex-col overflow-x-hidden bg-white">
      <ContentProtection />
      <MarketingJsonLd />
      <PageJsonLd />
      <SiteHeader />
      <BreadcrumbNav />
      <main className="flex-1">{children}</main>
      <SitePromoFooter />
      <SiteFooter />
      <LiveChatWidget />
      <Suspense fallback={null}>
        <SiteVisitorTracker />
      </Suspense>
    </div>
  );
}
