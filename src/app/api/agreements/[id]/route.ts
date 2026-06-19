import { getAgreementById } from "@/lib/server/agreement-service";
import { getAdminId } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";
import { getSessionUserId } from "@/lib/server/session";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const agreement = await getAgreementById(id);
    if (!agreement) return jsonError("Agreement not found", 404);

    const userId = await getSessionUserId();
    const adminId = await getAdminId();

    if (!adminId && userId !== agreement.userId) {
      return jsonError("Unauthorized", 401);
    }

    return jsonOk({ agreement });
  } catch (err) {
    console.error("Get agreement error:", err);
    return jsonError("Failed to load agreement", 500);
  }
}
