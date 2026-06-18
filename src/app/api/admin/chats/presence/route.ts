import { listLiveVisitors, serializePresence } from "@/lib/server/presence-service";
import { getAdminId } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";

export async function GET() {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const visitors = await listLiveVisitors();
    const serialized = visitors.map(serializePresence);
    return jsonOk({
      website: serialized.filter((v) => v.status === "website"),
      chat: serialized.filter((v) => v.status === "chat"),
      visitors: serialized,
    });
  } catch (err) {
    console.error("Admin presence error:", err);
    return jsonError("Failed to load live visitors", 500);
  }
}
