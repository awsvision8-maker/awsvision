import { listAgreementsForUser } from "@/lib/server/agreement-service";
import { getAdminId } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const { id: userId } = await params;
    const agreements = await listAgreementsForUser(userId);
    return jsonOk({ agreements });
  } catch (err) {
    console.error("Admin list agreements error:", err);
    return jsonError("Failed to load agreements", 500);
  }
}
