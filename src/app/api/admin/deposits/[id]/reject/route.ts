import { rejectDeposit } from "@/lib/server/auth-service";
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
    const user = await rejectDeposit(id);
    return jsonOk({ user });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Rejection failed";
    if (message.includes("not found") || message.includes("not pending")) {
      return jsonError(message, 400);
    }
    console.error("Reject deposit error:", err);
    return jsonError("Rejection failed", 500);
  }
}
