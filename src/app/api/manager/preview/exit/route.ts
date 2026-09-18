import {
  clearManagerUserPreview,
  getManagerUserPreview,
} from "@/lib/server/manager-preview-session";
import { getManagerAmbassadorId } from "@/lib/server/manager-session";
import { jsonError, jsonOk } from "@/lib/server/api";

/** Exit brand ambassador portal preview (view-only mode). */
export async function POST() {
  const ambassadorId = await getManagerAmbassadorId();
  if (!ambassadorId) return jsonError("Unauthorized", 401);
  const preview = await getManagerUserPreview();
  await clearManagerUserPreview();
  return jsonOk({
    success: true,
    userId: preview?.userId ?? null,
  });
}
