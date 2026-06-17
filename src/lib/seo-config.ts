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

export const DEFAULT_KEYWORDS = [
  "AWS Vision",
  "investment account",
  "fixed deposit",
  "savings account",
  "wealth management",
  "monthly returns",
  "online banking",
  "awsvision",
] as const;

export const PAGE_SEO: Record<string, PageSeo> = {
  "/": {
    path: "/",
    title: "AWS Vision | Savings, Fixed Deposits & Global Investment",
    description:
      "Open savings, fixed deposit, and investment accounts with AWS Vision. Monthly profit distribution, FD promos up to 90% in 6 months, and a secure client portal.",
    keywords: [...DEFAULT_KEYWORDS, "open investment account", "FD account", "portfolio growth"],
    priority: 1,
    changeFrequency: "daily",
  },
  "/about": {
    path: "/about",
    title: "About AWS Vision | Licensed Investment & Wealth Firm",
    description:
      "Learn about AWS Vision — quantitative fintech-driven asset management licensed in the United States and UAE. Our mission, leadership, and client-first approach.",
    keywords: ["about AWS Vision", "investment firm", "Delaware", "UAE licensed"],
    priority: 0.7,
    changeFrequency: "monthly",
  },
  "/wealth-management": {
    path: "/wealth-management",
    title: "Investment & Wealth Management | AWS Vision",
    description:
      "Silver to Executive investment plans with 2%–7% monthly returns. Global sector portfolios, live profit tracking, and monthly statements in your client portal.",
    keywords: ["investment plans", "monthly profit", "wealth management", "portfolio"],
    priority: 0.9,
    changeFrequency: "weekly",
  },
  "/rates": {
    path: "/rates",
    title: "Rates & Returns | Savings, FD & Investment Plans",
    description:
      "Compare AWS Vision savings gratuity tiers, fixed deposit monthly rates, and investment plan returns. Transparent program rates for every account type.",
    keywords: ["investment rates", "FD rates", "savings interest", "monthly returns"],
    priority: 0.85,
    changeFrequency: "weekly",
  },
  "/compare": {
    path: "/compare",
    title: "Compare AWS Vision vs Major Banks | Better Returns",
    description:
      "See how AWS Vision savings, fixed deposit, and investment returns compare to Bank of America, Chase, Wells Fargo, Capital One, and Citi.",
    keywords: ["bank comparison", "vs Chase", "vs Bank of America", "better returns"],
    priority: 0.85,
    changeFrequency: "weekly",
  },
  "/nonprofit": {
    path: "/nonprofit",
    title: "Non-Profit Investment Program | AWS Vision",
    description:
      "Enroll your organization from $100K–$1M fund capital with 8%–10% monthly program rates. Dedicated non-profit portal and relationship support.",
    keywords: ["nonprofit investment", "organization fund", "501c3", "non-profit banking"],
    priority: 0.8,
    changeFrequency: "monthly",
  },
  "/signup": {
    path: "/signup",
    title: "Open an Account | Savings, FD or Investment",
    description:
      "Apply online in minutes for a savings, fixed deposit, or investment account. Complete KYC verification and fund your account securely.",
    keywords: ["open account", "sign up", "apply investment account", "KYC"],
    priority: 0.9,
    changeFrequency: "monthly",
  },
  "/signup/nonprofit": {
    path: "/signup/nonprofit",
    title: "Open Non-Profit Organization Account | AWS Vision",
    description:
      "Enroll your non-profit organization online. Submit EIN, mission details, and fund capital from $100K to $1M with dedicated program rates.",
    keywords: ["nonprofit signup", "organization account", "EIN enrollment"],
    priority: 0.75,
    changeFrequency: "monthly",
  },
  "/contact": {
    path: "/contact",
    title: "Contact AWS Vision | Support & Appointments",
    description:
      "Contact AWS Vision by phone, email support@awsvision.com, or schedule an appointment. Investment inquiries, account support, and partnerships.",
    keywords: ["contact", "support", "schedule appointment", "relationship manager"],
    priority: 0.8,
    changeFrequency: "monthly",
  },
  "/personal": {
    path: "/personal",
    title: "Personal Banking & Investment | AWS Vision",
    description:
      "Personal savings, fixed deposits, CDs, and investment accounts with monthly gratuity and global sector profit distribution.",
    keywords: ["personal banking", "personal investment", "savings", "FD"],
    priority: 0.75,
    changeFrequency: "monthly",
  },
  "/personal/savings": {
    path: "/personal/savings",
    title: "Savings Accounts | Monthly Gratuity Tiers",
    description:
      "AWS Vision savings accounts with tiered annual gratuity based on balance. FDIC insured deposits with online portal access.",
    keywords: ["savings account", "high yield savings", "gratuity"],
    priority: 0.7,
    changeFrequency: "monthly",
  },
  "/personal/cds": {
    path: "/personal/cds",
    title: "Certificates of Deposit & Fixed Deposits",
    description:
      "Fixed deposit accounts with locked monthly program rates and maturity terms. FD promo offers up to 90% returns in 6 months on qualifying deposits.",
    keywords: ["certificate of deposit", "fixed deposit", "CD rates", "FD promo"],
    priority: 0.8,
    changeFrequency: "weekly",
  },
  "/personal/checking": {
    path: "/personal/checking",
    title: "Checking Accounts | Coming Soon",
    description:
      "AWS Vision Advantage checking — SafeBalance, Plus, and Relationship tiers. Join the waitlist for launch notifications.",
    keywords: ["checking account", "online checking"],
    priority: 0.5,
    changeFrequency: "monthly",
  },
  "/credit-cards": {
    path: "/credit-cards",
    title: "Credit Cards | Launching Soon",
    description:
      "AWS Vision credit cards — Cash Rewards, Travel, Premium, Student, and Business. Join the waitlist to apply at launch.",
    keywords: ["credit cards", "rewards card", "cash back"],
    priority: 0.6,
    changeFrequency: "monthly",
  },
  "/home-loans": {
    path: "/home-loans",
    title: "Home Loans & Mortgages | AWS Vision",
    description:
      "Home mortgage and refinancing solutions launching soon. Join the loan waitlist for rates and online application access.",
    keywords: ["home loan", "mortgage", "refinance"],
    priority: 0.6,
    changeFrequency: "monthly",
  },
  "/auto-loans": {
    path: "/auto-loans",
    title: "Auto Loans | AWS Vision",
    description:
      "Competitive auto financing for new and used vehicles. Join the waitlist to be notified when AWS Vision auto loans open.",
    keywords: ["auto loan", "car financing"],
    priority: 0.55,
    changeFrequency: "monthly",
  },
  "/personal-loans": {
    path: "/personal-loans",
    title: "Personal Loans | AWS Vision",
    description:
      "Personal lending for consolidation, major purchases, and life events. Join the waitlist for launch updates.",
    keywords: ["personal loan", "unsecured loan"],
    priority: 0.55,
    changeFrequency: "monthly",
  },
  "/small-business": {
    path: "/small-business",
    title: "Small Business Banking | AWS Vision",
    description:
      "Business checking, credit, and lending solutions for growing companies. Savings, FD, and investment accounts available today.",
    keywords: ["small business banking", "business account"],
    priority: 0.6,
    changeFrequency: "monthly",
  },
  "/student-banking": {
    path: "/student-banking",
    title: "Student Banking | AWS Vision",
    description:
      "Banking and investment tools for students and young professionals. Student accounts launching soon — join the waitlist.",
    keywords: ["student banking", "student account"],
    priority: 0.5,
    changeFrequency: "monthly",
  },
  "/insurance": {
    path: "/insurance",
    title: "Insurance & Portfolio Protection",
    description:
      "Life, property, and Portfolio Shield protection for investment clients. Get a quote or speak with an advisor.",
    keywords: ["insurance", "portfolio protection"],
    priority: 0.55,
    changeFrequency: "monthly",
  },
  "/online-banking": {
    path: "/online-banking",
    title: "Online & Mobile Banking | AWS Vision",
    description:
      "Secure online banking, mobile app, bill pay, Zelle transfers, and investment portal access. Enroll in minutes.",
    keywords: ["online banking", "mobile banking", "bill pay", "Zelle"],
    priority: 0.7,
    changeFrequency: "monthly",
  },
  "/security": {
    path: "/security",
    title: "Security Center | Fraud Protection",
    description:
      "How AWS Vision protects your accounts with encryption, fraud monitoring, alerts, and biometric mobile sign-in.",
    keywords: ["bank security", "fraud protection", "account alerts"],
    priority: 0.6,
    changeFrequency: "monthly",
  },
  "/faq": {
    path: "/faq",
    title: "Frequently Asked Questions | AWS Vision",
    description:
      "Answers about opening accounts, deposits, withdrawals, monthly statements, investment plans, and client portal access.",
    keywords: ["FAQ", "help", "account questions"],
    priority: 0.65,
    changeFrequency: "monthly",
  },
  "/help": {
    path: "/help",
    title: "Help Center | AWS Vision Support",
    description:
      "Browse help topics, contact support, and get assistance with your AWS Vision accounts and investment portal.",
    keywords: ["help center", "customer support"],
    priority: 0.6,
    changeFrequency: "monthly",
  },
  "/financial-education": {
    path: "/financial-education",
    title: "Financial Education & Insights",
    description:
      "Guides on saving, investing, portfolio growth, and building long-term wealth with AWS Vision resources.",
    keywords: ["financial education", "investing tips", "wealth building"],
    priority: 0.55,
    changeFrequency: "monthly",
  },
  "/news": {
    path: "/news",
    title: "News & Insights | AWS Vision",
    description:
      "Latest news, market insights, and updates from AWS Vision investment and wealth management.",
    keywords: ["financial news", "market insights"],
    priority: 0.5,
    changeFrequency: "weekly",
  },
};

export const SITEMAP_PATHS = Object.keys(PAGE_SEO);
