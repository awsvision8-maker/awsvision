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
