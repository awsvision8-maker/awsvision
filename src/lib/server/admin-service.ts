import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/server/auth-service";

export async function authenticateAdmin(email: string, password: string) {
  const admin = await prisma.admin.findUnique({
    where: { email: email.toLowerCase().trim() },
  });
  if (!admin) return null;
  const ok = await verifyPassword(password, admin.passwordHash);
  if (!ok) return null;
  return admin;
}

export async function ensureDefaultAdmin() {
  const email = (
    process.env.ADMIN_PORTAL_EMAIL ||
    process.env.ADMIN_EMAIL ||
    "admin@awsvision.com"
  ).toLowerCase();
  const password = process.env.ADMIN_PORTAL_PASSWORD || "admin1234";

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) return existing;

  return prisma.admin.create({
    data: {
      email,
      passwordHash: await hashPassword(password),
      name: "AWS Vision Admin",
      role: "admin",
    },
  });
}

export async function getAdminStats() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [
    totalUsers,
    usersToday,
    nonprofitUsers,
    pendingKyc,
    totalDeposits,
    contactMessages,
    waitlistEntries,
    appointments,
    openChats,
    totalChats,
    withdrawalRequests,
    pendingDeposits,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: startOfDay } } }),
    prisma.user.count({ where: { profileType: "nonprofit" } }),
    prisma.user.count({ where: { kycStatus: { in: ["pending", "submitted"] } } }),
    prisma.transaction.aggregate({
      where: { type: "deposit", status: "completed" },
      _sum: { amount: true },
    }),
    prisma.contactMessage.count(),
    prisma.waitlistEntry.count(),
    prisma.appointmentRequest.count(),
    prisma.chatConversation.count({ where: { status: "open" } }),
    prisma.chatConversation.count(),
    prisma.withdrawalRequest.count({ where: { status: "pending" } }),
    prisma.transaction.count({ where: { type: "deposit", status: "pending" } }),
  ]);

  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      profileType: true,
      kycStatus: true,
      createdAt: true,
    },
  });

  return {
    totalUsers,
    usersToday,
    nonprofitUsers,
    pendingKyc,
    totalDeposits: totalDeposits._sum.amount ?? 0,
    contactMessages,
    waitlistEntries,
    appointments,
    openChats,
    totalChats,
    pendingWithdrawals: withdrawalRequests,
    pendingDeposits,
    recentUsers,
  };
}

export async function listPendingDeposits() {
  return prisma.transaction.findMany({
    where: { type: "deposit", status: "pending" },
    orderBy: { date: "desc" },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          profileType: true,
        },
      },
      account: {
        select: {
          id: true,
          accountNumber: true,
          type: true,
          investmentPlanId: true,
        },
      },
    },
  });
}

export async function listAllUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      nonprofitProfile: true,
      accounts: {
        select: {
          id: true,
          accountNumber: true,
          type: true,
          principal: true,
          status: true,
          investmentPlanId: true,
          profitEligibleAt: true,
        },
      },
      _count: { select: { transactions: true, withdrawalRequests: true } },
    },
  });
}

export async function getUserDetail(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      nonprofitProfile: true,
      accounts: true,
      transactions: { orderBy: { date: "desc" } },
      withdrawalRequests: { orderBy: { createdAt: "desc" }, take: 20 },
    },
  });
}

export async function adminDeleteUser(userId: string) {
  const { deleteUserAccount } = await import("@/lib/server/notification-service");
  return deleteUserAccount(userId);
}

export async function setUserKycStatus(userId: string, status: "verified" | "rejected") {
  return prisma.user.update({
    where: { id: userId },
    data: { kycStatus: status },
  });
}

export async function listKycQueue() {
  return prisma.user.findMany({
    where: { kycStatus: { in: ["pending", "submitted"] } },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      kycStatus: true,
      profileType: true,
      kycData: true,
      createdAt: true,
    },
  });
}

export async function listPendingWithdrawals() {
  return prisma.withdrawalRequest.findMany({
    where: { status: "pending" },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { id: true, email: true, firstName: true, lastName: true },
      },
    },
  });
}

export async function approveWithdrawal(withdrawalId: string) {
  const wr = await prisma.withdrawalRequest.findUnique({ where: { id: withdrawalId } });
  if (!wr) throw new Error("Withdrawal not found");
  if (wr.status !== "pending") throw new Error("Withdrawal is not pending");

  const account = await prisma.portfolioAccount.findUnique({ where: { id: wr.accountId } });
  if (!account) throw new Error("Account not found");
  if (account.principal < wr.amount) throw new Error("Insufficient account balance");

  await prisma.$transaction([
    prisma.withdrawalRequest.update({
      where: { id: withdrawalId },
      data: { status: "completed" },
    }),
    prisma.portfolioAccount.update({
      where: { id: wr.accountId },
      data: { principal: account.principal - wr.amount },
    }),
    prisma.transaction.create({
      data: {
        id: `tx_wd_${Date.now()}`,
        userId: wr.userId,
        accountId: wr.accountId,
        type: "withdrawal",
        amount: wr.amount,
        description: `Withdrawal approved · ${wr.method} · Ref ${wr.reference}`,
        status: "completed",
        date: new Date(),
      },
    }),
  ]);

  return wr;
}

