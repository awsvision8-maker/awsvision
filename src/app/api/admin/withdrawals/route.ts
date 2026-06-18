import { prisma } from "@/lib/prisma";
import {
  approveWithdrawal,
  listPendingWithdrawals,
  rejectWithdrawal,
} from "@/lib/server/admin-service";
import { getAdminId } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";

export async function GET() {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const withdrawals = await listPendingWithdrawals();
    const accountIds = [...new Set(withdrawals.map((w) => w.accountId))];
    const accounts = await prisma.portfolioAccount.findMany({
      where: { id: { in: accountIds } },
      select: {
        id: true,
        accountNumber: true,
        type: true,
        principal: true,
        investmentPlanId: true,
      },
    });
    const accountMap = Object.fromEntries(accounts.map((a) => [a.id, a]));

    return jsonOk({
      withdrawals: withdrawals.map((w) => ({
        ...w,
        createdAt: w.createdAt.toISOString(),
        account: accountMap[w.accountId] ?? null,
      })),
    });
  } catch (err) {
    console.error("Admin withdrawals error:", err);
    return jsonError("Failed to load withdrawals", 500);
  }
}
