import {
  getUserDetail,
  adminUpdateUserProfile,
  adminUpdateNonprofitProfile,
  adminAssignUserAmbassador,
  adminDeleteUser,
} from "@/lib/server/admin-service";
import { getAdminId } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";
import { buildPortfolioSnapshot } from "@/lib/portfolio-engine";
import { mapUser } from "@/lib/server/user-mapper";
import { prisma } from "@/lib/prisma";

async function proofFlagsForIds(ids: string[]) {
  if (ids.length === 0) return new Map<string, { hasProofFront: boolean; hasProofBack: boolean }>();
  const flags = await prisma.$queryRawUnsafe<
    { id: string; hasProofFront: boolean; hasProofBack: boolean }[]
  >(
    `SELECT id,
      (COALESCE(length("proofFront"), 0) > 10) AS "hasProofFront",
      (COALESCE(length("proofBack"), 0) > 10) AS "hasProofBack"
     FROM "Transaction"
     WHERE id IN (${ids.map((_, i) => `$${i + 1}`).join(",")})`,
    ...ids
  );
  return new Map(flags.map((f) => [f.id, f]));
}

async function serializeUserDetail(
  user: NonNullable<Awaited<ReturnType<typeof getUserDetail>>>
) {
  const mapped = mapUser(user);
  const snapshot = buildPortfolioSnapshot(mapped);
  const deposits = user.transactions.filter((t) => t.type === "deposit");
  const pending = deposits.filter((t) => t.status === "pending");
  const flagMap = await proofFlagsForIds(deposits.map((t) => t.id));

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    onlineId: user.onlineId,
    kycStatus: user.kycStatus,
    profileType: user.profileType,
    accountRestricted: Boolean(user.accountRestricted),
    accountRestrictedAt: user.accountRestrictedAt?.toISOString() ?? null,
    accountRestrictedNote: user.accountRestrictedNote ?? null,
    createdAt: user.createdAt.toISOString(),
    kycData: user.kycData ? JSON.parse(user.kycData) : null,
    pendingKycRequests: user.kycDocumentRequests?.map((r) => ({
      documentKey: r.documentKey,
      adminNote: r.adminNote,
    })) ?? [],
    ambassador: user.ambassador
      ? {
          id: user.ambassador.id,
          firstName: user.ambassador.firstName,
          lastName: user.ambassador.lastName,
          email: user.ambassador.email,
          referralCode: user.ambassador.referralCode,
          status: user.ambassador.status,
        }
      : null,
    nonprofit: user.nonprofitProfile,
    portfolioSummary: {
      totalBalance: snapshot.totalBalance,
      approvedDepositTotal: snapshot.approvedDepositTotal,
      monthlyProfit: snapshot.monthlyProfit,
      nextMonthMonthlyProfit: snapshot.nextMonthMonthlyProfit,
      profitAccrualActive: snapshot.profitAccrualActive,
      profitEligibleAt: snapshot.profitEligibleAt,
      nextMonthRatePercent: snapshot.nextMonthRatePercent,
    },
    accounts: user.accounts.map((a) => ({
      id: a.id,
      accountNumber: a.accountNumber,
      type: a.type,
      principal: a.principal,
      monthlyRatePercent: a.monthlyRatePercent,
      status: a.status,
      investmentPlanId: a.investmentPlanId,
      createdAt: a.createdAt.toISOString(),
      maturityDate: a.maturityDate?.toISOString() ?? null,
      profitEligibleAt: a.profitEligibleAt?.toISOString() ?? null,
      profitRateAmended: a.profitRateAmended,
      amendmentNote: a.amendmentNote,
      dailyCompoundActive: a.dailyCompoundActive,
      dailyCompoundStartDate: a.dailyCompoundStartDate?.toISOString() ?? null,
      dailyCompoundEndDate: a.dailyCompoundEndDate?.toISOString() ?? null,
      dailyCompoundRatePercent: a.dailyCompoundRatePercent,
    })),
    transactions: user.transactions.map((t) => {
      const f = t.type === "deposit" ? flagMap.get(t.id) : undefined;
      return {
        id: t.id,
        userId: t.userId,
        accountId: t.accountId,
        type: t.type,
        amount: t.amount,
        description: t.description,
        status: t.status,
        date: t.date.toISOString(),
        hasProofFront: Boolean(f?.hasProofFront),
        hasProofBack: Boolean(f?.hasProofBack),
      };
    }),
    depositProofs: deposits.map((t) => {
      const f = flagMap.get(t.id);
      return {
        id: t.id,
        amount: t.amount,
        description: t.description,
        status: t.status,
        date: t.date.toISOString(),
        accountId: t.accountId,
        hasProofFront: Boolean(f?.hasProofFront),
        hasProofBack: Boolean(f?.hasProofBack),
      };
    }),
    pendingDeposits: pending.map((t) => {
      const f = flagMap.get(t.id);
      return {
        id: t.id,
        amount: t.amount,
        description: t.description,
        date: t.date.toISOString(),
        accountId: t.accountId,
        hasProofFront: Boolean(f?.hasProofFront),
        hasProofBack: Boolean(f?.hasProofBack),
      };
    }),
    withdrawals: user.withdrawalRequests.map((w) => ({
      ...w,
      createdAt: w.createdAt.toISOString(),
    })),
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const { id } = await params;
    const user = await getUserDetail(id);
    if (!user) return jsonError("User not found", 404);

    return jsonOk({ user: await serializeUserDetail(user) });
  } catch (err) {
    console.error("Admin user detail error:", err);
    return jsonError("Failed to load user", 500);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const { id } = await params;
    const body = (await request.json()) as {
      firstName?: string;
      lastName?: string;
      phone?: string;
      email?: string;
      kycStatus?: string;
      accountRestricted?: boolean;
      accountRestrictedNote?: string | null;
      nonprofit?: { fundCapital?: number; monthlyRate?: number };
      referralCode?: string | null;
      ambassadorId?: string | null;
      clear?: boolean;
    };

    const hasReferralAssign =
      body.clear === true ||
      body.referralCode !== undefined ||
      body.ambassadorId !== undefined;

    if (body.nonprofit) {
      await adminUpdateNonprofitProfile(id, body.nonprofit);
    }

    const profileFields = {
      firstName: body.firstName,
      lastName: body.lastName,
      accountRestricted: body.accountRestricted,
      accountRestrictedNote: body.accountRestrictedNote,
      phone: body.phone,
      email: body.email,
      kycStatus: body.kycStatus,
    };
    const hasProfile = Object.values(profileFields).some((v) => v !== undefined);

    if (hasProfile) {
      await adminUpdateUserProfile(id, profileFields);
    }

    if (hasReferralAssign) {
      await adminAssignUserAmbassador(id, {
        referralCode: body.referralCode,
        ambassadorId: body.ambassadorId,
        clear: body.clear === true,
      });
    }

    if (!hasProfile && !body.nonprofit && !hasReferralAssign) {
      return jsonError("No fields to update", 400);
    }

    const user = await getUserDetail(id);
    if (!user) return jsonError("User not found", 404);

    return jsonOk({ user: await serializeUserDetail(user) });
  } catch (err) {
    console.error("Admin user update error:", err);
    return jsonError(err instanceof Error ? err.message : "Failed to update user", 400);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const { id } = await params;
    const deleted = await adminDeleteUser(id);
    return jsonOk({ success: true, deleted });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Delete failed";
    if (message.includes("not found")) return jsonError(message, 404);
    console.error("Admin delete user error:", err);
    return jsonError("Failed to delete user", 500);
  }
}
