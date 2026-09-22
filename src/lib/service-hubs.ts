export type ServiceHub = {
  slug: string;
  path: string;
  eyebrow: string;
  h1: string;
  intro: string;
  keywords: string[];
  sections: { heading: string; body: string[] }[];
  faqs: { q: string; a: string }[];
  related: { label: string; href: string }[];
};

/** Core service hubs for Texas commercial SEO clusters (online / service-area model) */
export const SERVICE_HUBS: ServiceHub[] = [
  {
    slug: "investment-management",
    path: "/investment-management",
    eyebrow: "Investment management · Texas & USA",
    h1: "Investment management firm for Texas clients",
    intro:
      "AWS Vision Financial provides online investment management for Texas and nationwide U.S. clients — structured wealth plans, portfolio tracking, and transparent program rates without a retail branch visit.",
    keywords: [
      "Investment Firm Texas",
      "Investment Company Texas",
      "Investment Management Firm Texas",
      "Investment Management Company Texas",
      "Investment Management Texas",
      "Professional Investment Management",
      "Best Investment Firm in Texas",
      "Top Investment Firms in Texas",
      "Investment Firm Near Me",
      "Investment Management Near Me",
    ],
    sections: [
      {
        heading: "What investment management means here",
        body: [
          "Clients choose savings, fixed deposit, or wealth management plans, then monitor balances and statements in a secure portal.",
          "Texas residents in Dallas, Houston, Austin, Fort Worth, San Antonio, and statewide enroll online with KYC verification.",
        ],
      },
      {
        heading: "Who this fits",
        body: [
          "Individuals seeking an online investment company for long-term capital growth.",
          "Clients who want clear rates and remote support rather than a local storefront.",
        ],
      },
    ],
    faqs: [
      {
        q: "Are you an investment firm in Texas?",
        a: "We are a licensed U.S. financial services firm serving Texas clients online. We do not claim a public Texas retail branch — service is remote by design.",
      },
      {
        q: "How do I get started?",
        a: "Review rates and wealth plans, then complete signup and KYC at awsvision.com/signup.",
      },
    ],
    related: [
      { label: "Wealth management", href: "/wealth-management" },
      { label: "Portfolio management", href: "/portfolio-management" },
      { label: "Serving Texas", href: "/serving-texas" },
      { label: "Dallas", href: "/serving-texas/dallas" },
    ],
  },
  {
    slug: "wealth-management",
    path: "/wealth-management",
    eyebrow: "Wealth management · Texas & USA",
    h1: "Wealth management for Texas and U.S. clients",
    intro:
      "Silver through Executive wealth plans with published monthly program rates, sector portfolios, and downloadable statements — online for Texas and nationwide clients.",
    keywords: [
      "Wealth Management Texas",
      "Wealth Management Firm Texas",
      "Wealth Advisor Texas",
      "Private Wealth Management Texas",
      "Wealth Management Near Me",
      "Local Wealth Management Firm",
      "Long Term Wealth Management",
    ],
    sections: [],
    faqs: [],
    related: [],
  },
  {
    slug: "portfolio-management",
    path: "/portfolio-management",
    eyebrow: "Portfolio management · Texas & USA",
    h1: "Portfolio management services for Texas investors",
    intro:
      "Track and grow capital with AWS Vision portfolio tools — wealth plan tiers, statements, and online monitoring for Texas and U.S. clients seeking portfolio management without a branch visit.",
    keywords: [
      "Portfolio Management Texas",
      "Portfolio Management Services Texas",
      "Professional Portfolio Management Texas",
      "Investment Portfolio Management Services",
      "Portfolio Manager Near Me",
      "Investment Portfolio Management Company",
      "Diversified Investment Portfolio Management",
    ],
    sections: [
      {
        heading: "How portfolio tracking works",
        body: [
          "After your account is funded, the client portal shows balances, activity, and statements so you can review portfolio progress anytime.",
          "Wealth plans allocate across published sectors according to your selected tier.",
        ],
      },
      {
        heading: "Texas coverage",
        body: [
          "Portfolio management is available online to clients in Dallas, Houston, Austin, Fort Worth, San Antonio, and across Texas.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is this discretionary brokerage advice?",
        a: "AWS Vision offers online investment and wealth products with portal tracking. Review your account agreements for exact terms. We do not use RIA marketing claims unless separately disclosed in legal documents.",
      },
    ],
    related: [
      { label: "Investment management", href: "/investment-management" },
      { label: "Wealth management", href: "/wealth-management" },
      { label: "How portfolio management works", href: "/guides/how-does-portfolio-management-work" },
      { label: "Rates", href: "/rates" },
    ],
  },
  {
    slug: "financial-planning",
    path: "/financial-planning",
    eyebrow: "Financial planning resources · Texas",
    h1: "Financial planning resources for Texas clients",
    intro:
      "Practical financial planning education and account options for Texas households — savings, fixed deposits, wealth plans, and guides to help you choose an approach that fits your goals.",
    keywords: [
      "Financial Planning Texas",
      "Financial Firm Texas",
      "Financial Services Texas",
      "Financial Planning Firm Near Me",
      "Retirement Planning Texas",
      "Financial Planning for Business Owners",
    ],
    sections: [
      {
        heading: "Planning building blocks",
        body: [
          "Start with emergency savings, then consider fixed deposits for defined terms, and wealth plans for longer-term portfolio growth.",
          "Our guides explain how to choose an investment or financial advisor approach in Texas — including when an online firm fits.",
        ],
      },
      {
        heading: "Business owners & long-term goals",
        body: [
          "Business owners and professionals can use the same online accounts while coordinating tax or legal needs with independent advisors. We do not replace CPA or attorney services.",
        ],
      },
    ],
    faqs: [
      {
        q: "Do you provide comprehensive certified financial planning?",
        a: "We provide online investment accounts and educational guides. For tax, estate, or CPF/CFP-style planning, work with licensed professionals alongside your AWS Vision account.",
      },
    ],
    related: [
      { label: "Investment advisory overview", href: "/investment-advisory" },
      { label: "Choose an investment advisor in Texas", href: "/guides/how-to-choose-investment-advisor-texas" },
      { label: "Retirement guide", href: "/guides/retirement-planning-texas" },
      { label: "Financial education", href: "/financial-education" },
    ],
  },
  {
    slug: "investment-advisory",
    path: "/investment-advisory",
    eyebrow: "Investment advisory services · online",
    h1: "Investment advisory services for Texas individuals",
    intro:
      "Learn how AWS Vision supports individuals seeking investment advisory-style guidance through transparent products, education, and remote support — without claiming a Texas retail office or unverified RIA titles.",
    keywords: [
      "Investment Advisor Texas",
      "Investment Advisory Firm Texas",
      "Investment Advisory Services Texas",
      "Financial Advisor Texas",
      "Financial Advisory Firm Texas",
      "Investment Advisor Near Me",
      "Financial Advisor Near Me",
      "Independent Financial Advisor Near Me",
      "Investment Advisor for Individuals",
      "Personal Investment Advisor",
    ],
    sections: [
      {
        heading: "What we mean by advisory services",
        body: [
          "Support includes product education, rates transparency, onboarding help, and portal tools so you can make informed decisions.",
          "Marketing language stays accurate: we are an online financial services / investment firm serving Texas remotely. We do not invent a local storefront for “near me” Maps pack ranking.",
        ],
      },
      {
        heading: "How to evaluate any advisor",
        body: [
          "Check disclosures, fees, registration status where applicable, and whether claims match real operations. Our guides walk through common Texas questions.",
        ],
      },
    ],
    faqs: [
      {
        q: "Are you a Registered Investment Advisor (RIA)?",
        a: "We only describe registration status in official disclosures and legal pages. This marketing page focuses on online investment products and education — not SEC/Texas RIA title claims.",
      },
      {
        q: "Why target “near me” keywords if you are online?",
        a: "Many Texans search that way. We match the intent with honest service-area pages (Dallas, Houston, Austin, Fort Worth, San Antonio) while stating that service is remote.",
      },
    ],
    related: [
      { label: "Investment management", href: "/investment-management" },
      { label: "Advisor vs financial advisor guide", href: "/guides/investment-advisor-vs-financial-advisor" },
      { label: "Serving Texas", href: "/serving-texas" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    slug: "asset-management",
    path: "/asset-management",
    eyebrow: "Asset management · Texas & USA",
    h1: "Asset management company for Texas & U.S. clients",
    intro:
      "AWS Vision Financial provides online asset management style services — structured investment and wealth products, portfolio tracking, and transparent program rates for clients across Texas and nationwide.",
    keywords: [
      "Asset Management Texas",
      "Asset Management Company Texas",
      "asset management firm Texas",
      "Asset Management USA",
      "Investment Management Company Texas",
    ],
    sections: [
      {
        heading: "How we approach asset growth",
        body: [
          "Clients select savings, fixed deposit, or wealth plans, then monitor capital in the portal with downloadable statements.",
          "Texas metros — Dallas, Houston, Austin, Fort Worth, San Antonio — enroll online with remote KYC.",
        ],
      },
      {
        heading: "Related hubs",
        body: [
          "See investment management and portfolio management for deeper product detail, and wealth management for tiered plans.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is asset management available online in Texas?",
        a: "Yes. AWS Vision serves Texas clients remotely with investment and wealth products — no retail branch visit required.",
      },
    ],
    related: [
      { label: "Investment management", href: "/investment-management" },
      { label: "Portfolio management", href: "/portfolio-management" },
      { label: "Asset management guide", href: "/guides/asset-management-texas" },
      { label: "Wealth management", href: "/wealth-management" },
    ],
  },
];

export function getServiceHub(slug: string) {
  return SERVICE_HUBS.find((h) => h.slug === slug) ?? null;
}

/** Hubs that render the shared marketing template (wealth-management keeps its richer page) */
export const TEMPLATE_SERVICE_HUB_SLUGS = [
  "investment-management",
  "portfolio-management",
  "financial-planning",
  "investment-advisory",
  "asset-management",
] as const;
