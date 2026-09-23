/** Central SEO copy for public marketing routes */
import { SEO_GUIDES } from "@/lib/seo-guides";
import { texasCitySeo, usCitySeo, usStateSeo } from "@/lib/seo-location-meta";
import { TEMPLATE_SERVICE_HUB_SLUGS, getServiceHub } from "@/lib/service-hubs";
import { TEXAS_CITIES } from "@/lib/texas-cities";
import { US_CITIES_ROUTABLE, US_STATES } from "@/lib/us-locations";

export interface PageSeo {
  title: string;
  description: string;
  keywords?: string[];
  path: string;
  /** 0–1 sitemap priority */
  priority?: number;
  /** sitemap changeFrequency */
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  /** Waitlist / non-core pages — keep out of Google index */
  noindex?: boolean;
  /** Optional geo hints for location pages */
  geoRegion?: string;
  geoPlacename?: string;
}

/** Core financial-firm keywords used site-wide (service-based · Texas + nationwide US) */
export const DEFAULT_KEYWORDS = [
  "AWS Vision",
  "awsvision",
  "AWS Vision Financial",
  "awsvision.com",
  "Investment Firm Texas",
  "Investment Company Texas",
  "Investment Management Firm Texas",
  "Investment Management Texas",
  "Investment Advisor Texas",
  "Investment Advisory Firm Texas",
  "Financial Firm Texas",
  "Financial Services Texas",
  "Financial Advisor Texas",
  "Financial Planning Texas",
  "Wealth Management Texas",
  "Wealth Management Firm Texas",
  "Asset Management Texas",
  "Portfolio Management Texas",
  "online investment firm",
  "online investment firm USA",
  "fintech investment platform",
  "online investment account",
  "wealth management online",
  "fixed deposit account USA",
  "licensed investment company",
  "nationwide financial services USA",
  "open investment account online",
] as const;

