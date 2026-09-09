import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { nonprofitApplicationToProfile } from "@/lib/nonprofit-signup-form";
import {
  accountRatesForPrincipal,
  createAccountFromSignup,
  createNonprofitPortfolio,
  profitEligibleFromApproval,
  recordDepositOnPortfolio,
} from "@/lib/portfolio-engine";
import { createAgreementOnDepositApproval } from "@/lib/server/agreement-service";
import { getInvestmentPlan } from "@/lib/investment-plans";
import { FD_PROMO_TERMS, isFdPromoPlanId, isFdPromoOfferingOpen } from "@/lib/promotions";
import { getFdPromoConfig } from "@/lib/server/fd-promo-config";
import { mapUser, userInclude } from "@/lib/server/user-mapper";
import {
  checkOnlineIdAvailability,
  normalizeOnlineId,
} from "@/lib/server/online-id-service";
import { parseDateOfBirthForStorage } from "@/lib/birthday";
import type {
  NonprofitSignupApplication,
  PortfolioAccount,
  SignupApplication,
  Transaction,
} from "@/types";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function findUserByLoginIdentifier(identifier: string) {
  const value = identifier.trim().replace(/\s/g, "");
  if (!value) return null;

  if (value.includes("@")) {
    return prisma.user.findUnique({
      where: { email: value.toLowerCase() },
      include: userInclude,
    });
  }

  return prisma.user.findFirst({
    where: {
      onlineId: { equals: value, mode: "insensitive" },
    },
    include: userInclude,
  });
}

export async function fetchUserById(userId: string) {
  const row = await prisma.user.findUnique({
    where: { id: userId },
    include: userInclude,
  });
  return row ? mapUser(row) : null;
}

export async function createIndividualUser(
  data: SignupApplication,
  kycData: object,
  ambassadorId?: string | null
) {
  const createdAt = new Date();
  const wantsPromoFd =
    data.accountType === "fixed_deposit" &&
    (isFdPromoPlanId(data.investmentPlanId) || !data.investmentPlanId);

  let promoTerms: { returnPercent: number; termMonths: number; planId: string } | undefined;
  if (wantsPromoFd) {
    const promoConfig = await getFdPromoConfig();
    if (!isFdPromoOfferingOpen(promoConfig, createdAt)) {
      throw new Error(
        "The Wealth Accelerator Fixed Deposit promotion is not open for new enrollments right now."
      );
    }
    promoTerms = {
      returnPercent: promoConfig.returnPercent,
      termMonths: promoConfig.termMonths,
      planId: promoConfig.planId,
    };
  }

  const { account } = createAccountFromSignup(data, createdAt, promoTerms);
  const onlineId = normalizeOnlineId(data.onlineId);

  const idCheck = await checkOnlineIdAvailability(onlineId, {
    firstName: data.firstName,
    lastName: data.lastName,
  });
  if (!idCheck.available) {
    throw new Error(idCheck.message ?? "This Online ID is already taken");
  }

  const user = await prisma.user.create({
    data: {
      email: data.email.toLowerCase(),
      passwordHash: await hashPassword(data.password),
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      onlineId,
      dateOfBirth: parseDateOfBirthForStorage(data.dateOfBirth) ?? undefined,
      ambassadorId: ambassadorId ?? undefined,
      kycStatus: "submitted",
      profileType: "individual",
      kycData: JSON.stringify(kycData),
      accounts: {
        create: {
          id: account.id,
          accountNumber: account.accountNumber,
          type: account.type,
          principal: account.principal,
          monthlyRatePercent: account.monthlyRatePercent,
          investmentPlanId: account.investmentPlanId,
          maturityDate: account.maturityDate ? new Date(account.maturityDate) : null,
          status: account.status,
          createdAt: new Date(account.createdAt),
        },
      },
    },
    include: userInclude,
  });

  return mapUser(user);
}

