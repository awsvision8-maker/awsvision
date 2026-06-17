import type {
  Account,
  InvestmentHolding,
  MonthlyStatement,
  NonprofitProfile,
  PortfolioAccount,
  SignupApplication,
  Transaction,
  User,
  UserPortfolio,
} from "@/types";
import { getInvestmentPlan, INVESTMENT_PLANS } from "@/lib/investment-plans";
import { getAnnualizedReturn, RETURN_TIERS } from "@/lib/mock-data";
import { FD_PROMO_TERMS } from "@/lib/promotions";

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const SECTOR_ALLOCATION = [
  { name: "Technology", value: 22, color: "#0ea5e9" },
  { name: "Equities", value: 20, color: "#8b5cf6" },
  { name: "Energy", value: 18, color: "#10b981" },
  { name: "Real Estate", value: 15, color: "#f59e0b" },
  { name: "Healthcare", value: 13, color: "#ef4444" },
  { name: "Fixed Income", value: 12, color: "#6366f1" },
];

const HOLDING_TEMPLATES: Omit<InvestmentHolding, "value" | "monthlyReturn" | "ytdReturn">[] = [
  {
    id: "h1",
    name: "Global Tech Growth Fund",
    sector: "Technology",
    region: "North America",
    symbol: "GTGF",
    allocation: 22,
  },
  {
    id: "h2",
    name: "European Green Energy ETF",
    sector: "Energy",
    region: "Europe",
    symbol: "EGEE",
    allocation: 18,
  },
  {
    id: "h3",
    name: "Asia Pacific Real Estate Trust",
    sector: "Real Estate",
    region: "Asia Pacific",
    symbol: "APRT",
    allocation: 15,
  },
  {
    id: "h4",
    name: "Emerging Markets Equity Fund",
    sector: "Equities",
    region: "Emerging Markets",
    symbol: "EMEF",
    allocation: 20,
  },
  {
    id: "h5",
    name: "US Treasury & Bond Portfolio",
    sector: "Fixed Income",
    region: "North America",
    symbol: "USTB",
    allocation: 12,
  },
  {
    id: "h6",
    name: "Healthcare Innovation Fund",
    sector: "Healthcare",
    region: "Global",
    symbol: "HCIF",
    allocation: 13,
  },
];

function generateAccountNumber() {
  return `AV${Math.floor(1000000000 + Math.random() * 9000000000)}`;
}

function incomeToOpeningDeposit(annualIncome: string): number {
  const map: Record<string, number> = {
    under_25k: 1_000,
    "25k_50k": 5_000,
    "50k_100k": 10_000,
    "100k_250k": 25_000,
    "250k_plus": 50_000,
  };
  return map[annualIncome] ?? 1_000;
}

export function resolveMonthlyRate(
  account: Pick<PortfolioAccount, "type" | "monthlyRatePercent" | "investmentPlanId" | "principal">
): number {
  if (account.type === "nonprofit_fund") return account.monthlyRatePercent;
  if (account.type === "investment" || account.type === "fixed_deposit") {
    const plan = getInvestmentPlan(account.investmentPlanId);
    if (plan) return plan.monthlyRate;
    return account.monthlyRatePercent;
  }
  return getAnnualizedReturn(account.principal) / 12;
}

function addMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthsElapsed(from: Date, to: Date) {
  return (
    (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth())
  );
}

export interface AccountGrowthResult {
  balance: number;
  monthlyProfit: number;
  annualReturnPercent: number;
  profitHistory: { month: string; profit: number; balance: number; date: Date }[];
}

/** Apply monthly program rate + deposits chronologically */
export function computeAccountGrowth(
  account: PortfolioAccount,
  transactions: Transaction[],
  asOf = new Date()
): AccountGrowthResult {
  const rate = resolveMonthlyRate(account);
  const accountTx = transactions
    .filter((t) => t.accountId === account.id && t.status === "completed")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const start = new Date(account.createdAt);
  const totalMonths = Math.max(0, monthsElapsed(start, asOf));

  let balance = 0;
  const profitHistory: AccountGrowthResult["profitHistory"] = [];

  for (let m = 0; m <= totalMonths; m++) {
    const periodStart = addMonths(start, m);
    const periodEnd = addMonths(start, m + 1);

    for (const tx of accountTx) {
      const txDate = new Date(tx.date);
      if (txDate >= periodStart && txDate < periodEnd && tx.type === "deposit") {
        balance += tx.amount;
      }
    }

    if (balance > 0) {
      const profit = (balance * rate) / 100;
      balance += profit;
      profitHistory.push({
        month: MONTH_LABELS[periodStart.getMonth()],
        profit: Math.round(profit * 100) / 100,
        balance: Math.round(balance * 100) / 100,
        date: new Date(periodStart),
      });
    }
  }

  const monthlyProfit = balance > 0 ? (balance * rate) / 100 : 0;
  const annualReturnPercent =
    account.type === "savings"
      ? getAnnualizedReturn(balance)
      : Math.round(rate * 12 * 100) / 100;

  return {
    balance: Math.round(balance * 100) / 100,
    monthlyProfit: Math.round(monthlyProfit * 100) / 100,
    annualReturnPercent,
    profitHistory,
  };
}

