import { FAQ_CATEGORIES } from "@/lib/boa-content";
import { FIRM_SUMMARY, WHAT_WE_DO_NOT_OFFER, WHAT_WE_OFFER } from "@/lib/firm-positioning";
import { INVESTMENT_PLANS, formatUsd } from "@/lib/investment-plans";
import { SITE, formatSitePhones, formatSitePhonesMultiline, formatUsHeadquarters } from "@/lib/site-config";

export interface BotKnowledgeEntry {
  id: string;
  keywords: string[];
  answer: string;
}

const PLAN_SUMMARY = INVESTMENT_PLANS.map(
  (p) =>
    `${p.name}: ${p.monthlyRate}% monthly profit, ${p.termMonths}-month term, minimum ${formatUsd(p.minInvestment)} (${p.totalReturnLabel})`
).join(". ");

const PORTAL_RULES: BotKnowledgeEntry[] = [
  {
    id: "signup-balance",
    keywords: ["signup", "sign up", "register", "new account", "starting balance", "zero balance", "0 balance"],
    answer:
      "When you sign up, your account starts at $0. Complete KYC verification, then submit a deposit request from your portal. Our team reviews and approves deposits before funds are credited.",
  },
  {
    id: "kyc",
    keywords: ["kyc", "verification", "verify", "identity", "id upload", "selfie", "documents"],
    answer:
      "After signup you'll complete KYC (ID and selfie). Our compliance team reviews and approves verification — you'll get portal access once KYC is approved. You can check status at awsvision.com/kyc or in your dashboard.",
  },
  {
    id: "deposit-pending",
    keywords: ["deposit", "fund", "add money", "transfer in", "pending deposit", "deposit approval"],
    answer:
      "Deposits are submitted from Portal → Deposit. Each request stays pending until our team approves it — once approved, your balance updates and your investment tier is matched automatically. You'll see pending status in your dashboard until approval.",
  },
  {
    id: "profit-30-day",
    keywords: ["profit", "when profit", "30 day", "30 days", "accrual", "earn", "returns start"],
    answer:
      "Monthly profit accrual begins 30 days after your first approved deposit. Your dashboard shows estimated profit and which month payouts will be delivered. Rates depend on your approved investment tier.",
  },
  {
    id: "tier-upgrade",
    keywords: ["tier", "upgrade", "plan change", "higher rate", "additional deposit", "next month"],
    answer:
      "If you make an additional approved deposit that qualifies for a higher tier, the new profit rate applies from the first day of the next calendar month — your dashboard will show when the upgrade takes effect.",
  },
  {
    id: "withdrawal",
    keywords: ["withdraw", "withdrawal", "cash out", "take out", "payout request"],
    answer:
      "Submit withdrawal requests from Portal → Withdraw. Each request is reviewed by our team before funds are released. Processing times depend on your method and account type.",
  },
  {
    id: "portal",
    keywords: ["portal", "dashboard", "client portal", "login", "sign in", "online banking"],
    answer:
      "Sign in at awsvision.com/login to access your client portal — view balances, portfolio charts, statements, deposit and withdrawal requests, and account settings. KYC must be approved before full portal access.",
  },
  {
    id: "logout-inactivity",
    keywords: ["logout", "session", "timeout", "inactive", "auto logout"],
    answer:
      "For your security, the client portal signs you out after a short period of inactivity. Simply log in again at awsvision.com/login to continue.",
  },
];

