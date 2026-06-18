import { getAmbassadorDashboard } from "@/lib/server/ambassador-service";
import { getManagerAmbassadorId } from "@/lib/server/manager-session";
import { jsonError, jsonOk } from "@/lib/server/api";

export async function GET() {
  const ambassadorId = await getManagerAmbassadorId();
  if (!ambassadorId) return jsonError("Unauthorized", 401);

  try {
    const dashboard = await getAmbassadorDashboard(ambassadorId);
    if (!dashboard) return jsonError("Not found", 404);
    return jsonOk(dashboard);
  } catch (err) {
    console.error("Manager dashboard error:", err);
    return jsonError("Failed to load dashboard", 500);
  }
}