export async function createNonprofitUser(data: NonprofitSignupApplication) {
  const createdAt = new Date();
  const nonprofitProfile = nonprofitApplicationToProfile(data);
  const portfolio = createNonprofitPortfolio(nonprofitProfile, createdAt);
  const account = portfolio.accounts[0];
  const onlineId = normalizeOnlineId(data.onlineId);

  const idCheck = await checkOnlineIdAvailability(onlineId, {
    orgName: data.organizationLegalName,
  });
  if (!idCheck.available) {
    throw new Error(idCheck.message ?? "This Online ID is already taken");
  }

  const user = await prisma.user.create({
    data: {
      email: data.repEmail.toLowerCase(),
      passwordHash: await hashPassword(data.password),
      firstName: data.repFirstName,
      lastName: data.repLastName,
      phone: data.repPhone,
      onlineId,
      kycStatus: "submitted",
      profileType: "nonprofit",
      kycData: JSON.stringify({
        taxExemptDocName: data.taxExemptDocName,
        taxExemptDocPreview: data.taxExemptDocPreview,
        organizationLegalName: data.organizationLegalName,
        ein: data.ein,
      }),
      nonprofitProfile: {
        create: {
          organizationLegalName: nonprofitProfile.organizationLegalName,
          dbaName: nonprofitProfile.dbaName,
          ein: nonprofitProfile.ein,
          organizationType: nonprofitProfile.organizationType,
          yearEstablished: nonprofitProfile.yearEstablished,
          missionStatement: nonprofitProfile.missionStatement,
          website: nonprofitProfile.website,
          fundCapital: nonprofitProfile.fundCapital,
          monthlyRate: nonprofitProfile.monthlyRate,
          representativeName: nonprofitProfile.representativeName,
          representativeTitle: nonprofitProfile.representativeTitle,
        },
      },
      accounts: {
        create: {
          id: account.id,
          accountNumber: account.accountNumber,
          type: account.type,
          principal: account.principal,
          monthlyRatePercent: account.monthlyRatePercent,
          status: account.status,
          createdAt: new Date(account.createdAt),
        },
      },
    },
    include: userInclude,
  });

  return mapUser(user);
}

export async function submitDepositRequest(
  userId: string,
  accountId: string,
  amount: number,
  description: string
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: userInclude,
  });
  if (!user) throw new Error("User not found");

  const account = user.accounts.find((a) => a.id === accountId);
  if (!account) throw new Error("Account not found");

  const portfolio = {
    accounts: user.accounts.map((a) => ({
      id: a.id,
      accountNumber: a.accountNumber,
      type: a.type as PortfolioAccount["type"],
      principal: a.principal,
      monthlyRatePercent: a.monthlyRatePercent,
      investmentPlanId: a.investmentPlanId ?? undefined,
      createdAt: a.createdAt.toISOString(),
      maturityDate: a.maturityDate?.toISOString(),
      status: a.status as PortfolioAccount["status"],
      profitEligibleAt: a.profitEligibleAt?.toISOString(),
      profitRateAmended: a.profitRateAmended,
      amendmentNote: a.amendmentNote ?? undefined,
      dailyCompoundActive: a.dailyCompoundActive,
      dailyCompoundStartDate: a.dailyCompoundStartDate?.toISOString(),
      dailyCompoundEndDate: a.dailyCompoundEndDate?.toISOString(),
      dailyCompoundRatePercent: a.dailyCompoundRatePercent,
    })),
    transactions: user.transactions.map((t) => ({
      id: t.id,
      accountId: t.accountId,
      type: t.type as Transaction["type"],
      amount: t.amount,
      description: t.description,
      status: t.status as Transaction["status"],
      date: t.date.toISOString(),
    })),
  };

  const updated = recordDepositOnPortfolio(portfolio, accountId, amount, description);
  const newTx = updated.transactions[0];

  await prisma.transaction.create({
    data: {
      id: newTx.id,
      userId,
      accountId,
      type: "deposit",
      amount: newTx.amount,
      description: newTx.description,
      status: "pending",
      date: new Date(newTx.date),
    },
  });

  return fetchUserById(userId);
}

export const recordDeposit = submitDepositRequest;