export const PAGE_SEO: Record<string, PageSeo> = {
  "/": {
    path: "/",
    title:
      "Investment Firm Texas | Wealth Management & Financial Services | AWS Vision",
    description:
      "AWS Vision Financial — investment firm serving Texas and U.S. clients online. Wealth management, savings, and fixed deposits at awsvision.com. Not affiliated with Amazon Web Services (AWS).",
    keywords: [
      ...DEFAULT_KEYWORDS,
      "AWS Vision Financial",
      "awsvision.com",
      "Investment Firm Texas",
      "Wealth Management Texas",
      "Financial Services Texas",
      "online investment firm USA",
      "wealth management online",
      "open investment account online",
      "AWS Vision not Amazon",
    ],
    priority: 1,
    changeFrequency: "daily",
  },
  "/about": {
    path: "/about",
    title: "About AWS Vision Financial (awsvision.com) — Not Amazon AWS",
    description:
      "AWS Vision Financial is an independent investment firm at awsvision.com — licensed in the U.S. and UAE. Not affiliated with Amazon Web Services. Learn our mission and how we serve Texas and U.S. clients online.",
    keywords: [
      "about AWS Vision Financial",
      "awsvision.com",
      "AWS Vision not Amazon",
      "investment management company USA",
      "online financial firm Texas",
    ],
    priority: 0.85,
    changeFrequency: "monthly",
  },
  "/serving-texas": {
    path: "/serving-texas",
    title: "Investment Firm Texas | Wealth Management Statewide | AWS Vision Financial",
    description:
      "AWS Vision Financial — online investment firm for Texas. Wealth management, savings & fixed deposits for Dallas, Houston, Austin, Fort Worth, San Antonio and 90+ Texas cities. Remote KYC.",
    keywords: [
      "Investment Firm Texas",
      "best financial firm in Texas",
      "best investment firm in Texas",
      "Investment Company Texas",
      "Investment Management Texas",
      "Investment Advisor Texas",
      "Financial Advisor Texas",
      "Wealth Management Texas",
      "Portfolio Management Texas",
      "Financial Services Texas",
      "top financial firms in Texas",
      "online investment firm Texas",
      "Texas wealth management online",
      "open investment account Texas",
    ],
    priority: 0.95,
    changeFrequency: "weekly",
    geoRegion: "US-TX",
    geoPlacename: "Texas",
  },
  "/guides": {
    path: "/guides",
    title: "Investment & Wealth Guides for Texas | AWS Vision Insights",
    description:
      "Authority guides: choosing an investment advisor in Texas, wealth vs investment management, portfolio management, retirement planning, and more — with links to Dallas, Houston, Austin, Fort Worth & San Antonio.",
    keywords: [
      "investment guides Texas",
      "how to choose investment advisor Texas",
      "wealth management vs investment management",
      "financial advisor cost Texas",
    ],
    priority: 0.85,
    changeFrequency: "weekly",
  },
  "/wealth-management": {
    path: "/wealth-management",
    title: "Wealth Management Texas | Online Wealth Management Firm | AWS Vision",
    description:
      "Wealth management for Texas and U.S. clients — Silver to Executive plans with monthly program rates, global sector portfolios, real-time analytics, and statements. Open an account online.",
    keywords: [
      "Wealth Management Texas",
      "Wealth Management Firm Texas",
      "Wealth Advisor Texas",
      "Private Wealth Management Texas",
      "Wealth Management Near Me",
      "monthly profit investment plan",
      "professional asset management online",
    ],
    priority: 0.95,
    changeFrequency: "weekly",
  },
  "/rates": {
    path: "/rates",
    title: "Investment Rates & FD Returns | AWS Vision Financial",
    description:
      "AWS Vision savings and fixed deposit programs with capital-based tiers. Exact monthly rates are confirmed on a call — public pages use up-to framing only.",
    keywords: [
      "investment rates",
      "fixed deposit rates",
      "FD interest rates",
      "savings account rates",
      "monthly return investment",
      "high yield FD",
    ],
    priority: 0.9,
    changeFrequency: "weekly",
  },
  "/compare": {
    path: "/compare",
    title: "AWS Vision vs U.S. Banks & Investment Firms | Rate Comparison",
    description:
      "Compare AWS Vision Financial vs Chase, Bank of America, Ally, Fidelity, Schwab, Vanguard, Betterment and more — bank deposit APYs and brokerage cash yields vs program returns.",
    keywords: [
      "AWS Vision vs banks",
      "AWS Vision vs Fidelity",
      "AWS Vision vs Schwab",
      "AWS Vision vs Chase",
      "best financial firm USA",
      "best financial firm in Texas",
      "bank vs investment firm",
      "compare investment returns",
      "brokerage cash yield vs bank",
      "high yield vs traditional bank",
    ],
    priority: 0.92,
    changeFrequency: "weekly",
  },
  "/nonprofit": {
    path: "/nonprofit",
    title: "Non-Profit Investment Fund Program | AWS Vision Financial",
    description:
      "Dedicated non-profit investment program for 501(c)(3) organizations — $100K to $1M fund capital with 8%–10% monthly program rates, organization portal, and relationship management.",
    keywords: [
      "nonprofit investment fund",
      "501c3 investment account",
      "organization endowment management",
      "non-profit financial services",
    ],
    priority: 0.85,
    changeFrequency: "monthly",
  },
  "/signup": {
    path: "/signup",
    title: "Open Investment Account Online | Savings, FD or Wealth Plan",
    description:
      "Apply online in minutes for a savings, fixed deposit, or investment account with AWS Vision Financial. Secure KYC verification, digital onboarding, and fund your account the same day.",
    keywords: [
      "open investment account",
      "apply for FD account",
      "online account opening",
      "investment account signup",
    ],
    priority: 0.9,
    changeFrequency: "monthly",
  },
  "/signup/nonprofit": {
    path: "/signup/nonprofit",
    title: "Open Non-Profit Organization Investment Account",
    description:
      "Enroll your tax-exempt organization online. Submit EIN, mission details, and fund capital from $100K to $1M with AWS Vision's non-profit investment program.",
    keywords: ["nonprofit account opening", "organization investment enrollment", "501c3 signup"],
    priority: 0.8,
    changeFrequency: "monthly",
  },
  "/contact": {
    path: "/contact",
    title: "Contact AWS Vision Financial | Texas & US Investment Support",
    description:
      "Contact AWS Vision Financial — call +1 (469) 754-2201 or (240) 780-6910, email support@awsvision.com, or book an appointment. Support for Texas and nationwide U.S. clients, account help, and institutional partnerships.",
    keywords: [
      "contact investment firm Texas",
      "financial advisor appointment USA",
      "AWS Vision support phone",
      "investment consultation online",
    ],
    priority: 0.8,
    changeFrequency: "monthly",
  },
  "/personal": {
    path: "/personal",
    title: "Personal Banking & Investment Accounts | AWS Vision",
    description:
      "Personal savings, fixed deposits, certificates of deposit, and investment accounts with monthly gratuity and global sector profit distribution from a licensed financial firm.",
    keywords: ["personal investment account", "personal banking", "savings and FD", "retail wealth management"],
    priority: 0.8,
    changeFrequency: "monthly",
  },
  "/personal/savings": {
    path: "/personal/savings",
    title: "High Yield Savings Account | Monthly Gratuity Tiers",
    description:
      "AWS Vision savings accounts with tiered annual gratuity based on balance. FDIC-insured deposits, online portal access, and competitive yields from a trusted investment firm.",
    keywords: [
      "high yield savings account",
      "best savings account rates",
      "monthly gratuity savings",
      "online savings account",
    ],
    priority: 0.85,
    changeFrequency: "monthly",
  },
  "/personal/cds": {
    path: "/personal/cds",
    title: "Fixed Deposit & CD Accounts | High Monthly FD Rates",
    description:
      "Fixed deposit and certificate of deposit accounts with locked monthly program rates and maturity terms. FD promos up to 90% returns in 6 months on qualifying deposits at AWS Vision Financial.",
    keywords: [
      "fixed deposit account",
      "certificate of deposit rates",
      "best FD rates USA",
      "CD account high yield",
      "fixed deposit investment",
    ],
    priority: 0.9,
    changeFrequency: "weekly",
  },
  "/personal/checking": {
    path: "/personal/checking",
    title: "Checking Accounts | Coming Soon — AWS Vision Financial",
    description:
      "AWS Vision Advantage checking — SafeBalance, Plus, and Relationship tiers launching soon. Join the waitlist for a modern checking account from our financial services firm.",
    keywords: ["checking account", "online checking account", "free checking"],
    priority: 0.2,
    changeFrequency: "yearly",
    noindex: true,
  },
  "/credit-cards": {
    path: "/credit-cards",
    title: "Credit Cards | Cash Back & Travel Rewards — Launching Soon",
    description:
      "AWS Vision credit cards — Customized Cash Rewards, Travel, Premium, Student, and Business Visa cards. Join the waitlist from AWS Vision Financial.",
    keywords: ["credit cards", "cash back credit card", "travel rewards card"],
    priority: 0.2,
    changeFrequency: "yearly",
    noindex: true,
  },
  "/home-loans": {
    path: "/home-loans",
    title: "Home Loans & Mortgage Rates | AWS Vision Financial",
    description:
      "Home mortgage, refinance, HELOC, and affordable loan programs launching soon from AWS Vision Financial. Join the waitlist for competitive mortgage rates and digital application.",
    keywords: ["home loan rates", "mortgage lender", "refinance mortgage", "HELOC"],
    priority: 0.2,
    changeFrequency: "yearly",
    noindex: true,
  },
  "/auto-loans": {
    path: "/auto-loans",
    title: "Auto Loans & Car Financing | AWS Vision Financial",
    description:
      "New, used, and refinance auto loans with competitive fixed APR from AWS Vision Financial. Join the waitlist — auto lending launching soon.",
    keywords: ["auto loan rates", "car financing", "auto refinance loan"],
    priority: 0.2,
    changeFrequency: "yearly",
    noindex: true,
  },
  "/personal-loans": {
    path: "/personal-loans",
    title: "Personal Loans & Debt Consolidation | AWS Vision",
    description:
      "Unsecured personal loans, debt consolidation, and portfolio-backed lending from AWS Vision Financial. Fixed rates, flexible terms — join the waitlist at launch.",
    keywords: ["personal loan rates", "debt consolidation loan", "unsecured personal loan"],
    priority: 0.2,
    changeFrequency: "yearly",
    noindex: true,
  },
  "/small-business": {
    path: "/small-business",
    title: "Small Business Banking & Commercial Loans | AWS Vision",
    description:
      "Business checking, credit lines, merchant services, and commercial lending for growing companies. Savings, FD, and investment accounts available today at AWS Vision Financial.",
    keywords: ["small business banking", "business line of credit", "commercial banking"],
    priority: 0.7,
    changeFrequency: "monthly",
  },
  "/student-banking": {
    path: "/student-banking",
    title: "Student Banking & Young Investor Accounts | AWS Vision",
    description:
      "Banking and investment tools for students and young professionals from AWS Vision Financial. Student accounts launching soon — join the waitlist.",
    keywords: ["student bank account", "student investment account"],
    priority: 0.5,
    changeFrequency: "monthly",
  },
  "/insurance": {
    path: "/insurance",
    title: "Life, Health & Portfolio Insurance | AWS Vision Financial",
    description:
      "Life, health, and portfolio protection insurance for AWS Vision investment clients. Get a quote or speak with a licensed financial advisor.",
    keywords: ["investment insurance", "portfolio protection", "life insurance"],
    priority: 0.2,
    changeFrequency: "yearly",
    noindex: true,
  },
  "/online-banking": {
    path: "/online-banking",
    title: "Online Banking & Mobile App | AWS Vision Financial",
    description:
      "Secure online banking, mobile app, bill pay, Zelle transfers, and investment portal access. Enroll in AWS Vision digital banking in minutes.",
    keywords: ["online banking", "mobile banking app", "digital banking platform", "investment portal"],
    priority: 0.75,
    changeFrequency: "monthly",
  },
  "/security": {
    path: "/security",
    title: "Bank-Grade Security & Fraud Protection | AWS Vision",
    description:
      "How AWS Vision Financial protects your accounts — 256-bit encryption, 24/7 fraud monitoring, biometric sign-in, account alerts, and $0 liability guarantee.",
    keywords: ["bank security", "fraud protection", "secure online banking", "account encryption"],
    priority: 0.65,
    changeFrequency: "monthly",
  },
  "/referral-program": {
    path: "/referral-program",
    title: "Brand Ambassador & Referral Program | AWS Vision",
    description:
      "Join the AWS Vision Brand Ambassador program. Earn 3% commission on referred client capital, grow our investor network, and qualify for elite performance rewards.",
    keywords: ["referral program", "brand ambassador", "investment referrals", "financial ambassador"],
    priority: 0.7,
    changeFrequency: "monthly",
  },
  "/faq": {
    path: "/faq",
    title: "FAQ — Accounts, Investments & Online Banking | AWS Vision",
    description:
      "Answers about opening savings and FD accounts, investment plan returns, monthly statements, withdrawals, KYC verification, and the AWS Vision client portal.",
    keywords: ["investment FAQ", "fixed deposit questions", "how to open investment account"],
    priority: 0.7,
    changeFrequency: "monthly",
  },
  "/help": {
    path: "/help",
    title: "Help Center & Site Search | AWS Vision Financial Support",
    description:
      "Search AWS Vision help topics — accounts, deposits, wealth management, security, and contact support. Get help from our financial services team.",
    keywords: ["help center", "customer support", "investment help"],
    priority: 0.65,
    changeFrequency: "monthly",
  },
  "/financial-education": {
    path: "/financial-education",
    title: "Financial Education — Saving, Investing & Wealth Building",
    description:
      "Free financial education from AWS Vision — guides on saving, fixed deposits, portfolio growth, retirement planning, and building long-term wealth.",
    keywords: ["financial education", "investing for beginners", "wealth building guide"],
    priority: 0.6,
    changeFrequency: "monthly",
  },
  "/news": {
    path: "/news",
    title: "Financial News & Market Insights | AWS Vision",
    description:
      "Latest news, quarterly performance reports, and market insights from AWS Vision Financial — your investment management and wealth advisory partner.",
    keywords: ["financial news", "investment firm news", "market insights", "quarterly report"],
    priority: 0.6,
    changeFrequency: "weekly",
  },
  "/serving-united-states": {
    path: "/serving-united-states",
    title: "Online Financial Services Across All 50 U.S. States | AWS Vision",
    description:
      "AWS Vision Financial serves all 50 U.S. states online — state hubs and major-city pages, remote KYC, savings, fixed deposits, and wealth management. No local branch required.",
    keywords: [
      "nationwide investment firm USA",
      "online financial services United States",
      "open investment account any state",
      "US fintech wealth management",
      "remote KYC investment account",
      "best financial firm USA",
      "investment accounts all 50 states",
    ],
    priority: 0.92,
    changeFrequency: "weekly",
  },
  "/locations": {
    path: "/locations",
    title: "Locations We Serve — Texas Cities & All 50 U.S. States | AWS Vision",
    description:
      "Service areas for AWS Vision Financial: expanded Texas city pages plus all 50 U.S. states and major cities online — coverage pages, not retail storefronts.",
    keywords: [
      "AWS Vision locations",
      "Texas investment firm cities",
      "Dallas Houston Austin investment",
      "online financial firm service areas",
      "investment firm all 50 states",
    ],
    priority: 0.9,
    changeFrequency: "weekly",
  },
};

