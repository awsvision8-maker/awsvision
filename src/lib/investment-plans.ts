export interface InvestmentPlan {
  id: string;
  name: string;
  /** Monthly profit rate (%) */
  monthlyRate: number;
  termMonths: number;
  totalRoiPercent: number;
  minInvestment: number;
  maxEarnings: number;
  totalReturnLabel: string;
  compoundInterest: boolean;
  holdCapitalReinvest: boolean;
  /** Subtle accent for banking-style tier cards */
  accentClass: string;
  borderClass: string;
}

/** Official AWS Vision investment plans — synced with awsvision.com/portal */
export const INVESTMENT_PLANS: InvestmentPlan[] = [
  {
    id: "silver",
    name: "Silver",
    monthlyRate: 2.0,
    termMonths: 24,
    totalRoiPercent: 48,
    minInvestment: 5000,
    maxEarnings: 2400,
    totalReturnLabel: "Capital + 48%",
    compoundInterest: true,
    holdCapitalReinvest: true,
    accentClass: "bg-slate-600",
    borderClass: "border-slate-300",
  },
  {
    id: "gold",
    name: "Gold",
    monthlyRate: 3.0,
    termMonths: 24,
    totalRoiPercent: 72,
    minInvestment: 10000,
    maxEarnings: 7200,
    totalReturnLabel: "Capital + 72%",
    compoundInterest: true,
    holdCapitalReinvest: true,
    accentClass: "bg-amber-600",
    borderClass: "border-amber-200",
  },
  {
    id: "diamond",
    name: "Diamond",
    monthlyRate: 4.0,
    termMonths: 24,
    totalRoiPercent: 96,
    minInvestment: 30000,
    maxEarnings: 28800,
    totalReturnLabel: "Capital + 96%",
    compoundInterest: true,
    holdCapitalReinvest: true,
    accentClass: "bg-teal-600",
    borderClass: "border-teal-200",
  },
  {
    id: "platinum",
    name: "Platinum",
    monthlyRate: 5.0,
    termMonths: 36,
    totalRoiPercent: 180,
    minInvestment: 50000,
    maxEarnings: 90000,
    totalReturnLabel: "Capital + 180%",
    compoundInterest: true,
    holdCapitalReinvest: true,
    accentClass: "bg-sky-700",
    borderClass: "border-sky-200",
  },
  {
    id: "premium-diamond",
    name: "Premium Diamond",
    monthlyRate: 6.0,
    termMonths: 36,
    totalRoiPercent: 216,
    minInvestment: 70000,
    maxEarnings: 151200,
    totalReturnLabel: "Capital + 216%",
    compoundInterest: true,
    holdCapitalReinvest: true,
    accentClass: "bg-violet-700",
    borderClass: "border-violet-200",
  },
  {
    id: "executive",
    name: "Executive",
    monthlyRate: 7.0,
    termMonths: 60,
    totalRoiPercent: 420,
    minInvestment: 100000,
    maxEarnings: 420000,
    totalReturnLabel: "Capital + 420%",
    compoundInterest: true,
    holdCapitalReinvest: true,
    accentClass: "bg-slate-900",
    borderClass: "border-slate-400",
  },
];

export const INVESTMENT_HOW_IT_WORKS = [
  {
    step: 1,
    title: "Create Account",
    description: "Open your investment account with valid KYC information.",
  },
  {
    step: 2,
    title: "Add Funds",
    description: "Deposit capital using our supported payment channels.",
  },
  {
    step: 3,
    title: "Select Investment Plan",
    description: "Choose a tier that matches your capital and return objectives.",
  },
  {
    step: 4,
    title: "Receive Monthly Profit",
    description: "Withdraw monthly profit or reinvest — compound interest available.",
  },
] as const;

export function getInvestmentPlan(id: string | undefined) {
  return INVESTMENT_PLANS.find((p) => p.id === id);
}

export function formatUsd(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
