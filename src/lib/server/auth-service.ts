import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { nonprofitApplicationToProfile } from "@/lib/nonprofit-signup-form";
import {
  createAccountFromSignup,
  createNonprofitPortfolio,
  recordDepositOnPortfolio,
} from "@/lib/portfolio-engine";
import { mapUser, userInclude } from "@/lib/server/user-mapper";
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

export async function fetchUserById(userId: string) {
  const row = await prisma.user.findUnique({
    where: { id: userId },
    include: userInclude,
  });
  return row ? mapUser(row) : null;
}

export async function createIndividualUser(data: SignupApplication, kycData: object) {
  const createdAt = new Date();
  const { account, openingTransaction } = createAccountFromSignup(data, createdAt);

  const user = await prisma.user.create({
    data: {
      email: data.email.toLowerCase(),
      passwordHash: await hashPassword(data.password),
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      onlineId: data.onlineId,
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
      transactions: {
        create: {
          id: openingTransaction.id,
          accountId: account.id,
          type: openingTransaction.type,
          amount: openingTransaction.amount,
          description: openingTransaction.description,
          status: openingTransaction.status,
          date: new Date(openingTransaction.date),
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
  const openingTx = portfolio.transactions[0];

  const user = await prisma.user.create({
    data: {
      email: data.repEmail.toLowerCase(),
      passwordHash: await hashPassword(data.password),
      firstName: data.repFirstName,
      lastName: data.repLastName,
      phone: data.repPhone,
      onlineId: data.onlineId,
      kycStatus: "submitted",
      profileType: "nonprofit",
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
      transactions: {
        create: {
          id: openingTx.id,
          accountId: account.id,
          type: openingTx.type,
          amount: openingTx.amount,
          description: openingTx.description,
          status: openingTx.status,
          date: new Date(openingTx.date),
        },
      },
    },
    include: userInclude,
  });

  return mapUser(user);
}

export async function recordDeposit(
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
  const updatedAccount = updated.accounts.find((a) => a.id === accountId)!;
  const newTx = updated.transactions[0];

  await prisma.$transaction([
    prisma.portfolioAccount.update({
      where: { id: accountId },
      data: { principal: updatedAccount.principal },
    }),
    prisma.transaction.create({
      data: {
        id: newTx.id,
        userId,
        accountId,
        type: newTx.type,
        amount: newTx.amount,
        description: newTx.description,
        status: newTx.status,
        date: new Date(newTx.date),
      },
    }),
  ]);

  return fetchUserById(userId);
}

export async function updateUserKyc(userId: string, kycData: object) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      kycStatus: "verified",
      kycData: JSON.stringify(kycData),
    },
    include: userInclude,
  });
  return mapUser(user);
}
