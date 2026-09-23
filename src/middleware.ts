import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  DEFAULT_BLOCKED_COUNTRY_CODES,
  getRequestCountry,
  isCountryBlocked,
  isGeoBlockExemptPath,
} from "@/lib/geo-block";

type CacheEntry = { codes: string[]; exp: number };

declare global {
  // eslint-disable-next-line no-var
  var __awsvisionGeoBlockCache: CacheEntry | undefined;
}

async function loadBlockedCodes(request: NextRequest): Promise<string[]> {
  const cached = globalThis.__awsvisionGeoBlockCache;
  if (cached && cached.exp > Date.now()) {
    return cached.codes;
  }

  try {
    const url = new URL("/api/geo-block/countries", request.url);
    const res = await fetch(url, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(2000),
    });
    if (!res.ok) throw new Error(`geo list ${res.status}`);
    const data = (await res.json()) as { codes?: string[] };
    const codes = Array.isArray(data.codes)
      ? data.codes.map((c) => String(c).toUpperCase())
      : [...DEFAULT_BLOCKED_COUNTRY_CODES];
    globalThis.__awsvisionGeoBlockCache = {
      codes,
      exp: Date.now() + 30_000,
    };
    return codes;
  } catch {
    return cached?.codes ?? [...DEFAULT_BLOCKED_COUNTRY_CODES];
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isGeoBlockExemptPath(pathname)) {
    return NextResponse.next();
  }

  const country = getRequestCountry(request);
  if (!country) {
    return NextResponse.next();
  }

  const blockedCodes = await loadBlockedCodes(request);
  if (!isCountryBlocked(country, blockedCodes)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: "This service is not available in your region." },
      { status: 403 }
    );
  }

  const url = request.nextUrl.clone();
  url.pathname = "/unavailable";
  url.search = "";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|webmanifest)$).*)",
  ],
};
