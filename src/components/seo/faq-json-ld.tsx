import { FAQ_CATEGORIES } from "@/lib/boa-content";
import { SITE } from "@/lib/site-config";
import { absoluteUrl } from "@/lib/seo";

export function FaqJsonLd() {
  const items = FAQ_CATEGORIES.flatMap((cat) =>
    cat.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    }))
  );

  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: `${SITE.name} FAQ`,
    url: absoluteUrl("/faq"),
    mainEntity: items,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
