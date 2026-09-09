import { jsonOk } from "@/lib/server/api";
import { resolveActiveFdPromo } from "@/lib/server/fd-promo-config";
import { buildActiveFdPromo, defaultFdPromoRuntimeConfig } from "@/lib/promotions";

/** Public promo payload for banners / signup (null when inactive or expired) */
export async function GET() {
  try {
    const promo = await resolveActiveFdPromo();
    return jsonOk({ promo, offeringOpen: Boolean(promo) });
  } catch (err) {
    console.error("Public promo fetch error:", err);
    const fallback = buildActiveFdPromo(defaultFdPromoRuntimeConfig());
    return jsonOk({ promo: fallback, offeringOpen: true });
  }
}
