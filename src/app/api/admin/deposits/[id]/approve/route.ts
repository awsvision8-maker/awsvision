import { approveDeposit } from "@/lib/server/auth-service";
import { getAdminId } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";
import { notifyDepositApproved } from "@/lib/server/notifications";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const { id } = await params;
    const user = await approveDeposit(id);
    if (user) {
      const tx = user.portfolio?.transactions.find((t) => t.id === id);
      if (tx) notifyDepositApproved(user, tx.amount, tx.description, tx.accountId);
    }
    return jsonOk({ user });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Approval failed";
    if (message.includes("not found") || message.includes("not pending")) {
      return jsonError(message, 400);
    }
    console.error("Approve deposit error:", err);
    return jsonError("Approval failed", 500);
  }
}
