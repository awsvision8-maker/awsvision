import { Home, Car, Landmark, Briefcase, type LucideIcon } from "lucide-react";

export type LoanCategory = "home" | "auto" | "personal" | "business";

export interface LoanProduct {
  id: string;
  category: LoanCategory;
  name: string;
  shortName: string;
  tagline: string;
  rateLabel: string;
  gradient: string;
  accent: string;
  icon: LucideIcon;
  features: string[];
}

export const LOANS_LAUNCH_MESSAGE =
  "AWS Vision lending products are coming soon. Preview our home, auto, personal, and business loan options below and join the waitlist to be notified when applications open.";

export const LOAN_PRODUCTS: LoanProduct[] = [
  {
    id: "30-year-fixed",
    category: "home",
    name: "30-Year Fixed-Rate Mortgage",
    shortName: "30-Year Fixed",
    tagline: "Stable payments for the life of your loan",
    rateLabel: "Competitive fixed rates",
    gradient: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f766e 100%)",
    accent: "#5eead4",
    icon: Home,
    features: ["Fixed rate for 30 years", "Conventional, FHA, and VA options", "Digital Mortgage Experience®", "Home Loan Navigator® tracking"],
  },
  {
    id: "15-year-fixed",
    category: "home",
    name: "15-Year Fixed-Rate Mortgage",
    shortName: "15-Year Fixed",
    tagline: "Pay off faster, save on interest",
    rateLabel: "See today's rates",
    gradient: "linear-gradient(135deg, #1e293b 0%, #334155 50%, #115e59 100%)",
    accent: "#99f6e4",
    icon: Home,
    features: ["Lower total interest vs 30-year", "Build equity faster", "Refinance option online"],
  },
  {
    id: "heloc",
    category: "home",
    name: "Home Equity Line of Credit (HELOC)",
    shortName: "HELOC",
    tagline: "Tap your home equity when you need it",
    rateLabel: "Variable rate",
    gradient: "linear-gradient(135deg, #0c4a6e 0%, #0369a1 45%, #134e4a 100%)",
    accent: "#7dd3fc",
    icon: Home,
    features: ["Draw funds as needed", "Apply through mobile app", "PayPlan enrollment available"],
  },
  {
    id: "affordable-mortgage",
    category: "home",
    name: "Affordable Loan Solution®",
    shortName: "Affordable Loan",
    tagline: "Lower down payments for first-time buyers",
    rateLabel: "Special programs",
    gradient: "linear-gradient(135deg, #14532d 0%, #166534 50%, #0f172a 100%)",
    accent: "#86efac",
    icon: Home,
    features: ["Down payments as low as 3%", "Fixed-rate options", "Dedicated lending specialist"],
  },
  {
    id: "new-auto",
    category: "auto",
    name: "New Car Loan",
    shortName: "New Auto",
    tagline: "Finance your next vehicle",
    rateLabel: "Competitive fixed APR",
    gradient: "linear-gradient(135deg, #1e40af 0%, #3730a3 50%, #1e3a8a 100%)",
    accent: "#93c5fd",
    icon: Car,
    features: ["Terms up to 72 months", "Pre-qualify online", "No prepayment penalty"],
  },
  {
    id: "used-auto",
    category: "auto",
    name: "Used Car Loan",
    shortName: "Used Auto",
    tagline: "Dealer or private party purchase",
    rateLabel: "Competitive fixed APR",
    gradient: "linear-gradient(135deg, #334155 0%, #475569 50%, #0f766e 100%)",
    accent: "#cbd5e1",
    icon: Car,
    features: ["Vehicles up to 10 years old", "Private party supported", "Same-day approval available"],
  },
  {
    id: "auto-refinance",
    category: "auto",
    name: "Auto Refinance",
    shortName: "Auto Refi",
    tagline: "Lower your rate or payment",
    rateLabel: "Refinance rates",
    gradient: "linear-gradient(135deg, #0f766e 0%, #047857 45%, #134e4a 100%)",
    accent: "#5eead4",
    icon: Car,
    features: ["No application fee", "Apply 100% online", "Keep your current vehicle"],
  },
  {
    id: "personal-loan",
    category: "personal",
    name: "AWS Vision Personal Loan",
    shortName: "Personal Loan",
    tagline: "Fixed rate, predictable payments",
    rateLabel: "Fixed APR from 7.99%",
    gradient: "linear-gradient(135deg, #6d28d9 0%, #7c3aed 50%, #4c1d95 100%)",
    accent: "#c4b5fd",
    icon: Landmark,
    features: ["$5,000 to $100,000", "Terms 12–60 months", "No collateral required"],
  },
  {
    id: "debt-consolidation",
    category: "personal",
    name: "Debt Consolidation Loan",
    shortName: "Debt Consolidation",
    tagline: "Combine debts into one payment",
    rateLabel: "Fixed APR from 8.49%",
    gradient: "linear-gradient(135deg, #78350f 0%, #b45309 40%, #1c1917 100%)",
    accent: "#fcd34d",
    icon: Landmark,
    features: ["Single monthly payment", "Free debt review", "Direct pay to creditors option"],
  },
  {
    id: "portfolio-loan",
    category: "personal",
    name: "Portfolio-Backed Loan",
    shortName: "Portfolio Loan",
    tagline: "Borrow against your investments",
    rateLabel: "Fixed APR from 5.99%",
    gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #0f766e 100%)",
    accent: "#94a3b8",
    icon: Landmark,
    features: ["Up to 50% of portfolio value", "Terms up to 120 months", "Investments stay active"],
  },
  {
    id: "business-line",
    category: "business",
    name: "Business Line of Credit",
    shortName: "Business LOC",
    tagline: "Flexible working capital",
    rateLabel: "Variable from 9.99% APR",
    gradient: "linear-gradient(135deg, #0c4a6e 0%, #0369a1 45%, #0f172a 100%)",
    accent: "#7dd3fc",
    icon: Briefcase,
    features: ["Draw as needed", "QuickBooks integration", "Preferred Rewards for Business"],
  },
  {
    id: "business-term",
    category: "business",
    name: "Business Term Loan",
    shortName: "Business Term",
    tagline: "Fund expansion and equipment",
    rateLabel: "Fixed rates available",
    gradient: "linear-gradient(135deg, #134e4a 0%, #115e59 50%, #0f172a 100%)",
    accent: "#5eead4",
    icon: Briefcase,
    features: ["Terms 24–84 months", "Equipment financing", "0.25% Preferred Rewards discount"],
  },
];

export const LOAN_CATEGORY_META: Record<
  LoanCategory,
  { label: string; href: string; description: string }
> = {
  home: {
    label: "Home & Mortgage",
    href: "/home-loans",
    description: "Purchase, refinance, and home equity solutions",
  },
  auto: {
    label: "Auto Loans",
    href: "/auto-loans",
    description: "New, used, and refinance vehicle financing",
  },
  personal: {
    label: "Personal Loans",
    href: "/personal-loans",
    description: "Unsecured and portfolio-backed lending",
  },
  business: {
    label: "Business Loans",
    href: "/small-business#loans",
    description: "Lines of credit and term loans for business",
  },
};

export const PAGE_TO_CATEGORY: Record<string, LoanCategory> = {
  "home-loans": "home",
  "auto-loans": "auto",
  "personal-loans": "personal",
};

export function getLoansByCategory(category: LoanCategory) {
  return LOAN_PRODUCTS.filter((p) => p.category === category);
}
