import { VALID_COUNTRY_CODES } from "@/lib/countries";

/** Fallback if DB/API is unreachable (matches initial seed). */
export const DEFAULT_BLOCKED_COUNTRY_CODES = ["PK", "IN", "BD"] as const;

export function getRequestCountry(request: {
  headers: Headers;
  geo?: { country?: string | null };
}): string | null {
  const fromHeader = request.headers.get("x-vercel-ip-country");
  if (fromHeader?.trim()) return fromHeader.trim().toUpperCase();
  const fromGeo = request.geo?.country;
  if (fromGeo?.trim()) return fromGeo.trim().toUpperCase();
  return null;
}

export function isCountryBlocked(
  country: string | null | undefined,
  blockedCodes: Iterable<string>
): boolean {
  if (!country) return false;
  const code = country.trim().toUpperCase();
  if (!VALID_COUNTRY_CODES.has(code) && code.length !== 2) return false;
  const set = blockedCodes instanceof Set ? blockedCodes : new Set(
    Array.from(blockedCodes).map((c) => c.trim().toUpperCase())
  );
  return set.has(code);
}

/** Paths that must never be geo-blocked (admin + config API). */
export function isGeoBlockExemptPath(pathname: string): boolean {
  if (pathname === "/unavailable" || pathname.startsWith("/unavailable/")) return true;
  if (pathname === "/api/geo-block/countries") return true;
  if (pathname.startsWith("/admin")) return true;
  if (pathname.startsWith("/api/admin")) return true;
  return false;
}