export function createAccountFromSignup(data: SignupApplication, createdAt = new Date()): {
  account: PortfolioAccount;
  openingTransaction: Transaction;
} {
  const plan = getInvestmentPlan(data.investmentPlanId);
  const planId =
    data.accountType === "investment"
      ? plan?.id ?? "silver"
      : data.accountType === "fixed_deposit"
        ? plan?.id ?? "gold"
        : undefined;

  const selectedPlan = plan ?? getInvestmentPlan(planId);

  let principal: number;
  let monthlyRatePercent: number;
  let maturityDate: string | undefined;

  if (data.accountType === "investment" && selectedPlan) {
    principal = selectedPlan.minInvestment;
    monthlyRatePercent = selectedPlan.monthlyRate;
    maturityDate = addMonths(createdAt, selectedPlan.termMonths).toISOString();
  } else if (data.accountType === "fixed_deposit") {
    if (selectedPlan) {
      principal = Math.max(selectedPlan.minInvestment, FD_PROMO_TERMS.minDeposit);
      monthlyRatePercent = selectedPlan.monthlyRate;
      maturityDate = addMonths(createdAt, selectedPlan.termMonths).toISOString();
    } else {
      principal = FD_PROMO_TERMS.minDeposit;
      monthlyRatePercent = FD_PROMO_TERMS.returnPercent / FD_PROMO_TERMS.termMonths;
      maturityDate = addMonths(createdAt, FD_PROMO_TERMS.termMonths).toISOString();
    }
  } else {
    principal = incomeToOpeningDeposit(data.annualIncome);
    monthlyRatePercent = getAnnualizedReturn(principal) / 12;
  }

  const accountId = `acc_${Date.now()}`;
  const account: PortfolioAccount = {
    id: accountId,
    accountNumber: generateAccountNumber(),
    type: data.accountType,
    principal,
    monthlyRatePercent,
    investmentPlanId: planId,
    createdAt: createdAt.toISOString(),
    maturityDate,
    status: "active",
  };

  const openingTransaction: Transaction = {
    id: `tx_${Date.now()}`,
    accountId,
    type: "deposit",
    amount: principal,
    description:
      data.accountType === "investment"
        ? `Initial ${selectedPlan?.name ?? "Investment"} plan enrollment`
        : data.accountType === "fixed_deposit"
          ? "Fixed Deposit account opening"
          : "Savings account opening deposit",
    status: "completed",
    date: createdAt.toISOString(),
  };

  return { account, openingTransaction };
}

export function createNonprofitPortfolio(
  profile: NonprofitProfile,
  createdAt = new Date()
): UserPortfolio {
  const accountId = `acc_np_${Date.now()}`;
  const account: PortfolioAccount = {
    id: accountId,
    accountNumber: generateAccountNumber(),
    type: "nonprofit_fund",
    principal: profile.fundCapital,
    monthlyRatePercent: profile.monthlyRate,
    createdAt: createdAt.toISOString(),
    status: "active",
  };

  return {
    accounts: [account],
    transactions: [
      {
        id: `tx_${Date.now()}`,
        accountId,
        type: "deposit",
        amount: profile.fundCapital,
        description: `Non-profit fund enrollment — ${profile.organizationLegalName}`,
        status: "completed",
        date: createdAt.toISOString(),
      },
    ],
  };
}

