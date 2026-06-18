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

export const PROFIT_HOLD_DAYS = 30;

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function profitEligibleFromApproval(approvedAt = new Date()) {
  return addDays(approvedAt, PROFIT_HOLD_DAYS);
}

export function isProfitAccrualActive(
  account: Pick<PortfolioAccount, "profitEligibleAt">,
  asOf = new Date()
) {
  if (!account.profitEligibleAt) return false;
  return asOf >= new Date(account.profitEligibleAt);
}

function generateAccountNumber() {
  return `AV${Math.floor(1000000000 + Math.random() * 9000000000)}`;
}

export function resolvePlanTierFromPrincipal(
  account: Pick<PortfolioAccount, "type" | "investmentPlanId">,
  principal: number
) {
  if (account.type !== "investment" && account.type !== "fixed_deposit") return null;
  const sorted = [...INVESTMENT_PLANS].sort((a, b) => b.minInvestment - a.minInvestment);
  return sorted.find((p) => principal >= p.minInvestment) ?? INVESTMENT_PLANS[0];
}

export function resolveMonthlyRate(
  account: Pick<PortfolioAccount, "type" | "monthlyRatePercent" | "investmentPlanId">,
  balanceForTier: number
): number {
  if (account.type === "nonprofit_fund") return account.monthlyRatePercent;
  if (account.type === "investment" || account.type === "fixed_deposit") {
    const plan = resolvePlanTierFromPrincipal(account, balanceForTier);
    if (plan) return plan.monthlyRate;
    return account.monthlyRatePercent;
  }
  return getAnnualizedReturn(balanceForTier) / 12;
}

/** Approved capital only — pending deposits never count toward balance or tier */
export function getApprovedPrincipal(
  account: PortfolioAccount,
  transactions: Transaction[],
  asOf = new Date()
): number {
  const fromLedger = getAccountNetPrincipal(account.id, transactions, asOf);
  if (fromLedger > 0) return fromLedger;
  if (account.principal > 0) return account.principal;
  return 0;
}

function addMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function startOfNextMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}

/**
 * Calendar month when the displayed profit estimate will be delivered to the account.
 * Profits credit on the first day of the month following each accrual period.
 */
