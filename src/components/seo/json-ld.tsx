import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

function JsonLdScript({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function MarketingJsonLd() {
  return (
    <>
      <JsonLdScript data={organizationJsonLd()} />
      <JsonLdScript data={websiteJsonLd()} />
    </>
  );
}
