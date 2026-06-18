import { getUserDetail, adminUpdateUserProfile, adminUpdateNonprofitProfile } from "@/lib/server/admin-service";
import { getAdminId } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";
import { buildPortfolioSnapshot } from "@/lib/portfolio-engine";
import { mapUser } from "@/lib/server/user-mapper";

function serializeUserDetail(user: NonNullable<Awaited<ReturnType<typeof getUserDetail>>>) {
  const mapped = mapUser(user);
  const snapshot = buildPortfolioSnapshot(mapped);

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    onlineId: user.onlineId,
    kycStatus: user.kycStatus,
    profileType: user.profileType,
    createdAt: user.createdAt.toISOString(),
    kycData: user.kycData ? JSON.parse(user.kycData) : null,
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
    })),
    transactions: user.transactions.map((t) => ({
      ...t,
      date: t.date.toISOString(),
    })),
    pendingDeposits: user.transactions
      .filter((t) => t.type === "deposit" && t.status === "pending")
      .map((t) => ({
        id: t.id,
        amount: t.amount,
        description: t.description,
        date: t.date.toISOString(),
        accountId: t.accountId,
      })),
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

    return jsonOk({ user: serializeUserDetail(user) });
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
      nonprofit?: { fundCapital?: number; monthlyRate?: number };
    };

    if (body.nonprofit) {
      await adminUpdateNonprofitProfile(id, body.nonprofit);
    }

    const profileFields = {
      firstName: body.firstName,
      lastName: body.lastName,
      phone: body.phone,
      email: body.email,
      kycStatus: body.kycStatus,
    };
    const hasProfile = Object.values(profileFields).some((v) => v !== undefined);

    if (hasProfile) {
      await adminUpdateUserProfile(id, profileFields);
    }

    if (!hasProfile && !body.nonprofit) {
      return jsonError("No fields to update", 400);
    }

    const user = await getUserDetail(id);
    if (!user) return jsonError("User not found", 404);

    return jsonOk({ user: serializeUserDetail(user) });
  } catch (err) {
    console.error("Admin user update error:", err);
    return jsonError(err instanceof Error ? err.message : "Failed to update user", 400);
  }
}
