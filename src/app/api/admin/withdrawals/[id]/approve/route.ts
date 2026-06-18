import { approveWithdrawal } from "@/lib/server/admin-service";
import { getAdminId } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const { id } = await params;
    await approveWithdrawal(id);
    return jsonOk({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Approval failed";
    return jsonError(message, 400);
  }
}
