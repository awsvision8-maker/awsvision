export interface ClientGeo {
  ipAddress: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  /** Approximate IP geolocation */
  latitude: number | null;
  longitude: number | null;
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

function parseCoord(value: string | null): number | null {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function getClientGeoFromRequest(request: Request): ClientGeo {
  const city = request.headers.get("x-vercel-ip-city");
  const region = request.headers.get("x-vercel-ip-country-region");
  const country = request.headers.get("x-vercel-ip-country");
  const latitude = parseCoord(request.headers.get("x-vercel-ip-latitude"));
  const longitude = parseCoord(request.headers.get("x-vercel-ip-longitude"));

  return {
    ipAddress: getClientIp(request),
    city,
    region,
    country,
    latitude,
    longitude,
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
      latitude: null,
      longitude: null,
      locationLabel: "Unknown",
    };
  }

  try {
    const res = await fetch(
      `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,city,regionName,country,lat,lon`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error("geo lookup failed");
    const data = (await res.json()) as {
      status?: string;
      city?: string;
      regionName?: string;
      country?: string;
      lat?: number;
      lon?: number;
    };
    if (data.status !== "success") {
      return {
        ipAddress: ip,
        city: null,
        region: null,
        country: null,
        latitude: null,
        longitude: null,
        locationLabel: "Unknown",
      };
    }
    return {
      ipAddress: ip,
      city: data.city ?? null,
      region: data.regionName ?? null,
      country: data.country ?? null,
      latitude: typeof data.lat === "number" ? data.lat : null,
      longitude: typeof data.lon === "number" ? data.lon : null,
      locationLabel: formatLocation(data.city, data.regionName, data.country),
    };
  } catch {
    return {
      ipAddress: ip,
      city: null,
      region: null,
      country: null,
      latitude: null,
      longitude: null,
      locationLabel: "Unknown",
    };
  }
}

export async function getClientGeo(request: Request): Promise<ClientGeo> {
  const fromHeaders = getClientGeoFromRequest(request);
  if (fromHeaders.locationLabel !== "Unknown" && fromHeaders.latitude != null) {
    return fromHeaders;
  }
  if (fromHeaders.locationLabel !== "Unknown") {
    const enriched = await resolveGeoFromIp(fromHeaders.ipAddress);
    return {
      ...fromHeaders,
      latitude: enriched.latitude ?? fromHeaders.latitude,
      longitude: enriched.longitude ?? fromHeaders.longitude,
      city: fromHeaders.city ?? enriched.city,
      region: fromHeaders.region ?? enriched.region,
      country: fromHeaders.country ?? enriched.country,
      locationLabel:
        fromHeaders.locationLabel !== "Unknown"
          ? fromHeaders.locationLabel
          : enriched.locationLabel,
    };
  }
  return resolveGeoFromIp(fromHeaders.ipAddress);
}
