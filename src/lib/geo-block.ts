/** ISO 3166-1 alpha-2 countries where the public site is not offered. */
export const GEO_BLOCKED_COUNTRIES = new Set(["PK", "IN", "BD"]);

export function isGeoBlockedCountry(country: string | null | undefined): boolean {
  if (!country) return false;
  return GEO_BLOCKED_COUNTRIES.has(country.trim().toUpperCase());
}

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
