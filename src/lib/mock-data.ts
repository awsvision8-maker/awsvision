import type {
  Account,
  InvestmentHolding,
  MonthlyStatement,
  ProductApplication,
  Transaction,
  User,
} from "@/types";

export const DEMO_USER: User = {
  id: "usr_001",
  email: "client@awsvision.com",
  firstName: "Sarah",
  lastName: "Mitchell",
  phone: "+1 (469) 754-2201",
  kycStatus: "verified",
  createdAt: "2024-03-15T10:00:00Z",
};

export const DEMO_ACCOUNTS: Account[] = [
  {
    id: "acc_001",
    accountNumber: "AV7829345610",
    type: "savings",
    balance: 125840.5,
    interestRate: 8.5,
    status: "active",
    createdAt: "2024-03-20T10:00:00Z",
  },
  {
    id: "acc_002",
    accountNumber: "AV7829345611",
    type: "fixed_deposit",
    balance: 250000,
    interestRate: 12.0,
    maturityDate: "2026-03-20",
    status: "active",
    createdAt: "2024-06-01T10:00:00Z",
  },
  {
    id: "acc_003",
    accountNumber: "AV7829345612",
    type: "investment",
    balance: 375000,
    interestRate: 4.0,
    investmentPlanId: "diamond",
    status: "active",
    createdAt: "2024-09-01T10:00:00Z",
  },
];

export const DEMO_HOLDINGS: InvestmentHolding[] = [
  {
    id: "h1",
    name: "Global Tech Growth Fund",
    sector: "Technology",
    region: "North America",
    symbol: "GTGF",
    allocation: 22,
    value: 82500,
    monthlyReturn: 1.8,
    ytdReturn: 14.2,
  },
  {
    id: "h2",
    name: "European Green Energy ETF",
    sector: "Energy",
    region: "Europe",
    symbol: "EGEE",
    allocation: 18,
    value: 67500,
    monthlyReturn: 1.2,
    ytdReturn: 9.8,
  },
  {
    id: "h3",
    name: "Asia Pacific Real Estate Trust",
    sector: "Real Estate",
    region: "Asia Pacific",
    symbol: "APRT",
    allocation: 15,
    value: 56250,
    monthlyReturn: 0.9,
    ytdReturn: 7.5,
  },
  {
    id: "h4",
    name: "Emerging Markets Equity Fund",
    sector: "Equities",
    region: "Emerging Markets",
    symbol: "EMEF",
    allocation: 20,
    value: 75000,
    monthlyReturn: 2.1,
    ytdReturn: 16.4,
  },
  {
    id: "h5",
    name: "US Treasury & Bond Portfolio",
    sector: "Fixed Income",
    region: "North America",
    symbol: "USTB",
    allocation: 12,
    value: 45000,
    monthlyReturn: 0.6,
    ytdReturn: 4.2,
  },
  {
    id: "h6",
    name: "Healthcare Innovation Fund",
    sector: "Healthcare",
    region: "Global",
    symbol: "HCIF",
    allocation: 13,
    value: 48750,
    monthlyReturn: 1.5,
    ytdReturn: 11.3,
  },
];

export const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: "tx_001",
    accountId: "acc_001",
    type: "deposit",
    amount: 50000,
    description: "Wire Transfer - Chase Bank",
    status: "completed",
    date: "2025-05-28T14:30:00Z",
  },
  {
    id: "tx_002",
    accountId: "acc_001",
    type: "profit",
    amount: 1847.25,
    description: "May 2025 Monthly Profit Distribution",
    status: "completed",
    date: "2025-05-31T00:00:00Z",
  },
  {
    id: "tx_003",
    accountId: "acc_002",
    type: "deposit",
    amount: 250000,
    description: "Fixed Deposit Opening",
    status: "completed",
    date: "2024-06-01T10:00:00Z",
  },
  {
    id: "tx_004",
    accountId: "acc_001",
    type: "withdrawal",
    amount: 5000,
    description: "Withdrawal Request #WR-2847",
    status: "pending",
    date: "2025-06-01T09:15:00Z",
  },
  {
    id: "tx_005",
    accountId: "acc_001",
    type: "profit",
    amount: 1723.5,
    description: "April 2025 Monthly Profit Distribution",
    status: "completed",
    date: "2025-04-30T00:00:00Z",
  },
  {
    id: "tx_006",
    accountId: "acc_001",
    type: "deposit",
    amount: 25000,
    description: "ACH Transfer",
    status: "completed",
    date: "2025-04-15T11:00:00Z",
  },
];

