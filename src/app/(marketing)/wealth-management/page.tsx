import { InvestmentPageContent } from "@/components/marketing/investment-page-content";
import { pageMetadata } from "@/lib/seo";
import { getServiceHub } from "@/lib/service-hubs";

export const metadata = pageMetadata("/wealth-management");

export default function WealthManagementPage() {
  const hub = getServiceHub("wealth-management");
  const faqLd =
    hub && hub.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: hub.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  return (
    <>
      {faqLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      ) : null}
      <InvestmentPageContent />
    </>
  );
}