/** Sync city landing pages from TEXAS_CITIES */
for (const city of TEXAS_CITIES) {
  const path = `/serving-texas/${city.slug}`;
  const meta = texasCitySeo(city);
  PAGE_SEO[path] = {
    path,
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    priority: city.light ? 0.78 : 0.88,
    changeFrequency: city.light ? "monthly" : "weekly",
    geoRegion: "US-TX",
    geoPlacename: `${city.name}, Texas`,
  };
}

/** Sync authority guides from SEO_GUIDES */
const HIGH_PRIORITY_GUIDE_SLUGS = new Set([
  "investment-company-texas",
  "online-financial-advisor-texas",
  "wealth-management-houston",
  "investment-firm-fort-worth",
  "wealth-management-san-antonio",
  "wealth-advisor-dallas",
  "best-portfolio-management-texas",
  "financial-services-firm-texas",
  "best-financial-firm-texas",
  "best-investment-firm-texas",
  "best-wealth-management-firm-texas",
]);

for (const guide of SEO_GUIDES) {
  const path = `/guides/${guide.slug}`;
  PAGE_SEO[path] = {
    path,
    title: `${guide.title} | AWS Vision Financial`,
    description: guide.description.slice(0, 158),
    keywords: Array.from(
      new Set([
        ...guide.keywords,
        "AWS Vision Financial",
        "Investment Firm Texas",
        "Wealth Management Texas",
        "online investment firm USA",
      ])
    ),
    priority: HIGH_PRIORITY_GUIDE_SLUGS.has(guide.slug) ? 0.84 : 0.72,
    changeFrequency: HIGH_PRIORITY_GUIDE_SLUGS.has(guide.slug) ? "weekly" : "monthly",
  };
}

