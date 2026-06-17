import { fetchUserById } from "@/lib/server/auth-service";
import { saveWithdrawal } from "@/lib/server/form-service";
import { jsonError, jsonOk } from "@/lib/server/api";
import { notifyWithdrawal } from "@/lib/server/notifications";
import { getSessionUserId } from "@/lib/server/session";

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return jsonError("Not authenticated", 401);
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

    const user = await fetchUserById(userId);
    if (!user) {
      return jsonError("User not found", 404);
    }

    const account = user.portfolio?.accounts.find((a) => a.id === accountId);
    if (!account) {
      return jsonError("Account not found", 404);
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
