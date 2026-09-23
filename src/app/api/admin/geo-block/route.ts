import { getAdminId } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";
import { WORLD_COUNTRIES, countryName } from "@/lib/countries";
import {
  getBlockedCountryCodes,
  setBlockedCountryCodes,
} from "@/lib/server/geo-block-service";

export async function GET() {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const blockedCodes = await getBlockedCountryCodes();
    return jsonOk({
      blockedCodes,
      countries: WORLD_COUNTRIES,
      blockedLabels: blockedCodes.map((code) => ({
        code,
        name: countryName(code),
      })),
    });
  } catch (err) {
    console.error("Admin geo-block GET error:", err);
    return jsonError("Failed to load geo block settings", 500);
  }
}

export async function PUT(request: Request) {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const body = (await request.json()) as { blockedCodes?: string[] };
    if (!Array.isArray(body.blockedCodes)) {
      return jsonError("blockedCodes must be an array of country codes", 400);
    }

    const blockedCodes = await setBlockedCountryCodes(body.blockedCodes, adminId);
    return jsonOk({
      blockedCodes,
      blockedLabels: blockedCodes.map((code) => ({
        code,
        name: countryName(code),
      })),
    });
  } catch (err) {
    console.error("Admin geo-block PUT error:", err);
    return jsonError("Failed to save geo block settings", 500);
  }
}
