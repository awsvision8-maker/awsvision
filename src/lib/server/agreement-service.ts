import { prisma } from "@/lib/prisma";
import { getInvestmentPlan } from "@/lib/investment-plans";
import { resolvePlanTierFromPrincipal } from "@/lib/portfolio-engine";
import type { InvestmentAgreement, PortfolioAccount } from "@/types";
import type { InvestmentAgreement as DbAgreement } from "@prisma/client";

function addMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function generateAgreementNumber(issuedAt: Date) {
  const y = issuedAt.getFullYear();
  const m = String(issuedAt.getMonth() + 1).padStart(2, "0");
  const d = String(issuedAt.getDate()).padStart(2, "0");
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `AV-AGR-${y}${m}${d}-${suffix}`;
}

export function mapInvestmentAgreement(row: DbAgreement): InvestmentAgreement {
  return {
    id: row.id,
    agreementNumber: row.agreementNumber,
    userId: row.userId,
    accountId: row.accountId,
    transactionId: row.transactionId,
    planId: row.planId,
    planName: row.planName,
    monthlyRatePercent: row.monthlyRatePercent,
    termMonths: row.termMonths,
    totalRoiPercent: row.totalRoiPercent,
    depositAmount: row.depositAmount,
    totalPrincipal: row.totalPrincipal,
    accountNumber: row.accountNumber,
    accountType: row.accountType,
    issuedAt: row.issuedAt.toISOString(),
    maturityDate: row.maturityDate.toISOString(),
    clientFirstName: row.clientFirstName,
    clientLastName: row.clientLastName,
    clientEmail: row.clientEmail,
    amendedAt: row.amendedAt?.toISOString(),
    amendmentNote: row.amendmentNote ?? undefined,
  };
}

export async function listAgreementsForUser(userId: string) {
  const rows = await prisma.investmentAgreement.findMany({
    where: { userId },
    orderBy: { issuedAt: "desc" },
  });
  return rows.map(mapInvestmentAgreement);
}

export async function getAgreementById(id: string) {
  const row = await prisma.investmentAgreement.findUnique({ where: { id } });
  return row ? mapInvestmentAgreement(row) : null;
}

export async function createAgreementOnDepositApproval(params: {
  userId: string;
  userKycStatus: string;
  clientFirstName: string;
  clientLastName: string;
  clientEmail: string;
  transactionId: string;
  depositAmount: number;
  account: {
    id: string;
    accountNumber: string;
    type: string;
    investmentPlanId: string | null;
    maturityDate: Date | null;
  };
  newPrincipal: number;
  investmentPlanId: string;
  monthlyRatePercent: number;
  approvedAt: Date;
}) {
  const { userKycStatus, account } = params;

  if (userKycStatus !== "verified") return null;
  if (account.type !== "investment" && account.type !== "fixed_deposit") return null;

  const existing = await prisma.investmentAgreement.findUnique({
    where: { transactionId: params.transactionId },
  });
  if (existing) return mapInvestmentAgreement(existing);

  const plan =
    getInvestmentPlan(params.investmentPlanId) ??
    resolvePlanTierFromPrincipal(
      {
        type: account.type as PortfolioAccount["type"],
        investmentPlanId: params.investmentPlanId,
      },
      params.newPrincipal
    );

  if (!plan) return null;

  const maturityDate =
    account.maturityDate ?? addMonths(params.approvedAt, plan.termMonths);

  const row = await prisma.investmentAgreement.create({
    data: {
      agreementNumber: generateAgreementNumber(params.approvedAt),
      userId: params.userId,
      accountId: account.id,
      transactionId: params.transactionId,
      planId: plan.id,
      planName: plan.name,
      monthlyRatePercent: params.monthlyRatePercent,
      termMonths: plan.termMonths,
      totalRoiPercent: plan.totalRoiPercent,
      depositAmount: params.depositAmount,
      totalPrincipal: params.newPrincipal,
      accountNumber: account.accountNumber,
      accountType: account.type,
      issuedAt: params.approvedAt,
      maturityDate,
      clientFirstName: params.clientFirstName,
      clientLastName: params.clientLastName,
      clientEmail: params.clientEmail,
    },
  });

  return mapInvestmentAgreement(row);
}

export interface AdminAgreementUpdateInput {
  planId?: string;
  planName?: string;
  monthlyRatePercent?: number;
  termMonths?: number;
  totalRoiPercent?: number;
  totalPrincipal?: number;
  maturityDate?: string;
  amendmentNote?: string;
}

