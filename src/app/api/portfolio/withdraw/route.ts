import { requireVerifiedKyc } from "@/lib/server/kyc-guard";
import { saveWithdrawal } from "@/lib/server/form-service";
import { jsonError, jsonOk } from "@/lib/server/api";
import { rejectIfAdminPreview } from "@/lib/server/admin-preview-session";
import { notifyWithdrawal } from "@/lib/server/notifications";
import { getSessionUserId } from "@/lib/server/session";
import { isFdPromoPlanId } from "@/lib/promotions";

export async function POST(request: Request) {
  const blocked = await rejectIfAdminPreview();
  if (blocked) return blocked;

  const userId = await getSessionUserId();
  if (!userId) {
    return jsonError("Not authenticated", 401);
  }

  const user = await requireVerifiedKyc(userId);
  if (!user) {
    return jsonError(
      "Your identity must be verified by an administrator before requesting a withdrawal",
      403
    );
  }

  try {
    const { accountId, amount, method } = (await request.json()) as {
      accountId?: string;
      amount?: number;
      method?: string;
    };

    if (!accountId || !amount || amount < 50 || !method) {
      return jsonError("Invalid withdrawal request", 400);
    }

    const account = user.portfolio?.accounts.find((a) => a.id === accountId);
    if (!account) {
      return jsonError("Account not found", 404);
    }

    // July Wealth Accelerator FD: capital + profit withdrawable only after 6-month maturity
    if (isFdPromoPlanId(account.investmentPlanId)) {
      if (!account.maturityDate) {
        return jsonError(
          "July Wealth Accelerator FD withdrawals open only after the 6-month maturity date. Contact your relationship manager if you need help.",
          403
        );
      }
      const maturity = new Date(account.maturityDate);
      if (Number.isNaN(maturity.getTime()) || new Date() < maturity) {
        const maturityLabel = Number.isNaN(maturity.getTime())
          ? "maturity"
          : maturity.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });
        return jsonError(
          `July Wealth Accelerator FD funds can be withdrawn only after ${maturityLabel} (6-month term). Early withdrawal is not available on this promotional package.`,
          403
        );
      }
    }

    const reference = `WR-${Date.now().toString().slice(-8)}`;

    await saveWithdrawal({
      userId,
      accountId,
      amount,
      method,
      reference,
    });

    notifyWithdrawal(user, amount, method, reference, accountId);

    return jsonOk({ ok: true, reference });
  } catch (err) {
    console.error("Withdrawal error:", err);
    return jsonError("Failed to submit withdrawal", 500);
  }
}
