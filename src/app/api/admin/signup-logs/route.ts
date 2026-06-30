import { getAdminId } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";
import { listSignupAttemptLogs } from "@/lib/server/signup-log-service";

export async function GET(request: Request) {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") ?? "all";
    const profileType = searchParams.get("profileType") ?? "all";
    const limit = Number(searchParams.get("limit") ?? "100");

    const logs = await listSignupAttemptLogs({ status, profileType, limit });
    const failedCount = logs.filter((l) => l.status === "failed").length;
    const successCount = logs.filter((l) => l.status === "success").length;

    return jsonOk({ logs, failedCount, successCount, total: logs.length });
  } catch (err) {
    console.error("Admin signup logs error:", err);
    return jsonError("Failed to load signup logs", 500);
  }
}
