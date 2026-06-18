import { absoluteUrl } from "@/lib/seo";

export function RatesJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "AWS Vision Financial Rates & Returns",
    description:
      "Savings gratuity tiers, fixed deposit monthly rates, and investment plan returns from AWS Vision Financial.",
    url: absoluteUrl("/rates"),
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@type": "FinancialProduct",
          name: "Savings Account Gratuity Tiers",
          category: "Savings",
          url: absoluteUrl("/personal/savings"),
        },
      },
      {
        "@type": "ListItem",
        position: 2,
        item: {
          "@type": "FinancialProduct",
          name: "Fixed Deposit Monthly Rates",
          category: "Fixed Deposit",
          url: absoluteUrl("/personal/cds"),
        },
      },
      {
        "@type": "ListItem",
        position: 3,
        item: {
          "@type": "FinancialProduct",
          name: "Investment Plan Returns",
          category: "Wealth Management",
          url: absoluteUrl("/wealth-management"),
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
