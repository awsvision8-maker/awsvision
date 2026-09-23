import { listUsersForNotificationOptions } from "@/lib/server/admin-service";
import { getAdminId } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";

export async function GET() {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const users = await listUsersForNotificationOptions();
    return jsonOk({ users });
  } catch (err) {
    console.error("Admin user options error:", err);
    return jsonError("Failed to load users", 500);
  }
}