export async function approveDeposit(transactionId: string) {
  const tx = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: {
      account: true,
      user: { select: { id: true, kycStatus: true, firstName: true, lastName: true, email: true } },
    },
  });

  if (!tx || tx.type !== "deposit") throw new Error("Deposit not found");
  if (tx.status !== "pending") throw new Error("Deposit is not pending");

  const approvedAt = new Date();
  const profitEligibleAt = tx.account.profitEligibleAt ?? profitEligibleFromApproval(approvedAt);
  const newPrincipal = tx.account.principal + tx.amount;
  const rates = accountRatesForPrincipal(
    {
      type: tx.account.type as PortfolioAccount["type"],
      monthlyRatePercent: tx.account.monthlyRatePercent,
      investmentPlanId: tx.account.investmentPlanId ?? undefined,
      profitRateAmended: tx.account.profitRateAmended,
    },
    newPrincipal
  );

  const isJulyPromoFd =
    isFdPromoPlanId(tx.account.investmentPlanId) ||
    isFdPromoPlanId(rates.investmentPlanId);

  const plan = rates.investmentPlanId ? getInvestmentPlan(rates.investmentPlanId) : null;
  // Promo FD maturity: approval + snapshotted term (from account rate / current program)
  let promoTermMonths: number = FD_PROMO_TERMS.termMonths;
  if (isJulyPromoFd) {
    try {
      const promoConfig = await getFdPromoConfig();
      promoTermMonths = promoConfig.termMonths;
      // Prefer term implied by account monthly rate vs program return when available
      if (tx.account.monthlyRatePercent > 0 && promoConfig.returnPercent > 0) {
        const implied = Math.round(
          promoConfig.returnPercent / tx.account.monthlyRatePercent
        );
        if (implied >= 1 && implied <= 60) promoTermMonths = implied;
      }
    } catch {
      /* keep default */
    }
  }

  const maturityDate = isJulyPromoFd
    ? (() => {
        const d = new Date(approvedAt);
        d.setMonth(d.getMonth() + promoTermMonths);
        return d;
      })()
    : tx.account.maturityDate ??
      (plan && (tx.account.type === "investment" || tx.account.type === "fixed_deposit")
        ? (() => {
            const d = new Date(approvedAt);
            d.setMonth(d.getMonth() + plan.termMonths);
            return d;
          })()
        : null);

  await prisma.$transaction([
    prisma.transaction.update({
      where: { id: transactionId },
      data: { status: "completed", date: approvedAt },
    }),
    prisma.portfolioAccount.update({
      where: { id: tx.accountId },
      data: {
        principal: newPrincipal,
        monthlyRatePercent: rates.monthlyRatePercent,
        ...(rates.investmentPlanId ? { investmentPlanId: rates.investmentPlanId } : {}),
        ...(isJulyPromoFd && !tx.account.profitEligibleAt
          ? { maturityDate }
          : maturityDate && !tx.account.maturityDate
            ? { maturityDate }
            : {}),
        ...(!tx.account.profitEligibleAt ? { profitEligibleAt } : {}),
      },
    }),
  ]);

  if (rates.investmentPlanId) {
    await createAgreementOnDepositApproval({
      userId: tx.userId,
      userKycStatus: tx.user.kycStatus,
      clientFirstName: tx.user.firstName,
      clientLastName: tx.user.lastName,
      clientEmail: tx.user.email,
      transactionId: tx.id,
      depositAmount: tx.amount,
      account: {
        id: tx.account.id,
        accountNumber: tx.account.accountNumber,
        type: tx.account.type,
        investmentPlanId: rates.investmentPlanId,
        maturityDate: maturityDate ?? tx.account.maturityDate,
      },
      newPrincipal,
      investmentPlanId: rates.investmentPlanId,
      monthlyRatePercent: rates.monthlyRatePercent,
      approvedAt,
    });
  }

  return fetchUserById(tx.userId);
}

export async function rejectDeposit(transactionId: string) {
  const tx = await prisma.transaction.findUnique({
    where: { id: transactionId },
  });

  if (!tx || tx.type !== "deposit") throw new Error("Deposit not found");
  if (tx.status !== "pending") throw new Error("Deposit is not pending");

  await prisma.transaction.update({
    where: { id: transactionId },
    data: { status: "failed" },
  });

  return fetchUserById(tx.userId);
}

export async function updateUserKyc(userId: string, kycData: object) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      kycStatus: "submitted",
      kycData: JSON.stringify(kycData),
    },
    include: userInclude,
  });
  return mapUser(user);
}
