import { listAgreementsForUser } from "@/lib/server/agreement-service";
import { jsonError, jsonOk } from "@/lib/server/api";
import { getSessionUserId } from "@/lib/server/session";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return jsonError("Not authenticated", 401);

  try {
    const agreements = await listAgreementsForUser(userId);
    return jsonOk({ agreements });
  } catch (err) {
    console.error("List agreements error:", err);
    return jsonError("Failed to load agreements", 500);
  }
}
