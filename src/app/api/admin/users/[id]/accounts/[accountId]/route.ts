import {
  adminAdjustAccountBalance,
  adminUpdatePortfolioAccount,
  type AdminAccountUpdate,
} from "@/lib/server/admin-service";
import { getAdminId } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";
import { getInvestmentPlan } from "@/lib/investment-plans";

function matchedPlanPayload(
  account: {
    principal: number;
    monthlyRatePercent: number;
    investmentPlanId: string | null;
  } | undefined
) {
  if (!account) return null;
  const plan = account.investmentPlanId
    ? getInvestmentPlan(account.investmentPlanId)
    : null;
  return {
    id: plan?.id ?? null,
    name: plan?.name ?? "Savings tier",
    monthlyRate: plan?.monthlyRate ?? account.monthlyRatePercent,
    principal: account.principal,
  };
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; accountId: string }> }
) {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const { id: userId, accountId } = await params;
    const body = (await request.json()) as AdminAccountUpdate;
    const result = await adminUpdatePortfolioAccount(userId, accountId, body);
    const account = result.user?.accounts.find((a) => a.id === accountId);
    return jsonOk({
      success: true,
      matchedPlan: matchedPlanPayload(account),
      agreementSync: result.agreementSync,
    });
  } catch (err) {
    console.error("Admin account update error:", err);
    return jsonError(err instanceof Error ? err.message : "Failed to update account", 400);
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; accountId: string }> }
) {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const { id: userId, accountId } = await params;
    const body = (await request.json()) as {
      amount?: number;
      direction?: "credit" | "debit";
      description?: string;
    };

    if (!body.amount || body.amount <= 0) {
      return jsonError("Valid amount required", 400);
    }
    if (body.direction !== "credit" && body.direction !== "debit") {
      return jsonError("Direction must be credit or debit", 400);
    }

    const result = await adminAdjustAccountBalance(
      userId,
      accountId,
      body.amount,
      body.direction,
      body.description ?? ""
    );
    const account = result.user?.accounts.find((a) => a.id === accountId);
    return jsonOk({
      success: true,
      matchedPlan: matchedPlanPayload(account),
      agreementSync: result.agreementSync,
    });
  } catch (err) {
    console.error("Admin balance adjust error:", err);
    return jsonError(err instanceof Error ? err.message : "Failed to adjust balance", 400);
  }
}
