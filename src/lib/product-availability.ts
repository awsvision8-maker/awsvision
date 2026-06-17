import {
  FIRM_SUMMARY,
  GRATUITY_MESSAGE,
  WHAT_WE_DO_NOT_OFFER,
} from "@/lib/firm-positioning";

/** Products clients can open today via /signup */
export const OPEN_ACCOUNT_TYPES = [
  {
    value: "savings" as const,
    label: "Savings Account",
    description: "Monthly and yearly gratuity on your savings balance",
    href: "/personal/savings",
  },
  {
    value: "fixed_deposit" as const,
    label: "Fixed Deposit (FD) Account",
    description: "Fixed term with monthly and yearly gratuity benefits",
    href: "/personal/cds",
  },
  {
    value: "investment" as const,
    label: "Investment Account",
    description: "Global sector investing with monthly profit distribution",
    href: "/wealth-management",
  },
];

export type OpenAccountType = (typeof OPEN_ACCOUNT_TYPES)[number]["value"];

export const OPEN_NOW_LABEL = "Available Now";
export const COMING_SOON_LABEL = "Opening Soon";

export const OPEN_NOW_MESSAGE = FIRM_SUMMARY;

export const COMING_SOON_MESSAGE =
  "Credit cards, loans, insurance, and other banking products are not part of our current offering. " +
  WHAT_WE_DO_NOT_OFFER +
  " Join the waitlist if you are interested in future products.";

/** Marketing / service page keys */
export const OPEN_NOW_PAGES = new Set([
  "savings",
  "cds",
  "wealth-management",
  "nonprofit",
]);

export const COMING_SOON_PAGES = new Set([
  "credit-cards",
  "home-loans",
  "auto-loans",
  "personal-loans",
  "insurance",
  "student-banking",
  "small-business",
  "online-banking",
]);

/** Not offered — separate from coming soon */
export const NOT_OFFERED_PAGES = new Set(["checking"]);

export const WAITLIST_HREF = "/contact#coming-soon";

export { GRATUITY_MESSAGE };

export function isOpenNow(pageKey: string) {
  return OPEN_NOW_PAGES.has(pageKey);
}

export function isComingSoon(pageKey: string) {
  return COMING_SOON_PAGES.has(pageKey);
}

export function isNotOffered(pageKey: string) {
  return NOT_OFFERED_PAGES.has(pageKey);
}
