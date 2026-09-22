import { PAGE_SEO } from "@/lib/seo-config";
import { SITE } from "@/lib/site-config";

export interface BreadcrumbItem {
  name: string;
  path: string;
}

const SEGMENT_LABELS: Record<string, string> = {
  personal: "Personal Banking",
  savings: "Savings Accounts",
  cds: "Fixed Deposits & CDs",
  checking: "Checking Accounts",
  signup: "Open an Account",
  nonprofit: "Non-Profit Program",
  "wealth-management": "Wealth Management",
  "home-loans": "Home Loans",
  "auto-loans": "Auto Loans",
  "personal-loans": "Personal Loans",
  "credit-cards": "Credit Cards",
  "small-business": "Small Business",
  "student-banking": "Student Banking",
  "online-banking": "Online Banking",
  "financial-education": "Financial Education",
  compare: "Compare Banks",
  rates: "Rates & Returns",
  contact: "Contact",
  about: "About",
  faq: "FAQ",
  help: "Help Center",
  news: "News",
  security: "Security",
  insurance: "Insurance",
  "serving-texas": "Serving Texas",
  "serving-united-states": "Serving the United States",
  "referral-program": "Referral Program",
  guides: "Investment Guides",
  dallas: "Dallas",
  houston: "Houston",
  austin: "Austin",
  "san-antonio": "San Antonio",
  "fort-worth": "Fort Worth",
  "investment-management": "Investment Management",
  "portfolio-management": "Portfolio Management",
  "financial-planning": "Financial Planning",
  "investment-advisory": "Investment Advisory",
  "asset-management": "Asset Management",
  locations: "Locations",
  "best-financial-firm-texas": "Best Financial Firm Texas",
  "best-financial-firm-usa": "Best Financial Firm USA",
  "best-investment-firm-texas": "Best Investment Firm Texas",
  "best-wealth-management-firm-texas": "Best Wealth Management Texas",
  "financial-advisor-near-me-texas": "Financial Advisor Near Me",
  "investment-advisor-near-me-texas": "Investment Advisor Near Me",
  "private-wealth-management-texas": "Private Wealth Texas",
  "asset-management-texas": "Asset Management Texas",
  "best-investment-firm-dallas": "Best Investment Firm Dallas",
  "best-financial-advisor-houston": "Best Financial Advisor Houston",
  "best-wealth-management-austin": "Best Wealth Management Austin",
  "investment-firm-near-me": "Investment Firm Near Me",
  "high-net-worth-financial-advisor-texas": "HNW Advisor Texas",
  "open-investment-account-online-usa": "Open an Account Online",
  "fixed-deposit-vs-savings": "FD vs Savings",
  "texas-online-wealth-management": "Texas Wealth Management",
  "how-monthly-profit-investing-works": "Monthly Profit Investing",
  "how-to-choose-investment-advisor-texas": "Choose an Investment Advisor",
  "how-to-choose-financial-advisor-texas": "Choose a Financial Advisor",
  "investment-advisor-vs-financial-advisor": "Advisor vs Financial Advisor",
  "wealth-management-vs-investment-management": "Wealth vs Investment Management",
  "what-does-investment-management-firm-do": "What Investment Firms Do",
  "how-does-portfolio-management-work": "How Portfolio Management Works",
  "how-to-build-diversified-investment-portfolio": "Diversified Portfolio",
  "how-to-manage-investment-risk": "Manage Investment Risk",
  "best-long-term-investment-strategies": "Long-Term Strategies",
  "how-much-does-financial-advisor-cost-texas": "Advisor Cost in Texas",
  "financial-planning-for-business-owners": "Business Owner Planning",
  "investment-strategies-high-net-worth": "High Net Worth Strategies",
  "preserve-wealth-market-volatility": "Wealth in Volatility",
  "retirement-planning-texas": "Retirement Planning Texas",
};

/** Build breadcrumb trail for a marketing path */
export function breadcrumbsForPath(pathname: string): BreadcrumbItem[] {
  const normalized = pathname.split("?")[0].replace(/\/$/, "") || "/";
  const crumbs: BreadcrumbItem[] = [{ name: SITE.name, path: "/" }];

  if (normalized === "/") return crumbs;

  const page = PAGE_SEO[normalized];
  if (page) {
    const segments = normalized.split("/").filter(Boolean);
    if (segments.length > 1) {
      const parentPath = `/${segments[0]}`;
      const parentLabel = SEGMENT_LABELS[segments[0]];
      if (parentLabel && PAGE_SEO[parentPath]) {
        crumbs.push({ name: parentLabel, path: parentPath });
      }
    }
    crumbs.push({
      name: page.title.split("|")[0].trim().replace(/ AWS Vision$/, ""),
      path: normalized,
    });
    return crumbs;
  }

  const segments = normalized.split("/").filter(Boolean);
  let built = "";
  for (const seg of segments) {
    built += `/${seg}`;
    const label = SEGMENT_LABELS[seg] ?? seg.replace(/-/g, " ");
    crumbs.push({ name: label, path: built });
  }
  return crumbs;
}
