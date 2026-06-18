import { getAdminStats } from "@/lib/server/admin-service";
import { getAdminId } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";

export async function GET() {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const stats = await getAdminStats();
    return jsonOk(stats);
  } catch (err) {
    console.error("Admin stats error:", err);
    return jsonError("Failed to load stats", 500);
  }
}