export function createDemoPortfolio(): UserPortfolio {
  const savingsId = "acc_001";
  const fdId = "acc_002";
  const invId = "acc_003";
  const diamond = getInvestmentPlan("diamond")!;

  return {
    accounts: [
      {
        id: savingsId,
        accountNumber: "AV7829345610",
        type: "savings",
        principal: 75000,
        monthlyRatePercent: getAnnualizedReturn(75000) / 12,
        createdAt: "2024-03-20T10:00:00Z",
        status: "active",
      },
      {
        id: fdId,
        accountNumber: "AV7829345611",
        type: "fixed_deposit",
        principal: 250000,
        monthlyRatePercent: getInvestmentPlan("platinum")!.monthlyRate,
        investmentPlanId: "platinum",
        createdAt: "2024-06-01T10:00:00Z",
        maturityDate: "2027-06-01T10:00:00Z",
        status: "active",
      },
      {
        id: invId,
        accountNumber: "AV7829345612",
        type: "investment",
        principal: 300000,
        monthlyRatePercent: diamond.monthlyRate,
        investmentPlanId: "diamond",
        createdAt: "2024-09-01T10:00:00Z",
        maturityDate: "2026-09-01T10:00:00Z",
        status: "active",
      },
    ],
    transactions: [
      {
        id: "tx_001",
        accountId: savingsId,
        type: "deposit",
        amount: 50000,
        description: "Wire Transfer - Chase Bank",
        status: "completed",
        date: "2024-04-15T11:00:00Z",
      },
      {
        id: "tx_003",
        accountId: fdId,
        type: "deposit",
        amount: 250000,
        description: "Fixed Deposit Opening",
        status: "completed",
        date: "2024-06-01T10:00:00Z",
      },
      {
        id: "tx_006",
        accountId: savingsId,
        type: "deposit",
        amount: 25000,
        description: "ACH Transfer",
        status: "completed",
        date: "2025-04-15T11:00:00Z",
      },
      {
        id: "tx_open_sav",
        accountId: savingsId,
        type: "deposit",
        amount: 75000,
        description: "Savings account opening deposit",
        status: "completed",
        date: "2024-03-20T10:00:00Z",
      },
      {
        id: "tx_open_inv",
        accountId: invId,
        type: "deposit",
        amount: 300000,
        description: `Initial ${diamond.name} plan enrollment`,
        status: "completed",
        date: "2024-09-01T10:00:00Z",
      },
    ],
  };
}

export function portfolioAccountToDisplay(
  account: PortfolioAccount,
  growth: AccountGrowthResult
): Account {
  const annualRate =
    account.type === "savings"
      ? growth.annualReturnPercent
      : resolveMonthlyRate(account) * 12;

  return {
    id: account.id,
    accountNumber: account.accountNumber,
    type: account.type,
    balance: growth.balance,
    interestRate: Math.round(annualRate * 100) / 100,
    investmentPlanId: account.investmentPlanId,
    maturityDate: account.maturityDate,
    status: account.status,
    createdAt: account.createdAt,
  };
}

export interface PortfolioSnapshot {
  accounts: Account[];
  portfolioAccounts: PortfolioAccount[];
  transactions: Transaction[];
  totalBalance: number;
  monthlyProfit: number;
  annualReturn: number;
  ytdGrowthPercent: number;
  monthlyProfitChart: { month: string; profit: number; balance: number }[];
  portfolioGrowthChart: { date: string; value: number }[];
  sectorAllocation: typeof SECTOR_ALLOCATION;
  holdings: InvestmentHolding[];
  statements: MonthlyStatement[];
  primaryPlanId?: string;
}

