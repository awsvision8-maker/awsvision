import { clearAdminUserPreview, getAdminUserPreview } from "@/lib/server/admin-preview-session";
import { getAdminId } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";

/** Exit admin portal preview (view-only mode). */
export async function POST() {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);
  const preview = await getAdminUserPreview();
  await clearAdminUserPreview();
  return jsonOk({
    success: true,
    userId: preview?.userId ?? null,
  });
}