export const MONTHLY_PROFIT_DATA = [
  { month: "Jul", profit: 1245, balance: 98500 },
  { month: "Aug", profit: 1380, balance: 101200 },
  { month: "Sep", profit: 1520, balance: 104800 },
  { month: "Oct", profit: 1410, balance: 108500 },
  { month: "Nov", profit: 1650, balance: 112300 },
  { month: "Dec", profit: 1890, balance: 116800 },
  { month: "Jan", profit: 1580, balance: 119500 },
  { month: "Feb", profit: 1720, balance: 122800 },
  { month: "Mar", profit: 1810, balance: 126200 },
  { month: "Apr", profit: 1723, balance: 128500 },
  { month: "May", profit: 1847, balance: 131200 },
  { month: "Jun", profit: 1920, balance: 134120 },
];

export const PORTFOLIO_GROWTH_DATA = [
  { date: "2024-07", value: 75000 },
  { date: "2024-08", value: 78500 },
  { date: "2024-09", value: 82200 },
  { date: "2024-10", value: 85800 },
  { date: "2024-11", value: 89500 },
  { date: "2024-12", value: 94200 },
  { date: "2025-01", value: 98500 },
  { date: "2025-02", value: 103800 },
  { date: "2025-03", value: 112500 },
  { date: "2025-04", value: 128500 },
  { date: "2025-05", value: 375840 },
];

export const SECTOR_ALLOCATION = [
  { name: "Technology", value: 22, color: "#0ea5e9" },
  { name: "Equities", value: 20, color: "#8b5cf6" },
  { name: "Energy", value: 18, color: "#10b981" },
  { name: "Real Estate", value: 15, color: "#f59e0b" },
  { name: "Healthcare", value: 13, color: "#ef4444" },
  { name: "Fixed Income", value: 12, color: "#6366f1" },
];

export const REGION_ALLOCATION = [
  { name: "North America", value: 34 },
  { name: "Europe", value: 18 },
  { name: "Asia Pacific", value: 15 },
  { name: "Emerging Markets", value: 20 },
  { name: "Global", value: 13 },
];

export const DEMO_STATEMENTS: MonthlyStatement[] = [
  {
    id: "stmt_may_2025",
    month: "May",
    year: 2025,
    openingBalance: 128500,
    closingBalance: 131200,
    totalDeposits: 0,
    totalWithdrawals: 0,
    profitEarned: 1847.25,
    annualizedReturn: 8.5,
  },
  {
    id: "stmt_apr_2025",
    month: "April",
    year: 2025,
    openingBalance: 126200,
    closingBalance: 128500,
    totalDeposits: 25000,
    totalWithdrawals: 0,
    profitEarned: 1723.5,
    annualizedReturn: 8.2,
  },
  {
    id: "stmt_mar_2025",
    month: "March",
    year: 2025,
    openingBalance: 122800,
    closingBalance: 126200,
    totalDeposits: 0,
    totalWithdrawals: 0,
    profitEarned: 1810,
    annualizedReturn: 8.0,
  },
];

export const DEMO_APPLICATIONS: ProductApplication[] = [
  {
    id: "app_001",
    productType: "credit_card",
    productName: "AWS Vision Platinum Card",
    status: "approved",
    submittedAt: "2025-04-10T10:00:00Z",
  },
  {
    id: "app_002",
    productType: "loan",
    productName: "Personal Investment Loan",
    amount: 50000,
    status: "under_review",
    submittedAt: "2025-05-20T14:00:00Z",
  },
];

export const RETURN_TIERS = [
  { min: 1000, max: 9999, rate: 6.0, label: "Starter" },
  { min: 10000, max: 49999, rate: 7.5, label: "Growth" },
  { min: 50000, max: 99999, rate: 8.5, label: "Premium" },
  { min: 100000, max: 249999, rate: 9.5, label: "Elite" },
  { min: 250000, max: Infinity, rate: 12.0, label: "Platinum FD" },
];

export function getAnnualizedReturn(balance: number): number {
  const tier = RETURN_TIERS.find(
    (t) => balance >= t.min && balance <= t.max
  );
  return tier?.rate ?? 6.0;
}

export function getMonthlyProfit(balance: number): number {
  return (balance * (getAnnualizedReturn(balance) / 100)) / 12;
}