export async function rejectWithdrawal(withdrawalId: string) {
  const wr = await prisma.withdrawalRequest.findUnique({ where: { id: withdrawalId } });
  if (!wr) throw new Error("Withdrawal not found");
  if (wr.status !== "pending") throw new Error("Withdrawal is not pending");

  await prisma.withdrawalRequest.update({
    where: { id: withdrawalId },
    data: { status: "rejected" },
  });

  return wr;
}

export async function listTransactions(filters?: {
  status?: string;
  type?: string;
  limit?: number;
}) {
  const where: { status?: string; type?: string } = {};
  if (filters?.status && filters.status !== "all") where.status = filters.status;
  if (filters?.type && filters.type !== "all") where.type = filters.type;

  return prisma.transaction.findMany({
    where,
    orderBy: { date: "desc" },
    take: filters?.limit ?? 100,
    include: {
      user: {
        select: { id: true, email: true, firstName: true, lastName: true },
      },
      account: {
        select: { id: true, accountNumber: true, type: true, investmentPlanId: true },
      },
    },
  });
}

export async function listContactMessages(limit = 100) {
  return prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function listAppointments(limit = 100) {
  return prisma.appointmentRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function listWaitlistEntries(limit = 200) {
  return prisma.waitlistEntry.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export interface AdminUserProfileUpdate {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  kycStatus?: string;
}

export interface AdminNonprofitUpdate {
  fundCapital?: number;
  monthlyRate?: number;
}

export interface AdminAccountUpdate {
  principal?: number;
  monthlyRatePercent?: number;
  investmentPlanId?: string | null;
  profitEligibleAt?: string | null;
  status?: string;
  maturityDate?: string | null;
  autoMatchPlan?: boolean;
  recordAdjustment?: boolean;
  profitRateAmended?: boolean;
  amendmentNote?: string | null;
}

export async function adminUpdateUserProfile(userId: string, data: AdminUserProfileUpdate) {
  const updates: Record<string, string> = {};
  if (data.firstName !== undefined) updates.firstName = data.firstName.trim();
  if (data.lastName !== undefined) updates.lastName = data.lastName.trim();
  if (data.phone !== undefined) updates.phone = data.phone.trim();
  if (data.email !== undefined) updates.email = data.email.toLowerCase().trim();
  if (data.kycStatus !== undefined) updates.kycStatus = data.kycStatus;

  if (Object.keys(updates).length === 0) {
    throw new Error("No profile fields to update");
  }

  return prisma.user.update({
    where: { id: userId },
    data: updates,
  });
}

export async function adminUpdateNonprofitProfile(userId: string, data: AdminNonprofitUpdate) {
  const profile = await prisma.nonprofitProfile.findUnique({ where: { userId } });
  if (!profile) throw new Error("Non-profit profile not found");

  const updates: { fundCapital?: number; monthlyRate?: number } = {};
  if (data.fundCapital !== undefined) updates.fundCapital = data.fundCapital;
  if (data.monthlyRate !== undefined) updates.monthlyRate = data.monthlyRate;

  if (Object.keys(updates).length === 0) {
    throw new Error("No nonprofit fields to update");
  }

  await prisma.$transaction(async (tx) => {
    await tx.nonprofitProfile.update({ where: { userId }, data: updates });

    const npAccount = await tx.portfolioAccount.findFirst({
      where: { userId, type: "nonprofit_fund" },
    });
    if (npAccount) {
      const accountUpdates: {
        principal?: number;
        monthlyRatePercent?: number;
      } = {};
      if (data.fundCapital !== undefined) accountUpdates.principal = data.fundCapital;
      if (data.monthlyRate !== undefined) accountUpdates.monthlyRatePercent = data.monthlyRate;
      if (Object.keys(accountUpdates).length > 0) {
        await tx.portfolioAccount.update({
          where: { id: npAccount.id },
          data: accountUpdates,
        });
      }
    }
  });

  return getUserDetail(userId);
}

export async function adminUpdatePortfolioAccount(
  userId: string,
  accountId: string,
  data: AdminAccountUpdate
) {
  const account = await prisma.portfolioAccount.findFirst({
    where: { id: accountId, userId },
  });
  if (!account) throw new Error("Account not found");

  const { accountRatesForPrincipal } = await import("@/lib/portfolio-engine");

  const updates: {
    principal?: number;
    monthlyRatePercent?: number;
    investmentPlanId?: string | null;
    profitEligibleAt?: Date | null;
    status?: string;
    maturityDate?: Date | null;
    profitRateAmended?: boolean;
    amendmentNote?: string | null;
  } = {};

  if (data.principal !== undefined) {
    if (data.principal < 0) throw new Error("Principal cannot be negative");
    updates.principal = data.principal;
  }

  const shouldAutoMatch = data.autoMatchPlan !== false;
  const nextPrincipal = updates.principal ?? account.principal;

  if (shouldAutoMatch) {
    const rates = accountRatesForPrincipal(
      {
        type: account.type as "savings" | "fixed_deposit" | "investment" | "nonprofit_fund",
        monthlyRatePercent: account.monthlyRatePercent,
        investmentPlanId: account.investmentPlanId ?? undefined,
        profitRateAmended: false,
      },
      nextPrincipal
    );
    updates.monthlyRatePercent = rates.monthlyRatePercent;
    updates.profitRateAmended = false;
    updates.amendmentNote = null;
    if (rates.investmentPlanId) {
      updates.investmentPlanId = rates.investmentPlanId;
    }
  } else {
    if (data.investmentPlanId !== undefined) {
      updates.investmentPlanId = data.investmentPlanId;
    }
    if (data.monthlyRatePercent !== undefined) {
      updates.monthlyRatePercent = data.monthlyRatePercent;
      updates.profitRateAmended = data.profitRateAmended ?? true;
    } else if (data.investmentPlanId) {
      const { getInvestmentPlan } = await import("@/lib/investment-plans");
      const plan = getInvestmentPlan(data.investmentPlanId);
      if (plan) {
        updates.monthlyRatePercent = plan.monthlyRate;
        updates.profitRateAmended = data.profitRateAmended ?? true;
      }
    }
    if (data.profitRateAmended !== undefined) {
      updates.profitRateAmended = data.profitRateAmended;
    }
    if (data.amendmentNote !== undefined) {
      updates.amendmentNote = data.amendmentNote;
    }
  }

  if (data.profitEligibleAt !== undefined) {
    updates.profitEligibleAt = data.profitEligibleAt ? new Date(data.profitEligibleAt) : null;
  }
  if (data.status !== undefined) updates.status = data.status;
  if (data.maturityDate !== undefined) {
    updates.maturityDate = data.maturityDate ? new Date(data.maturityDate) : null;
  }

  if (Object.keys(updates).length === 0) {
    throw new Error("No account fields to update");
  }

  const adjustmentTx =
    data.principal !== undefined &&
    data.principal !== account.principal &&
    data.recordAdjustment !== false
      ? (() => {
          const diff = data.principal! - account.principal;
          return prisma.transaction.create({
            data: {
              id: `tx_adj_${Date.now()}`,
              userId,
              accountId,
              type: diff > 0 ? "deposit" : "withdrawal",
              amount: Math.abs(diff),
              description: `Admin balance adjustment (${diff > 0 ? "+" : ""}${diff.toFixed(2)})`,
              status: "completed",
              date: new Date(),
            },
          });
        })()
      : null;

  await prisma.$transaction([
    prisma.portfolioAccount.update({
      where: { id: accountId },
      data: updates,
    }),
    ...(adjustmentTx ? [adjustmentTx] : []),
  ]);
  return getUserDetail(userId);
}

export async function adminAdjustAccountBalance(
  userId: string,
  accountId: string,
  amount: number,
  direction: "credit" | "debit",
  description: string
) {
  if (amount <= 0) throw new Error("Amount must be positive");

  const account = await prisma.portfolioAccount.findFirst({
    where: { id: accountId, userId },
  });
  if (!account) throw new Error("Account not found");

  const delta = direction === "credit" ? amount : -amount;
  const newPrincipal = account.principal + delta;
  if (newPrincipal < 0) throw new Error("Insufficient balance for debit");

  const { accountRatesForPrincipal } = await import("@/lib/portfolio-engine");
  const rates = accountRatesForPrincipal(
    {
      type: account.type as "savings" | "fixed_deposit" | "investment" | "nonprofit_fund",
      monthlyRatePercent: account.monthlyRatePercent,
      investmentPlanId: account.investmentPlanId ?? undefined,
      profitRateAmended: account.profitRateAmended,
    },
    newPrincipal
  );

  await prisma.$transaction([
    prisma.portfolioAccount.update({
      where: { id: accountId },
      data: {
        principal: newPrincipal,
        monthlyRatePercent: rates.monthlyRatePercent,
        ...(rates.investmentPlanId ? { investmentPlanId: rates.investmentPlanId } : {}),
      },
    }),
    prisma.transaction.create({
      data: {
        id: `tx_adj_${Date.now()}`,
        userId,
        accountId,
        type: direction === "credit" ? "deposit" : "withdrawal",
        amount,
        description: description.trim() || `Admin ${direction}`,
        status: "completed",
        date: new Date(),
      },
    }),
  ]);

  return getUserDetail(userId);
}
