import { recordDeposit } from "@/lib/server/auth-service";
import { jsonError, jsonOk } from "@/lib/server/api";
import { rejectIfAdminPreview } from "@/lib/server/admin-preview-session";
import { requireVerifiedKyc } from "@/lib/server/kyc-guard";
import { notifyDeposit } from "@/lib/server/notifications";
import { getSessionUserId } from "@/lib/server/session";

export async function POST(request: Request) {
  const blocked = await rejectIfAdminPreview();
  if (blocked) return blocked;

  const userId = await getSessionUserId();
  if (!userId) {
    return jsonError("Not authenticated", 401);
  }

  const verifiedUser = await requireVerifiedKyc(userId);
  if (!verifiedUser) {
    return jsonError(
      "Your identity must be verified by an administrator before depositing funds",
      403
    );
  }

  try {
    const body = (await request.json()) as {
      accountId?: string;
      amount?: number;
      description?: string;
      method?: string;
      proofFront?: string;
      proofBack?: string;
    };

    const { accountId, amount, description, method, proofFront, proofBack } = body;

    if (!accountId || !amount || amount < 100 || !description) {
      return jsonError("Invalid deposit request", 400);
    }

    const user = await recordDeposit(userId, accountId, amount, description, {
      method,
      proofFront,
      proofBack,
    });
    if (user) notifyDeposit(user, amount, description, accountId);
    return jsonOk({ user });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Deposit failed";
    if (message === "Account not found") {
      return jsonError(message, 404);
    }
    if (
      message.includes("eCheck") ||
      message.includes("cheque") ||
      message.includes("too large")
    ) {
      return jsonError(message, 400);
    }
    console.error("Deposit error:", err);
    return jsonError("Deposit failed", 500);
  }
}
