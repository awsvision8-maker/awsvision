export type SeoGuide = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  category: string;
  readTime: string;
  sections: { heading: string; body: string[] }[];
  related: { label: string; href: string }[];
};

export const SEO_GUIDES: SeoGuide[] = [
  {
    slug: "open-investment-account-online-usa",
    title: "How to Open an Investment Account Online in the USA",
    description:
      "Step-by-step guide to opening an AWS Vision savings, fixed deposit, or wealth account online — KYC, funding, and portal access for Texas and U.S. clients.",
    keywords: [
      "open investment account online USA",
      "online KYC investment account",
      "how to open FD account online",
    ],
    category: "Investing",
    readTime: "6 min",
    sections: [
      {
        heading: "Choose your product",
        body: [
          "Pick savings for flexible capital, a fixed deposit (FD/CD) for locked program rates, or a wealth management plan for monthly profit distribution.",
          "Compare current terms on the Rates page before you apply.",
        ],
      },
      {
        heading: "Complete online signup and KYC",
        body: [
          "Create your account at awsvision.com/signup, then submit identity documents and a selfie for KYC review.",
          "Texas and nationwide U.S. clients can complete this remotely — no branch visit required.",
        ],
      },
      {
        heading: "Fund and track in the portal",
        body: [
          "After approval, submit a deposit from your portal. Once credited, monitor balances, statements, and agreements online 24/7.",
        ],
      },
    ],
    related: [
      { label: "Open an account", href: "/signup" },
      { label: "View rates", href: "/rates" },
      { label: "Serving Texas", href: "/serving-texas" },
    ],
  },
  {
    slug: "fixed-deposit-vs-savings",
    title: "Fixed Deposit vs Savings Account: Which Should You Choose?",
    description:
      "Compare AWS Vision fixed deposits and savings accounts — access, program rates, and when each product fits Texas and U.S. investors.",
    keywords: [
      "fixed deposit vs savings",
      "FD vs high yield savings",
      "best CD vs savings account USA",
    ],
    category: "Savings",
    readTime: "5 min",
    sections: [
      {
        heading: "Savings accounts",
        body: [
          "Savings balances earn tiered gratuity with easier access. Useful if you may need liquidity while still growing capital.",
        ],
      },
      {
        heading: "Fixed deposits (FD / CD)",
        body: [
          "FDs lock a program rate and term. They suit investors who can leave capital until maturity for clearer return expectations.",
        ],
      },
      {
        heading: "How to decide",
        body: [
          "Need flexibility → savings. Want defined term returns → FD. Want portfolio-style monthly profit → wealth management.",
          "You can always start with one product and add another later after KYC.",
        ],
      },
    ],
    related: [
      { label: "Savings accounts", href: "/personal/savings" },
      { label: "Fixed deposits", href: "/personal/cds" },
      { label: "Compare vs banks", href: "/compare" },
    ],
  },
  {
    slug: "texas-online-wealth-management",
    title: "Online Wealth Management for Texas Residents",
    description:
      "How Texas clients use AWS Vision wealth plans online — Silver to Executive tiers, monthly profit distribution, and remote onboarding.",
    keywords: [
      "Texas wealth management online",
      "Dallas Houston Austin investing",
      "online wealth management Texas",
    ],
    category: "Investing",
    readTime: "7 min",
    sections: [
      {
        heading: "Built for remote Texas clients",
        body: [
          "AWS Vision is service-based: Dallas, Houston, Austin, San Antonio, and statewide clients enroll online with phone support.",
          "There is no requirement to visit a retail branch.",
        ],
      },
      {
        heading: "Wealth plan structure",
        body: [
          "Plans range from Silver through Executive with published monthly program rates, sector portfolios, and downloadable statements.",
        ],
      },
      {
        heading: "Next steps",
        body: [
          "Review wealth tiers, check rates, then apply online. Serving Texas and city pages explain coverage without claiming a fake storefront.",
        ],
      },
    ],
    related: [
      { label: "Wealth management", href: "/wealth-management" },
      { label: "Serving Texas", href: "/serving-texas" },
      { label: "Dallas", href: "/serving-texas/dallas" },
    ],
  },
  {
    slug: "how-monthly-profit-investing-works",
    title: "How Monthly Profit Investing Works at AWS Vision",
    description:
      "Plain-language overview of monthly profit distribution on AWS Vision wealth accounts — eligibility, statements, and what to review each month.",
    keywords: [
      "monthly profit investment",
      "monthly return investment account",
      "how investment profit distribution works",
    ],
    category: "Investing",
    readTime: "6 min",
    sections: [
      {
        heading: "Program rates vs bank APY",
        body: [
          "Wealth plans use published monthly program rates by tier. Always read your agreement and compare with traditional bank savings on our Compare page.",
        ],
      },
      {
        heading: "Eligibility and timing",
        body: [
          "Profit timing follows your plan and account rules after deposits are approved. Your portal statements show activity each period.",
        ],
      },
      {
        heading: "Stay informed",
        body: [
          "Use the client portal for balances, agreements, and notifications. Contact support if anything on a statement is unclear.",
        ],
      },
    ],
    related: [
      { label: "Wealth plans", href: "/wealth-management" },
      { label: "FAQ", href: "/faq" },
      { label: "Rates", href: "/rates" },
    ],
  },
];

export function getSeoGuide(slug: string) {
  return SEO_GUIDES.find((g) => g.slug === slug) ?? null;
}
