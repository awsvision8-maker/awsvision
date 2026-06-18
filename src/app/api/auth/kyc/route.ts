import { updateUserKyc } from "@/lib/server/auth-service";
import { jsonError, jsonOk } from "@/lib/server/api";
import { getSessionUserId } from "@/lib/server/session";
import type { KYCData } from "@/types";

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return jsonError("Not authenticated", 401);
  }

  try {
    const kycData = (await request.json()) as KYCData;
    const user = await updateUserKyc(userId, kycData);
    return jsonOk({ user });
  } catch (err) {
    console.error("KYC update error:", err);
    return jsonError("Failed to update KYC", 500);
  }
}
