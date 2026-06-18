import { NEWS_ARTICLES } from "@/lib/boa-content";
import { absoluteUrl } from "@/lib/seo";
import { SITE } from "@/lib/site-config";

export function NewsJsonLd() {
  const items = NEWS_ARTICLES.map((article) => ({
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    author: {
      "@type": "Organization",
      name: SITE.name,
      url: absoluteUrl("/"),
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logo.png"),
      },
    },
    mainEntityOfPage: absoluteUrl(`/news#${article.id}`),
    url: absoluteUrl(`/news#${article.id}`),
  }));

  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE.name} News & Insights`,
    url: absoluteUrl("/news"),
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
