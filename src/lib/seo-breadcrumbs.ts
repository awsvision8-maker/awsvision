import { PAGE_SEO } from "@/lib/seo-config";
import { SITE } from "@/lib/site-config";
import { getTexasCity } from "@/lib/texas-cities";
import { getUsState, getUsCity } from "@/lib/us-locations";

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
  compare: "Compare Banks & Firms",
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
  "investment-management": "Investment Management",
  "portfolio-management": "Portfolio Management",
  "financial-planning": "Financial Planning",
  "investment-advisory": "Investment Advisory",
  "asset-management": "Asset Management",
  locations: "Locations",
};

function labelForSegment(seg: string, builtPath: string): string {
  if (SEGMENT_LABELS[seg]) return SEGMENT_LABELS[seg];

  const page = PAGE_SEO[builtPath];
  if (page) {
    return page.title.split("|")[0].trim().replace(/ AWS Vision$/, "");
  }

  const texas = getTexasCity(seg);
  if (texas) return texas.name;

  const usState = getUsState(seg);
  if (usState) return usState.name;

  // /serving-united-states/{state}/{city}
  const parts = builtPath.split("/").filter(Boolean);
  if (parts[0] === "serving-united-states" && parts.length === 3) {
    const city = getUsCity(parts[1], parts[2]);
    if (city) return city.name;
  }

  return seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Build breadcrumb trail for a marketing path (includes intermediate hubs). */
export function breadcrumbsForPath(pathname: string): BreadcrumbItem[] {
  const normalized = pathname.split("?")[0].replace(/\/$/, "") || "/";
  const crumbs: BreadcrumbItem[] = [{ name: SITE.name, path: "/" }];

  if (normalized === "/") return crumbs;

  const segments = normalized.split("/").filter(Boolean);
  let built = "";
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    built += `/${seg}`;
    const isLast = i === segments.length - 1;
    // Skip intermediate segments that are not real pages (rare)
    if (!isLast && !PAGE_SEO[built] && !SEGMENT_LABELS[seg]) {
      // still include known location parents
      if (
        !(
          (segments[0] === "serving-united-states" && i === 1) ||
          (segments[0] === "serving-texas" && i === 1)
        )
      ) {
        continue;
      }
    }
    crumbs.push({
      name: labelForSegment(seg, built),
      path: built,
    });
  }
  return crumbs;
}
