export interface CreditCardProduct {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  tier: "standard" | "rewards" | "premium" | "student" | "business";
  annualFee: string;
  highlight: string;
  gradient: string;
  accent: string;
  textLight: boolean;
  features: string[];
}

export const CREDIT_CARD_PRODUCTS: CreditCardProduct[] = [
  {
    id: "customized-cash",
    name: "AWS Vision® Customized Cash Rewards",
    shortName: "Customized Cash",
    tagline: "Choose your 3% cash back category",
    tier: "rewards",
    annualFee: "$0",
    highlight: "6% in choice category — first year",
    gradient: "linear-gradient(135deg, #0f766e 0%, #047857 45%, #134e4a 100%)",
    accent: "#5eead4",
    textLight: true,
    features: [
      "3% + 3% first-year bonus in category of your choice",
      "2% at grocery stores and wholesale clubs",
      "Unlimited 1% on all other purchases",
      "0% intro APR for 15 billing cycles",
    ],
  },
  {
    id: "travel-rewards",
    name: "AWS Vision® Travel Rewards",
    shortName: "Travel Rewards",
    tagline: "Earn points on every purchase",
    tier: "rewards",
    annualFee: "$0",
    highlight: "25,000 bonus points offer",
    gradient: "linear-gradient(135deg, #1e40af 0%, #3730a3 50%, #1e3a8a 100%)",
    accent: "#93c5fd",
    textLight: true,
    features: [
      "Unlimited 1.5 points per $1 spent",
      "No foreign transaction fees",
      "Redeem for travel, cash back, or gift cards",
      "Travel accident insurance included",
    ],
  },
  {
    id: "unlimited-cash",
    name: "AWS Vision® Unlimited Cash Rewards",
    shortName: "Unlimited Cash",
    tagline: "Simple 1.5% back on everything",
    tier: "rewards",
    annualFee: "$0",
    highlight: "No category tracking required",
    gradient: "linear-gradient(135deg, #334155 0%, #0f766e 60%, #115e59 100%)",
    accent: "#99f6e4",
    textLight: true,
    features: [
      "Unlimited 1.5% cash back on every purchase",
      "No annual fee, no rotating categories",
      "Tap to Pay, Apple Pay, Google Pay ready",
      "Preferred Rewards bonus eligible",
    ],
  },
  {
    id: "premium-rewards",
    name: "AWS Vision® Premium Rewards",
    shortName: "Premium Rewards",
    tagline: "Premium travel & lifestyle benefits",
    tier: "premium",
    annualFee: "$95",
    highlight: "$100 annual travel credit",
    gradient: "linear-gradient(135deg, #78350f 0%, #b45309 40%, #1c1917 100%)",
    accent: "#fcd34d",
    textLight: true,
    features: [
      "2 points per $1 on travel and dining",
      "Airport lounge access — 4 visits/year",
      "$100 annual travel credit",
      "Trip cancellation & baggage delay insurance",
    ],
  },
  {
    id: "platinum-investor",
    name: "AWS Vision® Platinum Investor",
    shortName: "Platinum Investor",
    tagline: "Built for portfolio holders",
    tier: "premium",
    annualFee: "$195",
    highlight: "2% back on investment-linked spend",
    gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #334155 100%)",
    accent: "#cbd5e1",
    textLight: true,
    features: [
      "2% cash back on investment & brokerage spend",
      "Priority concierge & relationship manager",
      "Airport lounge access — unlimited",
      "No foreign transaction fees",
    ],
  },
  {
    id: "student",
    name: "AWS Vision® Student Credit Card",
    shortName: "Student Card",
    tagline: "Build credit responsibly",
    tier: "student",
    annualFee: "$0",
    highlight: "Designed for students under 25",
    gradient: "linear-gradient(135deg, #6d28d9 0%, #7c3aed 50%, #4c1d95 100%)",
    accent: "#c4b5fd",
    textLight: true,
    features: [
      "Responsible credit building tools",
      "Cash back on everyday purchases",
      "Financial education included",
      "Upgrade path to Customized Cash Rewards",
    ],
  },
  {
    id: "business-cash",
    name: "AWS Vision® Business Cash Rewards",
    shortName: "Business Cash",
    tagline: "Manage expenses, earn rewards",
    tier: "business",
    annualFee: "$0",
    highlight: "3% on office supply & telecom",
    gradient: "linear-gradient(135deg, #0c4a6e 0%, #0369a1 45%, #0f172a 100%)",
    accent: "#7dd3fc",
    textLight: true,
    features: [
      "3% cash back in business categories",
      "Employee card controls & spending limits",
      "QuickBooks & expense report integration",
      "Preferred Rewards for Business bonus",
    ],
  },
];

export const CREDIT_CARDS_LAUNCH_MESSAGE =
  "AWS Vision credit cards are coming soon. Preview our full card lineup below and join the waitlist to be notified at launch.";
