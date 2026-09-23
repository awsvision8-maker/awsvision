import { getAdminId } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";
import {
  getVisitorAnalyticsSummary,
  listSiteVisitors,
} from "@/lib/server/visitor-analytics-service";

export async function GET(request: Request) {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") ?? undefined;
    const limit = Number(searchParams.get("limit") ?? "50");

    const [visitors, summary] = await Promise.all([
      listSiteVisitors({ q, limit }),
      getVisitorAnalyticsSummary(),
    ]);

    return jsonOk({ visitors, summary });
  } catch (err) {
    console.error("Admin visitors error:", err);
    return jsonError("Failed to load visitors", 500);
  }
}
