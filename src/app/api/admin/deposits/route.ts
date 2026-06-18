import { listPendingDeposits } from "@/lib/server/admin-service";
import { getAdminId } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";

export async function GET() {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const deposits = await listPendingDeposits();
    return jsonOk({
      deposits: deposits.map((d) => ({
        id: d.id,
        amount: d.amount,
        description: d.description,
        date: d.date.toISOString(),
        user: d.user,
        account: d.account,
      })),
    });
  } catch (err) {
    console.error("List deposits error:", err);
    return jsonError("Failed to load deposits", 500);
  }
}