export function resolveProfitDeliveryMonth(
  asOf: Date,
  options: {
    approvedDepositTotal: number;
    profitEligibleAt: string | null;
    profitAccrualActive: boolean;
    tierChangesNextMonth: boolean;
  }
): Date | null {
  if (options.approvedDepositTotal <= 0) return null;

  const nextCalendarMonth = startOfNextMonth(asOf);

  if (!options.profitAccrualActive && options.profitEligibleAt) {
    const eligible = new Date(options.profitEligibleAt);
    const firstDeliveryMonth = startOfMonth(addMonths(eligible, 1));
    if (asOf < eligible) return firstDeliveryMonth;
  }

  if (options.profitAccrualActive || options.tierChangesNextMonth) {
    return nextCalendarMonth;
  }

  if (options.profitEligibleAt) {
    return startOfMonth(addMonths(new Date(options.profitEligibleAt), 1));
  }

  return nextCalendarMonth;
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

function shortMonthLabel(date: Date) {
  const year = String(date.getFullYear()).slice(-2);
  return `${MONTH_LABELS[date.getMonth()]} '${year}`;
}

export interface PortfolioGrowthChartPoint {
  key: string;
  label: string;
  value: number;
  deposited: number;
  profitGain: number;
  monthProfit: number;
  projected?: boolean;
}

export interface MonthlyProfitChartPoint {
  key: string;
  label: string;
  profit: number;
  balance: number;
  projected?: boolean;
}

/** Monthly time-series for portfolio charts — deposits, profit accrual, and projections */
export function buildPortfolioChartSeries(
  portfolio: UserPortfolio,
  asOf = new Date(),
  extras: {
    approvedDepositTotal: number;
    totalBalance: number;
    nextMonthMonthlyProfit: number;
    profitAccrualActive: boolean;
    profitEligibleAt: string | null;
  }
): { growth: PortfolioGrowthChartPoint[]; monthlyProfit: MonthlyProfitChartPoint[] } {
  const empty = {
    growth: [] as PortfolioGrowthChartPoint[],
    monthlyProfit: [] as MonthlyProfitChartPoint[],
  };
  if (extras.approvedDepositTotal <= 0) return empty;

  const completedDeposits = portfolio.transactions.filter(
    (t) => t.type === "deposit" && t.status === "completed"
  );

  const earliestMs = completedDeposits.length
    ? Math.min(...completedDeposits.map((t) => new Date(t.date).getTime()))
    : portfolio.accounts.length
      ? new Date(portfolio.accounts[0].createdAt).getTime()
      : asOf.getTime();

  let cursor = startOfMonth(new Date(earliestMs));
  const endMonth = startOfMonth(asOf);
  const growth: PortfolioGrowthChartPoint[] = [];
  const monthlyProfit: MonthlyProfitChartPoint[] = [];

  while (cursor.getTime() <= endMonth.getTime()) {
    const snapshotAt =
      endOfMonth(cursor).getTime() > asOf.getTime() ? asOf : endOfMonth(cursor);
    const key = monthKey(cursor);

    let totalValue = 0;
    let totalDeposited = 0;
    let monthProfitSum = 0;

    for (const acc of portfolio.accounts) {
      const principal = getApprovedPrincipal(acc, portfolio.transactions, snapshotAt);
      const growthResult = computeAccountGrowth(acc, portfolio.transactions, snapshotAt);
      totalValue += growthResult.balance;
      totalDeposited += principal;
      monthProfitSum += growthResult.profitHistory
        .filter((h) => monthKey(h.date) === key)
        .reduce((s, h) => s + h.profit, 0);
    }

    const roundedValue = Math.round(totalValue * 100) / 100;
    const roundedDeposited = Math.round(totalDeposited * 100) / 100;

    growth.push({
      key,
      label: shortMonthLabel(cursor),
      value: roundedValue,
      deposited: roundedDeposited,
      profitGain: Math.round((roundedValue - roundedDeposited) * 100) / 100,
      monthProfit: Math.round(monthProfitSum * 100) / 100,
    });

    monthlyProfit.push({
      key,
      label: shortMonthLabel(cursor),
      profit: Math.round(monthProfitSum * 100) / 100,
      balance: roundedValue,
    });

    cursor = startOfNextMonth(cursor);
  }

  if (growth.length === 1) {
    const [y, m] = growth[0].key.split("-").map(Number);
    const prev = new Date(y, m - 2, 1);
    const pad = {
      key: monthKey(prev),
      label: shortMonthLabel(prev),
      value: 0,
      deposited: 0,
      profitGain: 0,
      monthProfit: 0,
    };
    growth.unshift(pad);
    monthlyProfit.unshift({
      key: pad.key,
      label: pad.label,
      profit: 0,
      balance: 0,
    });
  }

  const nextMonth = startOfNextMonth(asOf);
  const nextMonthEnd = endOfMonth(nextMonth);
  const profitActiveNextMonth = portfolio.accounts.some((a) =>
    isProfitAccrualActive(a, nextMonthEnd)
  );
  const projectedMonthProfit = profitActiveNextMonth
    ? Math.round(extras.nextMonthMonthlyProfit * 100) / 100
    : extras.profitEligibleAt &&
        !extras.profitAccrualActive &&
        nextMonthEnd >= new Date(extras.profitEligibleAt)
      ? Math.round(extras.nextMonthMonthlyProfit * 100) / 100
      : 0;

  let projectedBalance = extras.totalBalance;
  if (projectedMonthProfit > 0) {
    projectedBalance = Math.round((extras.totalBalance + projectedMonthProfit) * 100) / 100;
  }

  const projLabel = `${shortMonthLabel(nextMonth)} (est.)`;
  const projKey = monthKey(nextMonth);

  growth.push({
    key: projKey,
    label: projLabel,
    value: projectedBalance,
    deposited: extras.approvedDepositTotal,
    profitGain: Math.round((projectedBalance - extras.approvedDepositTotal) * 100) / 100,
    monthProfit: projectedMonthProfit,
    projected: true,
  });
  monthlyProfit.push({
    key: projKey,
    label: projLabel,
    profit: projectedMonthProfit,
    balance: projectedBalance,
    projected: true,
  });

  const maxPoints = 13;
  return {
    growth: growth.slice(-maxPoints),
    monthlyProfit: monthlyProfit.slice(-maxPoints),
  };
}

function monthsElapsed(from: Date, to: Date) {
  return (
    (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth())
  );
}

/** Net approved capital from ledger (deposits minus withdrawals) */
export function getAccountNetPrincipal(
  accountId: string,
  transactions: Transaction[],
  asOf = new Date()
): number {
  const asOfMs = asOf.getTime();
  return transactions
    .filter(
      (t) =>
        t.accountId === accountId &&
        t.status === "completed" &&
        (t.type === "deposit" || t.type === "withdrawal") &&
        new Date(t.date).getTime() <= asOfMs
    )
    .reduce((sum, t) => sum + (t.type === "deposit" ? t.amount : -t.amount), 0);
}

/**
 * Deposit principal that determines program tier for profit in a calendar month.
 * New deposits count toward tier from the first day of the next calendar month.
 * Withdrawals reduce tier immediately when approved.
 */
export function principalForTierAtMonth(
  accountId: string,
  transactions: Transaction[],
  monthStart: Date
): number {
  const monthStartMs = monthStart.getTime();
  let tierPrincipal = 0;

  const events = transactions
    .filter(
      (t) =>
        t.accountId === accountId &&
        t.status === "completed" &&
        (t.type === "deposit" || t.type === "withdrawal")
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  for (const tx of events) {
    const txDate = new Date(tx.date);
    if (tx.type === "withdrawal" && txDate.getTime() < monthStartMs) {
      tierPrincipal -= tx.amount;
    }
    if (tx.type === "deposit" && startOfNextMonth(txDate).getTime() <= monthStartMs) {
      tierPrincipal += tx.amount;
    }
  }

  return Math.max(0, tierPrincipal);
}

export interface AccountGrowthResult {
  balance: number;
  monthlyProfit: number;
  annualReturnPercent: number;
  profitHistory: { month: string; profit: number; balance: number; date: Date }[];
}

/** Balance = admin-approved deposits (+ profit after 30-day hold). Tier rate changes apply next calendar month. */
export function computeAccountGrowth(
  account: PortfolioAccount,
  transactions: Transaction[],
  asOf = new Date()
): AccountGrowthResult {
  const principal = getApprovedPrincipal(account, transactions, asOf);
  const profitEligibleAt = account.profitEligibleAt ? new Date(account.profitEligibleAt) : null;
  const profitActive = isProfitAccrualActive(account, asOf);

  let balance = principal;
  const profitHistory: AccountGrowthResult["profitHistory"] = [];

  if (principal > 0 && profitEligibleAt && profitActive) {
    const accrualMonths = Math.max(0, monthsElapsed(profitEligibleAt, asOf));
    const plan = resolvePlanTierFromPrincipal(account, principal);
    const compound = plan?.compoundInterest ?? account.type !== "savings";

    let running = getAccountNetPrincipal(account.id, transactions, profitEligibleAt);

    for (let m = 0; m < accrualMonths; m++) {
      const periodStart = addMonths(profitEligibleAt, m);
      const tierMonth = startOfMonth(periodStart);
      const tierPrincipal = principalForTierAtMonth(account.id, transactions, tierMonth);
      const rate = resolveMonthlyRate(account, tierPrincipal);
      const profit = (running * rate) / 100;

      if (compound) {
        running += profit;
      } else {
        const cashBase = getAccountNetPrincipal(account.id, transactions, periodStart);
        running =
          cashBase + profitHistory.reduce((s, h) => s + h.profit, 0) + profit;
      }

      profitHistory.push({
        month: MONTH_LABELS[periodStart.getMonth()],
        profit: Math.round(profit * 100) / 100,
        balance: Math.round(running * 100) / 100,
        date: new Date(periodStart),
      });
    }

    balance = compound
      ? running
      : principal + profitHistory.reduce((s, h) => s + h.profit, 0);
  }

  const nextMonthTierPrincipal = principalForTierAtMonth(
    account.id,
    transactions,
    startOfNextMonth(asOf)
  );
  const nextMonthRate = resolveMonthlyRate(account, nextMonthTierPrincipal);
  const monthlyProfit =
    principal > 0
      ? Math.round(((balance * nextMonthRate) / 100) * 100) / 100
      : 0;

  const annualReturnPercent =
    account.type === "savings"
      ? getAnnualizedReturn(principal)
      : Math.round(nextMonthRate * 12 * 100) / 100;

  return {
    balance: Math.round(balance * 100) / 100,
    monthlyProfit: profitActive ? monthlyProfit : 0,
    annualReturnPercent,
    profitHistory,
  };
}

export function createAccountFromSignup(data: SignupApplication, createdAt = new Date()): {
  account: PortfolioAccount;
} {
  const plan = getInvestmentPlan(data.investmentPlanId);
  const planId =
    data.accountType === "investment"
      ? plan?.id ?? "silver"
      : data.accountType === "fixed_deposit"
        ? plan?.id ?? "gold"
        : undefined;

  const selectedPlan = plan ?? getInvestmentPlan(planId);

  let monthlyRatePercent: number;
  let maturityDate: string | undefined;

  if (data.accountType === "investment" && selectedPlan) {
    monthlyRatePercent = selectedPlan.monthlyRate;
    maturityDate = addMonths(createdAt, selectedPlan.termMonths).toISOString();
  } else if (data.accountType === "fixed_deposit") {
    if (selectedPlan) {
      monthlyRatePercent = selectedPlan.monthlyRate;
      maturityDate = addMonths(createdAt, selectedPlan.termMonths).toISOString();
    } else {
      monthlyRatePercent = FD_PROMO_TERMS.returnPercent / FD_PROMO_TERMS.termMonths;
      maturityDate = addMonths(createdAt, FD_PROMO_TERMS.termMonths).toISOString();
    }
  } else {
    monthlyRatePercent = getAnnualizedReturn(0) / 12;
  }

  const accountId = `acc_${Date.now()}`;
  const account: PortfolioAccount = {
    id: accountId,
    accountNumber: generateAccountNumber(),
    type: data.accountType,
    principal: 0,
    monthlyRatePercent,
    investmentPlanId: planId,
    createdAt: createdAt.toISOString(),
    maturityDate,
    status: "active",
  };

  return { account };
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
    principal: 0,
    monthlyRatePercent: profile.monthlyRate,
    createdAt: createdAt.toISOString(),
    status: "active",
  };

  return {
    accounts: [account],
    transactions: [],
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
  growth: AccountGrowthResult,
  principal: number
): Account {
  const plan = resolvePlanTierFromPrincipal(account, principal);
  const monthlyRate = resolveMonthlyRate(account, principal);
  const annualRate =
    account.type === "savings" ? growth.annualReturnPercent : monthlyRate * 12;

  return {
    id: account.id,
    accountNumber: account.accountNumber,
    type: account.type,
    balance: growth.balance,
    interestRate: Math.round(annualRate * 100) / 100,
    investmentPlanId: plan?.id ?? account.investmentPlanId,
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
  monthlyProfitChart: MonthlyProfitChartPoint[];
  portfolioGrowthChart: PortfolioGrowthChartPoint[];
  sectorAllocation: typeof SECTOR_ALLOCATION;
  holdings: InvestmentHolding[];
  statements: MonthlyStatement[];
  primaryPlanId?: string;
  currentPlanId?: string;
  nextMonthPlanId?: string;
  nextMonthMonthlyProfit: number;
  nextMonthRatePercent: number;
  profitDeliveryMonth: string | null;
  pendingDepositTotal: number;
  approvedDepositTotal: number;
  profitEligibleAt: string | null;
  profitAccrualActive: boolean;
}

export function buildPortfolioSnapshot(
  user: User | null,
  asOf = new Date()
): PortfolioSnapshot {
  const emptyPortfolio: UserPortfolio = { accounts: [], transactions: [] };
  const portfolio = user?.portfolio ?? (user ? emptyPortfolio : createDemoPortfolio());
  const isNonprofit = user?.profileType === "nonprofit";

  if (isNonprofit && user?.nonprofitProfile && portfolio.accounts.length === 0) {
    const np = createNonprofitPortfolio(user.nonprofitProfile, new Date(user.createdAt));
    portfolio.accounts = np.accounts;
    portfolio.transactions = np.transactions;
  }

  const accountResults = portfolio.accounts.map((acc) => {
    const principal = getApprovedPrincipal(acc, portfolio.transactions, asOf);
    return {
      account: acc,
      principal,
      growth: computeAccountGrowth(acc, portfolio.transactions, asOf),
    };
  });

  const approvedDepositTotal = accountResults.reduce((sum, r) => sum + r.principal, 0);

  const accounts =
    approvedDepositTotal > 0
      ? accountResults.map(({ account, growth, principal }) =>
          portfolioAccountToDisplay(account, growth, principal)
        )
      : accountResults.map(({ account }) => ({
          id: account.id,
          accountNumber: account.accountNumber,
          type: account.type,
          balance: 0,
          interestRate: 0,
          investmentPlanId: account.investmentPlanId,
          maturityDate: account.maturityDate,
          status: account.status,
          createdAt: account.createdAt,
        }));

  const totalBalance =
    approvedDepositTotal > 0
      ? accounts.reduce((s, a) => s + a.balance, 0)
      : 0;
  const monthlyProfit =
    approvedDepositTotal > 0
      ? accountResults.reduce((s, r) => s + r.growth.monthlyProfit, 0)
      : 0;

  const weightedAnnual =
    totalBalance > 0
      ? accountResults.reduce(
          (s, r) => s + r.growth.annualReturnPercent * r.growth.balance,
          0
        ) / totalBalance
      : 0;

  const yearStart = new Date(asOf.getFullYear(), 0, 1);
  const balanceAtYearStart = portfolio.accounts.reduce((sum, acc) => {
    const g = computeAccountGrowth(acc, portfolio.transactions, yearStart);
    return sum + g.balance;
  }, 0);
  const ytdGrowthPercent =
    balanceAtYearStart > 0
      ? Math.round(((totalBalance - balanceAtYearStart) / balanceAtYearStart) * 1000) / 10
      : 0;

  const investmentAccount = accountResults.find(
    (r) => r.account.type === "investment" || r.account.type === "fixed_deposit"
  );
  const investmentBalance =
    approvedDepositTotal > 0
      ? investmentAccount?.growth.balance ?? totalBalance
      : 0;

  const currentMonthStart = startOfMonth(asOf);
  const nextMonthStart = startOfNextMonth(asOf);

  const primaryLedgerAccount =
    investmentAccount?.account ?? accountResults[0]?.account;

  const currentTierPrincipal = primaryLedgerAccount
    ? principalForTierAtMonth(
        primaryLedgerAccount.id,
        portfolio.transactions,
        currentMonthStart
      )
    : 0;
  const nextMonthTierPrincipal = primaryLedgerAccount
    ? principalForTierAtMonth(
        primaryLedgerAccount.id,
        portfolio.transactions,
        nextMonthStart
      )
    : 0;

  const currentPlan = primaryLedgerAccount
    ? resolvePlanTierFromPrincipal(primaryLedgerAccount, currentTierPrincipal)
    : null;
  const nextMonthPlan = primaryLedgerAccount
    ? resolvePlanTierFromPrincipal(primaryLedgerAccount, nextMonthTierPrincipal)
    : null;

  const nextMonthRatePercent = primaryLedgerAccount
    ? resolveMonthlyRate(primaryLedgerAccount, nextMonthTierPrincipal)
    : 0;
  const nextMonthMonthlyProfit =
    approvedDepositTotal > 0 && totalBalance > 0
      ? Math.round(((totalBalance * nextMonthRatePercent) / 100) * 100) / 100
      : 0;

  const profitEligibleDates = portfolio.accounts
    .map((a) => a.profitEligibleAt)
    .filter((d): d is string => Boolean(d))
    .sort();

  const profitEligibleAt = profitEligibleDates[0] ?? null;
  const profitAccrualActive = portfolio.accounts.some((a) => isProfitAccrualActive(a, asOf));

  const chartSeries = buildPortfolioChartSeries(portfolio, asOf, {
    approvedDepositTotal,
    totalBalance,
    nextMonthMonthlyProfit,
    profitAccrualActive,
    profitEligibleAt,
  });
  const portfolioGrowthChart = chartSeries.growth;
  const monthlyProfitChart = chartSeries.monthlyProfit;

  const planRate = investmentAccount
    ? resolveMonthlyRate(investmentAccount.account, nextMonthTierPrincipal)
    : 4;

  const holdings: InvestmentHolding[] =
    approvedDepositTotal > 0
      ? HOLDING_TEMPLATES.map((h) => ({
          ...h,
          value: Math.round((investmentBalance * h.allocation) / 100),
          monthlyReturn: planRate * (h.allocation / 100) * 0.15,
          ytdReturn: ytdGrowthPercent * (h.allocation / 100),
        }))
      : HOLDING_TEMPLATES.map((h) => ({
          ...h,
          value: 0,
          monthlyReturn: 0,
          ytdReturn: 0,
        }));

  const statementMonths = monthlyProfitChart.filter((p) => !p.projected);
  const statements: MonthlyStatement[] = statementMonths
    .slice()
    .reverse()
    .map((point, i, arr) => {
      const [year, month] = point.key.split("-").map(Number);
      const prev = arr[i + 1];
      const opening = prev ? prev.balance - prev.profit : point.balance - point.profit;
      return {
        id: `stmt_${point.key}`,
        month: MONTH_LABELS[month - 1],
        year,
        openingBalance: Math.round(opening),
        closingBalance: Math.round(point.balance),
        totalDeposits: 0,
        totalWithdrawals: 0,
        profitEarned: Math.round(point.profit),
        annualizedReturn: Math.round(weightedAnnual * 10) / 10,
      };
    });

  const primaryPlanId =
    nextMonthPlan?.id ??
    currentPlan?.id ??
    portfolio.accounts.find((a) => a.investmentPlanId)?.investmentPlanId ??
    INVESTMENT_PLANS[0].id;

  const pendingDepositTotal = portfolio.transactions
    .filter((t) => t.type === "deposit" && t.status === "pending")
    .reduce((sum, t) => sum + t.amount, 0);

  const tierChangesNextMonth = Boolean(
    currentPlan && nextMonthPlan && currentPlan.id !== nextMonthPlan.id
  );
  const profitDeliveryDate = resolveProfitDeliveryMonth(asOf, {
    approvedDepositTotal,
    profitEligibleAt,
    profitAccrualActive,
    tierChangesNextMonth,
  });
  const profitDeliveryMonth = profitDeliveryDate
    ? profitDeliveryDate.toISOString()
    : null;

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
    currentPlanId: currentPlan?.id,
    nextMonthPlanId: nextMonthPlan?.id,
    nextMonthMonthlyProfit,
    nextMonthRatePercent,
    profitDeliveryMonth,
    pendingDepositTotal,
    approvedDepositTotal,
    profitEligibleAt,
    profitAccrualActive,
  };
}

export function accountRatesForPrincipal(
  account: Pick<PortfolioAccount, "type" | "monthlyRatePercent" | "investmentPlanId">,
  principal: number
): { investmentPlanId?: string; monthlyRatePercent: number } {
  if (account.type === "investment" || account.type === "fixed_deposit") {
    const plan = resolvePlanTierFromPrincipal(account, principal)!;
    return { investmentPlanId: plan.id, monthlyRatePercent: plan.monthlyRate };
  }
  if (account.type === "savings") {
    return { monthlyRatePercent: getAnnualizedReturn(principal) / 12 };
  }
  return { monthlyRatePercent: account.monthlyRatePercent };
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
    accounts: portfolio.accounts,
    transactions: [
      {
        id: `tx_${Date.now()}`,
        accountId,
        type: "deposit",
        amount,
        description,
        status: "pending",
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
