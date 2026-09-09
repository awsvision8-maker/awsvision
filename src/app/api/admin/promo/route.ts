import { getAdminId } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";
import {
  resolveFdPromoPreview,
  updateFdPromoConfig,
  type UpdateFdPromoInput,
} from "@/lib/server/fd-promo-config";

export async function GET() {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const preview = await resolveFdPromoPreview();
    return jsonOk(preview);
  } catch (err) {
    console.error("Admin promo GET error:", err);
    return jsonError("Failed to load promo config", 500);
  }
}

export async function PUT(request: Request) {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const body = (await request.json()) as UpdateFdPromoInput;
    const config = await updateFdPromoConfig(body, adminId);
    const promo = (await resolveFdPromoPreview()).promo;
    return jsonOk({
      config,
      promo,
      offeringOpen: config.isActive && new Date() <= new Date(config.endsAt),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update promo";
    console.error("Admin promo PUT error:", err);
    return jsonError(message, 400);
  }
}