const SITE_ENTRIES: BotKnowledgeEntry[] = [
  {
    id: "about",
    keywords: ["what is aws vision", "about", "who are you", "company", "firm"],
    answer: FIRM_SUMMARY,
  },
  {
    id: "products",
    keywords: ["accounts", "products", "offer", "savings", "fixed deposit", "fd", "cds", "investment"],
    answer: `${WHAT_WE_OFFER.map((o) => `${o.title}: ${o.description}`).join(" ")} ${WHAT_WE_DO_NOT_OFFER}`,
  },
  {
    id: "plans",
    keywords: ["plan", "plans", "silver", "gold", "diamond", "platinum", "premium", "executive", "rate", "rates", "roi", "return", "invest"],
    answer: `We offer six investment plans from Silver to Executive. ${PLAN_SUMMARY}. Compare tiers at awsvision.com/compare or awsvision.com/rates.`,
  },
  {
    id: "contact",
    keywords: ["contact", "phone", "email", "call", "reach", "hours", "support hours", "office", "address"],
    answer: `You can reach us at ${formatSitePhones(" or ")} or ${SITE.email}. Our U.S. support hours are ${SITE.supportHours}. Our offices: ${formatUsHeadquarters()}.`,
  },
  {
    id: "signup-how",
    keywords: ["how to open", "open account", "get started", "apply", "enroll"],
    answer:
      "Open an account at awsvision.com/signup — it takes about 10–15 minutes. You'll need a valid ID, Social Security number, and contact details. Complete KYC, then submit your first deposit from the portal.",
  },
  {
    id: "nonprofit",
    keywords: ["nonprofit", "non-profit", "charity", "organization", "501"],
    answer:
      "Nonprofit organizations can apply at awsvision.com/signup/nonprofit with your EIN, mission statement, and representative details. Our team will review your application.",
  },
  {
    id: "compare",
    keywords: ["compare", "competitor", "vs", "versus", "better than"],
    answer:
      "See how AWS Vision compares to traditional banks at awsvision.com/compare — including our structured monthly profit tiers and global sector diversification.",
  },
  {
    id: "security",
    keywords: ["secure", "security", "safe", "fraud", "fdic", "insured", "encryption"],
    answer:
      "We use bank-grade 256-bit encryption and continuous fraud monitoring. Deposit products are FDIC insured up to $250,000 per depositor. Investment products are not FDIC insured and may lose value. Report fraud immediately at " +
      formatSitePhones(" or ") +
      ".",
  },
  {
    id: "statements",
    keywords: ["statement", "statements", "download", "pdf", "history"],
    answer:
      "Download monthly statements from Portal → Statements. PDFs include full transaction details, profit credits, and portfolio activity.",
  },
  {
    id: "charts",
    keywords: ["chart", "portfolio", "growth", "track", "performance", "holdings"],
    answer:
      "Your portal dashboard includes real-time portfolio charts — sector allocation, geographic breakdown, growth over time, and estimated profit delivery month.",
  },
  {
    id: "loans",
    keywords: ["loan", "mortgage", "home loan", "auto loan", "credit card"],
    answer:
      "We offer home loans, auto loans, personal loans, and credit cards. Explore options at awsvision.com/home-loans, awsvision.com/auto-loans, or awsvision.com/credit-cards.",
  },
  {
    id: "appointment",
    keywords: ["appointment", "schedule", "meet", "advisor", "consultation"],
    answer:
      "Schedule a consultation at awsvision.com/contact — choose your preferred date and topic, and our team will follow up to confirm.",
  },
  {
    id: "faq-page",
    keywords: ["faq", "questions", "help center", "help"],
    answer:
      "Browse our full FAQ at awsvision.com/faq or the Help Center at awsvision.com/help for answers on accounts, investments, and online banking.",
  },
];

function faqEntries(): BotKnowledgeEntry[] {
  const entries: BotKnowledgeEntry[] = [];
  for (const cat of FAQ_CATEGORIES) {
    for (const item of cat.items) {
      const words = item.q
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 3);
      entries.push({
        id: `faq-${entries.length}`,
        keywords: words,
        answer: item.a,
      });
    }
  }
  return entries;
}

export const BOT_KNOWLEDGE: BotKnowledgeEntry[] = [
  ...PORTAL_RULES,
  ...SITE_ENTRIES,
  ...faqEntries(),
];
