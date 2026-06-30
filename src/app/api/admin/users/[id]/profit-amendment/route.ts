import { adminSetProfitAmendment } from "@/lib/server/agreement-service";
import { getAdminId } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";
import { getUserDetail } from "@/lib/server/admin-service";
import { buildPortfolioSnapshot, resolvePlanTierFromPrincipal } from "@/lib/portfolio-engine";
import { mapUser } from "@/lib/server/user-mapper";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const { id: userId } = await params;
    const body = (await request.json()) as {
      accountId?: string;
      monthlyRatePercent?: number;
      amendmentNote?: string;
      clearAmendment?: boolean;
    };

    if (!body.accountId) return jsonError("accountId is required", 400);

    if (
      body.monthlyRatePercent !== undefined &&
      (body.monthlyRatePercent <= 0 || body.monthlyRatePercent > 100)
    ) {
      return jsonError("Monthly rate must be between 0 and 100", 400);
    }

    const { agreementSync } = await adminSetProfitAmendment(userId, body.accountId, body);

    const user = await getUserDetail(userId);
    if (!user) return jsonError("User not found", 404);

    const mapped = mapUser(user);
    const snapshot = buildPortfolioSnapshot(mapped);
    const account = user.accounts.find((a) => a.id === body.accountId);
    const standardPlan = account
      ? resolvePlanTierFromPrincipal(
          {
            type: account.type as "investment" | "fixed_deposit",
            investmentPlanId: account.investmentPlanId ?? undefined,
          },
          account.principal
        )
      : null;

    return jsonOk({
      account: account
        ? {
            id: account.id,
            monthlyRatePercent: account.monthlyRatePercent,
            profitRateAmended: account.profitRateAmended,
            amendmentNote: account.amendmentNote,
            investmentPlanId: account.investmentPlanId,
          }
        : null,
      standardRatePercent: standardPlan?.monthlyRate ?? null,
      standardPlanName: standardPlan?.name ?? null,
      agreementSync,
      portfolioSummary: {
        monthlyProfit: snapshot.monthlyProfit,
        nextMonthRatePercent: snapshot.nextMonthRatePercent,
        nextMonthMonthlyProfit: snapshot.nextMonthMonthlyProfit,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Update failed";
    console.error("Profit amendment error:", err);
    return jsonError(message, 400);
  }
}
