/** Central SEO copy for public marketing routes */
export interface PageSeo {
  title: string;
  description: string;
  keywords?: string[];
  path: string;
  /** 0–1 sitemap priority */
  priority?: number;
  /** sitemap changeFrequency */
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
}

/** Core financial-firm keywords used site-wide */
export const DEFAULT_KEYWORDS = [
  "AWS Vision",
  "awsvision",
  "AWS Vision Financial",
  "financial services firm",
  "investment firm",
  "wealth management company",
  "asset management firm",
  "fintech investment platform",
  "online investment account",
  "fixed deposit account",
  "high yield savings account",
  "monthly investment returns",
  "portfolio management",
  "Delaware financial services",
  "licensed investment company",
] as const;

export const PAGE_SEO: Record<string, PageSeo> = {
  "/": {
    path: "/",
    title: "AWS Vision Financial | Investment Firm — Savings, FD & Wealth Management",
    description:
      "AWS Vision is a licensed financial services and investment firm offering savings accounts, fixed deposits (FD), and wealth management with monthly profit distribution. Open an account online, track your portfolio 24/7, and compare returns vs major banks.",
    keywords: [
      ...DEFAULT_KEYWORDS,
      "open investment account online",
      "best fixed deposit rates",
      "wealth management firm USA",
      "financial firm near me",
      "monthly profit investment",
      "FD account opening",
    ],
    priority: 1,
    changeFrequency: "daily",
  },
  "/about": {
    path: "/about",
    title: "About AWS Vision | Licensed Financial & Investment Firm",
    description:
      "AWS Vision Financial is a quantitative fintech-driven asset management company licensed in the United States and UAE. Learn our mission, leadership, regulatory standing, and client-first wealth management approach.",
    keywords: [
      "about AWS Vision",
      "investment management company",
      "financial firm Delaware",
      "UAE licensed investment firm",
      "quantitative asset management",
    ],
    priority: 0.75,
    changeFrequency: "monthly",
  },
  "/wealth-management": {
    path: "/wealth-management",
    title: "Wealth Management & Investment Plans | AWS Vision Financial",
    description:
      "Professional wealth management with Silver to Executive investment plans — 2% to 7% monthly returns, global sector portfolios, real-time analytics, and downloadable profit statements. Open an investment account with a leading fintech asset manager.",
    keywords: [
      "wealth management firm",
      "investment management services",
      "monthly profit investment plan",
      "global portfolio management",
      "high return investment account",
      "professional asset management",
    ],
    priority: 0.95,
    changeFrequency: "weekly",
  },
  "/rates": {
    path: "/rates",
    title: "Investment Rates & FD Returns | AWS Vision Financial",
    description:
      "Transparent savings gratuity tiers, fixed deposit monthly rates, and investment plan returns. Compare AWS Vision program rates for savings, CDs, FD accounts, and wealth management tiers.",
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
    title: "Compare AWS Vision vs Bank of America, Chase & Wells Fargo",
    description:
      "See how AWS Vision savings, fixed deposit, and investment returns compare to Bank of America, Chase, Wells Fargo, Capital One, and Citibank. A financial firm built for higher monthly yields.",
    keywords: [
      "bank vs investment firm",
      "compare investment returns",
      "better than bank savings",
      "Chase vs AWS Vision",
      "high yield vs traditional bank",
    ],
    priority: 0.9,
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
    title: "Contact AWS Vision Financial | Investment Support & Advisors",
    description:
      "Speak with AWS Vision Financial — call +1 (469) 754-2201 or (240) 780-6910, email support@awsvision.com, or schedule an appointment. Investment inquiries, account support, and institutional partnerships.",
    keywords: [
      "contact investment firm",
      "financial advisor appointment",
      "AWS Vision support",
      "investment consultation",
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
    priority: 0.5,
    changeFrequency: "monthly",
  },
  "/credit-cards": {
    path: "/credit-cards",
    title: "Credit Cards | Cash Back & Travel Rewards — Launching Soon",
    description:
      "AWS Vision credit cards — Customized Cash Rewards, Travel, Premium, Student, and Business Visa cards. Join the waitlist from AWS Vision Financial.",
    keywords: ["credit cards", "cash back credit card", "travel rewards card"],
    priority: 0.6,
    changeFrequency: "monthly",
  },
  "/home-loans": {
    path: "/home-loans",
    title: "Home Loans & Mortgage Rates | AWS Vision Financial",
    description:
      "Home mortgage, refinance, HELOC, and affordable loan programs launching soon from AWS Vision Financial. Join the waitlist for competitive mortgage rates and digital application.",
    keywords: ["home loan rates", "mortgage lender", "refinance mortgage", "HELOC"],
    priority: 0.65,
    changeFrequency: "monthly",
  },
  "/auto-loans": {
    path: "/auto-loans",
    title: "Auto Loans & Car Financing | AWS Vision Financial",
    description:
      "New, used, and refinance auto loans with competitive fixed APR from AWS Vision Financial. Join the waitlist — auto lending launching soon.",
    keywords: ["auto loan rates", "car financing", "auto refinance loan"],
    priority: 0.6,
    changeFrequency: "monthly",
  },
  "/personal-loans": {
    path: "/personal-loans",
    title: "Personal Loans & Debt Consolidation | AWS Vision",
    description:
      "Unsecured personal loans, debt consolidation, and portfolio-backed lending from AWS Vision Financial. Fixed rates, flexible terms — join the waitlist at launch.",
    keywords: ["personal loan rates", "debt consolidation loan", "unsecured personal loan"],
    priority: 0.6,
    changeFrequency: "monthly",
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
    priority: 0.55,
    changeFrequency: "monthly",
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
};

export const SITEMAP_PATHS = Object.keys(PAGE_SEO);
