import { listTransactions } from "@/lib/server/admin-service";
import { getAdminId } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";

export async function GET(request: Request) {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") ?? "all";
    const type = searchParams.get("type") ?? "all";

    const transactions = await listTransactions({ status, type, limit: 150 });

    return jsonOk({
      transactions: transactions.map((t) => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        description: t.description,
        status: t.status,
        date: t.date.toISOString(),
        user: t.user,
        account: t.account,
      })),
    });
  } catch (err) {
    console.error("Admin transactions error:", err);
    return jsonError("Failed to load transactions", 500);
  }
}