/** Sync service hubs (investment management, portfolio, planning, advisory) */
for (const slug of TEMPLATE_SERVICE_HUB_SLUGS) {
  const hub = getServiceHub(slug);
  if (!hub) continue;
  PAGE_SEO[hub.path] = {
    path: hub.path,
    title: `${hub.h1} | AWS Vision Financial`,
    description: hub.intro.slice(0, 158),
    keywords: Array.from(
      new Set([
        ...hub.keywords,
        "AWS Vision Financial",
        "Investment Firm Texas",
        "Wealth Management Texas",
        "online investment firm USA",
        hub.h1,
      ])
    ),
    priority: 0.93,
    changeFrequency: "weekly",
  };
}

/** Sync U.S. state + major-city light pages (Texas cities stay on /serving-texas) */
for (const state of US_STATES) {
  const path = `/serving-united-states/${state.slug}`;
  const meta = usStateSeo(state);
  PAGE_SEO[path] = {
    path,
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    priority: state.slug === "texas" ? 0.9 : 0.82,
    changeFrequency: "monthly",
    geoRegion: `US-${state.abbr}`,
    geoPlacename: state.name,
  };
}

for (const city of US_CITIES_ROUTABLE) {
  const path = `/serving-united-states/${city.stateSlug}/${city.slug}`;
  const meta = usCitySeo(city);
  PAGE_SEO[path] = {
    path,
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    priority: 0.74,
    changeFrequency: "monthly",
    geoRegion: `US-${city.stateAbbr}`,
    geoPlacename: `${city.name}, ${city.stateName}`,
  };
}

export const SITEMAP_PATHS = Object.keys(PAGE_SEO);
