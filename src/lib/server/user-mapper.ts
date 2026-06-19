import type {
  KYCData,
  NonprofitProfile,
  PortfolioAccount,
  Transaction,
  User,
  UserPortfolio,
} from "@/types";
import type { NonprofitProfile as DbNonprofitProfile, PortfolioAccount as DbAccount, Transaction as DbTransaction, User as DbUser } from "@prisma/client";

type UserWithRelations = DbUser & {
  nonprofitProfile: DbNonprofitProfile | null;
  accounts: DbAccount[];
  transactions: DbTransaction[];
};

export function mapPortfolioAccount(row: DbAccount): PortfolioAccount {
  return {
    id: row.id,
    accountNumber: row.accountNumber,
    type: row.type as PortfolioAccount["type"],
    principal: row.principal,
    monthlyRatePercent: row.monthlyRatePercent,
    investmentPlanId: row.investmentPlanId ?? undefined,
    createdAt: row.createdAt.toISOString(),
    maturityDate: row.maturityDate?.toISOString(),
    status: row.status as PortfolioAccount["status"],
    profitEligibleAt: row.profitEligibleAt?.toISOString(),
    profitRateAmended: row.profitRateAmended,
    amendmentNote: row.amendmentNote ?? undefined,
  };
}

export function mapTransaction(row: DbTransaction): Transaction {
  return {
    id: row.id,
    accountId: row.accountId,
    type: row.type as Transaction["type"],
    amount: row.amount,
    description: row.description,
    status: row.status as Transaction["status"],
    date: row.date.toISOString(),
  };
}

export function mapNonprofitProfile(row: DbNonprofitProfile): NonprofitProfile {
  return {
    organizationLegalName: row.organizationLegalName,
    dbaName: row.dbaName ?? undefined,
    ein: row.ein,
    organizationType: row.organizationType,
    yearEstablished: row.yearEstablished,
    missionStatement: row.missionStatement,
    website: row.website ?? undefined,
    fundCapital: row.fundCapital,
    monthlyRate: row.monthlyRate,
    representativeName: row.representativeName,
    representativeTitle: row.representativeTitle,
  };
}

export function mapUser(row: UserWithRelations): User {
  const portfolio: UserPortfolio = {
    accounts: row.accounts.map(mapPortfolioAccount),
    transactions: row.transactions.map(mapTransaction),
  };

  return {
    id: row.id,
    email: row.email,
    firstName: row.firstName,
    lastName: row.lastName,
    phone: row.phone,
    onlineId: row.onlineId ?? undefined,
    kycStatus: row.kycStatus as User["kycStatus"],
    profileType: row.profileType as User["profileType"],
    kycData: row.kycData ? (JSON.parse(row.kycData) as KYCData) : undefined,
    nonprofitProfile: row.nonprofitProfile
      ? mapNonprofitProfile(row.nonprofitProfile)
      : undefined,
    portfolio,
    createdAt: row.createdAt.toISOString(),
  };
}

export const userInclude = {
  nonprofitProfile: true,
  accounts: { orderBy: { createdAt: "asc" as const } },
  transactions: { orderBy: { date: "desc" as const } },
};
