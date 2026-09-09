import { listAgreementsForUser } from "@/lib/server/agreement-service";
import { jsonError, jsonOk } from "@/lib/server/api";
import { getPortalUserId } from "@/lib/server/admin-preview-session";

export async function GET() {
  const userId = await getPortalUserId();
  if (!userId) return jsonError("Not authenticated", 401);

  try {
    const agreements = await listAgreementsForUser(userId);
    return jsonOk({ agreements });
  } catch (err) {
    console.error("List agreements error:", err);
    return jsonError("Failed to load agreements", 500);
  }
}
