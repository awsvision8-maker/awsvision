export interface ManagerMonthlyTargetClient {
  id: string;
  name: string;
  email: string;
  firstDepositApprovedAt: string;
  profitWithdrawnAt?: string | null;
  profitWithdrawnAmount?: number;
  reason?: string;
}

export interface ManagerDashboardData {
  ambassador: {
    referralCode: string;
    referralUrl: string;
    firstName: string;
    lastName?: string;
    commissionRatePercent: number;
  };
  monthlyTarget: {
    requiredPerMonth: number;
    rules: string[];
  };
  currentMonth: {
    label: string;
    target: number;
    qualified: number;
    met: boolean;
    qualifiedClients: ManagerMonthlyTargetClient[];
    pendingClients: ManagerMonthlyTargetClient[];
  } | null;
  monthlyTargets: {
    key: string;
    label: string;
    target: number;
    qualified: number;
    met: boolean;
    isCurrentMonth: boolean;
    qualifiedClients: ManagerMonthlyTargetClient[];
    pendingClients: ManagerMonthlyTargetClient[];
  }[];
  stats: {
    totalReferrals: number;
    activeClients: number;
    totalFirstDeposits: number;
    totalCurrentCapital: number;
    totalCurrentBalance: number;
    totalCommissionEarned: number;
    totalCommissionPending: number;
    totalCommission: number;
  };
  referrals: {
    id: string;
    name: string;
    email: string;
    kycStatus: string;
    createdAt: string;
    currentCapital: number;
    currentBalance: number;
    firstDepositAmount: number;
    firstDepositStatus: string;
    commissionAmount: number;
    commissionEarned: number;
    commissionPending: number;
    commissionStatus: string;
    commissionPayableOn: string | null;
    firstDepositApprovedAt: string | null;
    countsTowardCurrentMonthTarget: boolean;
    pendingCurrentMonthTarget: boolean;
    isActiveInvestor: boolean;
  }[];
}

export function commissionStatusLabel(status: string, payableOn: string | null) {
  switch (status) {
    case "earned":
      return "Earned (month closed)";
    case "pending_month_end":
      return payableOn
        ? `Payable ${new Date(payableOn).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}`
        : "Payable after month end";
    case "awaiting_approval":
      return "Awaiting deposit approval";
    case "awaiting_deposit":
      return "Awaiting first deposit";
    default:
      return status;
  }
}

export function depositStatusLabel(status: string) {
  switch (status) {
    case "approved":
      return "First deposit approved";
    case "deposit_pending":
      return "Deposit pending review";
    case "awaiting_deposit":
      return "No deposit yet";
    default:
      return status;
  }
}