export function buildPortfolioSnapshot(
  user: User | null,
  asOf = new Date()
): PortfolioSnapshot {
  const portfolio = user?.portfolio ?? createDemoPortfolio();
  const isNonprofit = user?.profileType === "nonprofit";

  if (isNonprofit && user?.nonprofitProfile && portfolio.accounts.length === 0) {
    const np = createNonprofitPortfolio(user.nonprofitProfile, new Date(user.createdAt));
    portfolio.accounts = np.accounts;
    portfolio.transactions = np.transactions;
  }

  const accountResults = portfolio.accounts.map((acc) => ({
    account: acc,
    growth: computeAccountGrowth(acc, portfolio.transactions, asOf),
  }));

  const accounts = accountResults.map(({ account, growth }) =>
    portfolioAccountToDisplay(account, growth)
  );

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const monthlyProfit = accountResults.reduce((s, r) => s + r.growth.monthlyProfit, 0);

  const weightedAnnual =
    totalBalance > 0
      ? accountResults.reduce(
          (s, r) => s + r.growth.annualReturnPercent * r.growth.balance,
          0
        ) / totalBalance
      : 0;

  const allHistory = accountResults.flatMap((r) =>
    r.growth.profitHistory.map((h) => ({ ...h, accountId: r.account.id }))
  );

  const byMonth = new Map<string, { profit: number; balance: number }>();
  for (const entry of allHistory) {
    const key = monthKey(entry.date);
    const existing = byMonth.get(key) ?? { profit: 0, balance: 0 };
    existing.profit += entry.profit;
    existing.balance += entry.balance;
    byMonth.set(key, existing);
  }

  const sortedMonths = [...byMonth.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  const last12 = sortedMonths.slice(-12);

  const monthlyProfitChart = last12.map(([key, val]) => {
    const monthIdx = parseInt(key.split("-")[1], 10) - 1;
    return {
      month: MONTH_LABELS[monthIdx] ?? key,
      profit: Math.round(val.profit),
      balance: Math.round(val.balance),
    };
  });

  const portfolioGrowthChart = last12.map(([key, val]) => ({
    date: key,
    value: Math.round(val.balance),
  }));

  if (monthlyProfitChart.length === 0 && totalBalance > 0) {
    monthlyProfitChart.push({
      month: MONTH_LABELS[asOf.getMonth()],
      profit: Math.round(monthlyProfit),
      balance: Math.round(totalBalance),
    });
    portfolioGrowthChart.push({
      date: monthKey(asOf),
      value: Math.round(totalBalance),
    });
  }

  const yearStart = new Date(asOf.getFullYear(), 0, 1);
  const balanceAtYearStart = portfolio.accounts.reduce((sum, acc) => {
    const g = computeAccountGrowth(acc, portfolio.transactions, yearStart);
    return sum + g.balance;
  }, 0);
  const ytdGrowthPercent =
    balanceAtYearStart > 0
      ? Math.round(((totalBalance - balanceAtYearStart) / balanceAtYearStart) * 1000) / 10
      : 0;

  const investmentAccount = accounts.find(
    (a) => a.type === "investment" || a.type === "fixed_deposit"
  );
  const investmentBalance = investmentAccount?.balance ?? totalBalance;
  const planRate =
    investmentAccount?.investmentPlanId
      ? getInvestmentPlan(investmentAccount.investmentPlanId)?.monthlyRate ?? 4
      : 4;

  const holdings: InvestmentHolding[] = HOLDING_TEMPLATES.map((h) => ({
    ...h,
    value: Math.round((investmentBalance * h.allocation) / 100),
    monthlyReturn: planRate * (h.allocation / 100) * 0.15,
    ytdReturn: ytdGrowthPercent * (h.allocation / 100),
  }));

  const statements: MonthlyStatement[] = last12
    .slice()
    .reverse()
    .map(([key, val], i, arr) => {
      const [year, month] = key.split("-").map(Number);
      const prev = arr[i + 1]?.[1];
      const opening = prev ? prev.balance - prev.profit : val.balance - val.profit;
      return {
        id: `stmt_${key}`,
        month: MONTH_LABELS[month - 1],
        year,
        openingBalance: Math.round(opening),
        closingBalance: Math.round(val.balance),
        totalDeposits: 0,
        totalWithdrawals: 0,
        profitEarned: Math.round(val.profit),
        annualizedReturn: Math.round(weightedAnnual * 10) / 10,
      };
    });

  const primaryPlanId =
    portfolio.accounts.find((a) => a.investmentPlanId)?.investmentPlanId ??
    INVESTMENT_PLANS[0].id;

  return {
    accounts,
    portfolioAccounts: portfolio.accounts,
    transactions: [...portfolio.transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    ),
    totalBalance,
    monthlyProfit,
    annualReturn: Math.round(weightedAnnual * 10) / 10,
    ytdGrowthPercent,
    monthlyProfitChart,
    portfolioGrowthChart,
    sectorAllocation: SECTOR_ALLOCATION,
    holdings,
    statements,
    primaryPlanId,
  };
}

export function recordDepositOnPortfolio(
  portfolio: UserPortfolio,
  accountId: string,
  amount: number,
  description: string
): UserPortfolio {
  const account = portfolio.accounts.find((a) => a.id === accountId);
  if (!account) return portfolio;

  return {
    accounts: portfolio.accounts.map((a) =>
      a.id === accountId ? { ...a, principal: a.principal + amount } : a
    ),
    transactions: [
      {
        id: `tx_${Date.now()}`,
        accountId,
        type: "deposit",
        amount,
        description,
        status: "completed",
        date: new Date().toISOString(),
      },
      ...portfolio.transactions,
    ],
  };
}

export function getAccountLabel(
  account: Pick<Account, "type" | "investmentPlanId">
) {
  const plan = account.investmentPlanId ? getInvestmentPlan(account.investmentPlanId) : undefined;
  const typeLabel =
    account.type === "savings"
      ? "Savings"
      : account.type === "fixed_deposit"
        ? "Fixed Deposit"
        : account.type === "nonprofit_fund"
          ? "Non-Profit Fund"
          : "Investment";
  const planSuffix = plan ? ` · ${plan.name} (${plan.monthlyRate}%/mo)` : "";
  return `${typeLabel}${planSuffix}`;
}
