import { listWaitlistEntries } from "@/lib/server/admin-service";
import { getAdminId } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";

export async function GET() {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const entries = await listWaitlistEntries();
    return jsonOk({
      entries: entries.map((e) => ({
        ...e,
        createdAt: e.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    console.error("Admin waitlist error:", err);
    return jsonError("Failed to load waitlist", 500);
  }
}