export async function adminUpdateAgreement(
  agreementId: string,
  userId: string,
  input: AdminAgreementUpdateInput
) {
  const existing = await prisma.investmentAgreement.findFirst({
    where: { id: agreementId, userId },
  });
  if (!existing) throw new Error("Agreement not found");

  const plan = input.planId ? getInvestmentPlan(input.planId) : null;
  const planName =
    input.planName?.trim() ||
    (plan ? plan.name : existing.planName);
  const monthlyRatePercent =
    input.monthlyRatePercent ?? existing.monthlyRatePercent;
  const termMonths = input.termMonths ?? existing.termMonths;
  const totalRoiPercent =
    input.totalRoiPercent ?? monthlyRatePercent * termMonths;
  const totalPrincipal = input.totalPrincipal ?? existing.totalPrincipal;
  const maturityDate = input.maturityDate
    ? new Date(input.maturityDate)
    : existing.maturityDate;
  const amendmentNote =
    input.amendmentNote !== undefined
      ? input.amendmentNote.trim() || null
      : existing.amendmentNote;

  const amendedAt = new Date();

  const [updated] = await prisma.$transaction([
    prisma.investmentAgreement.update({
      where: { id: agreementId },
      data: {
        planId: input.planId ?? existing.planId,
        planName,
        monthlyRatePercent,
        termMonths,
        totalRoiPercent,
        totalPrincipal,
        maturityDate,
        amendmentNote,
        amendedAt,
      },
    }),
    prisma.portfolioAccount.update({
      where: { id: existing.accountId },
      data: {
        monthlyRatePercent,
        investmentPlanId: input.planId ?? existing.planId,
        maturityDate,
        profitRateAmended: true,
        amendmentNote: amendmentNote ?? existing.amendmentNote,
        ...(input.totalPrincipal !== undefined ? { principal: totalPrincipal } : {}),
      },
    }),
  ]);

  return mapInvestmentAgreement(updated);
}

async function syncLatestAgreementRate(
  accountId: string,
  monthlyRatePercent: number,
  amendmentNote: string | null
) {
  const latest = await prisma.investmentAgreement.findFirst({
    where: { accountId },
    orderBy: { issuedAt: "desc" },
  });
  if (!latest) return;

  await prisma.investmentAgreement.update({
    where: { id: latest.id },
    data: {
      monthlyRatePercent,
      totalRoiPercent: monthlyRatePercent * latest.termMonths,
      amendmentNote,
      amendedAt: new Date(),
    },
  });
}

export async function adminSetProfitAmendment(
  userId: string,
  accountId: string,
  data: {
    monthlyRatePercent?: number;
    amendmentNote?: string;
    clearAmendment?: boolean;
  }
) {
  const account = await prisma.portfolioAccount.findFirst({
    where: { id: accountId, userId },
  });
  if (!account) throw new Error("Account not found");

  if (account.type !== "investment" && account.type !== "fixed_deposit") {
    throw new Error("Profit amendments apply to investment and fixed deposit accounts only");
  }

  const { accountRatesForPrincipal } = await import("@/lib/portfolio-engine");

  if (data.clearAmendment) {
    const rates = accountRatesForPrincipal(
      {
        type: account.type as PortfolioAccount["type"],
        monthlyRatePercent: account.monthlyRatePercent,
        investmentPlanId: account.investmentPlanId ?? undefined,
        profitRateAmended: false,
      },
      account.principal
    );

    const updated = await prisma.portfolioAccount.update({
      where: { id: accountId },
      data: {
        monthlyRatePercent: rates.monthlyRatePercent,
        investmentPlanId: rates.investmentPlanId ?? account.investmentPlanId,
        profitRateAmended: false,
        amendmentNote: null,
      },
    });

    await syncLatestAgreementRate(accountId, rates.monthlyRatePercent, null);
    return updated;
  }

  if (data.monthlyRatePercent === undefined || data.monthlyRatePercent <= 0) {
    throw new Error("Monthly profit rate is required");
  }

  const note = data.amendmentNote?.trim() || null;

  const updated = await prisma.portfolioAccount.update({
    where: { id: accountId },
    data: {
      monthlyRatePercent: data.monthlyRatePercent,
      profitRateAmended: true,
      amendmentNote: note,
    },
  });

  await syncLatestAgreementRate(accountId, data.monthlyRatePercent, note);
  return updated;
}
