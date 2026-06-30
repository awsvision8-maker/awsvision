import { jsonError, jsonOk } from "@/lib/server/api";
import { listPendingKycDocumentRequests } from "@/lib/server/kyc-service";
import { getSessionUserId } from "@/lib/server/session";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return jsonError("Not authenticated", 401);

  try {
    const requests = await listPendingKycDocumentRequests(userId);
    return jsonOk({ requests });
  } catch (err) {
    console.error("KYC requests error:", err);
    return jsonError("Failed to load requests", 500);
  }
}
