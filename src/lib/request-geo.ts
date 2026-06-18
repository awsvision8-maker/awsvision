export interface ClientGeo {
  ipAddress: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  locationLabel: string;
}

export function getClientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip") ?? request.headers.get("x-vercel-forwarded-for");
}

export function formatLocation(city?: string | null, region?: string | null, country?: string | null) {
  const parts = [city, region, country].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "Unknown";
}

export function getClientGeoFromRequest(request: Request): ClientGeo {
  const city = request.headers.get("x-vercel-ip-city");
  const region = request.headers.get("x-vercel-ip-country-region");
  const country = request.headers.get("x-vercel-ip-country");

  return {
    ipAddress: getClientIp(request),
    city,
    region,
    country,
    locationLabel: formatLocation(city, region, country),
  };
}

/** Optional fallback when Vercel geo headers are missing (e.g. local dev). */
export async function resolveGeoFromIp(ip: string | null): Promise<ClientGeo> {
  if (!ip || ip === "127.0.0.1" || ip.startsWith("::1") || ip.startsWith("192.168.")) {
    return {
      ipAddress: ip,
      city: null,
      region: null,
      country: null,
      locationLabel: "Unknown",
    };
  }

  try {
    const res = await fetch(`http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,city,regionName,country`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("geo lookup failed");
    const data = (await res.json()) as {
      status?: string;
      city?: string;
      regionName?: string;
      country?: string;
    };
    if (data.status !== "success") {
      return {
        ipAddress: ip,
        city: null,
        region: null,
        country: null,
        locationLabel: "Unknown",
      };
    }
    return {
      ipAddress: ip,
      city: data.city ?? null,
      region: data.regionName ?? null,
      country: data.country ?? null,
      locationLabel: formatLocation(data.city, data.regionName, data.country),
    };
  } catch {
    return {
      ipAddress: ip,
      city: null,
      region: null,
      country: null,
      locationLabel: "Unknown",
    };
  }
}

export async function getClientGeo(request: Request): Promise<ClientGeo> {
  const fromHeaders = getClientGeoFromRequest(request);
  if (fromHeaders.locationLabel !== "Unknown") return fromHeaders;
  return resolveGeoFromIp(fromHeaders.ipAddress);
}
