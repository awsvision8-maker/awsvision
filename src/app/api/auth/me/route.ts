import { fetchUserById } from "@/lib/server/auth-service";
import { jsonError, jsonOk } from "@/lib/server/api";
import {
  getAdminUserPreview,
  getPortalUserId,
} from "@/lib/server/admin-preview-session";
import { getManagerUserPreview } from "@/lib/server/manager-preview-session";

export async function GET() {
  const userId = await getPortalUserId();
  if (!userId) {
    return jsonError("Not authenticated", 401);
  }

  const user = await fetchUserById(userId);
  if (!user) {
    return jsonError("User not found", 404);
  }

  const adminPreview = await getAdminUserPreview();
  const managerPreview = adminPreview ? null : await getManagerUserPreview();

  return jsonOk({
    user,
    viewOnly: Boolean(adminPreview || managerPreview),
    adminPreview: Boolean(adminPreview),
    managerPreview: Boolean(managerPreview),
  });
}
