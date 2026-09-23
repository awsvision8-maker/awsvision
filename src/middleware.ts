import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getRequestCountry, isGeoBlockedCountry } from "@/lib/geo-block";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow the regional notice page + static assets (matcher also excludes most)
  if (pathname === "/unavailable" || pathname.startsWith("/unavailable/")) {
    return NextResponse.next();
  }

  const country = getRequestCountry(request);
  if (!isGeoBlockedCountry(country)) {
    return NextResponse.next();
  }

  // APIs / JSON endpoints
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
    /*
     * Match all paths except Next internals and common static files.
     */
    "/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|webmanifest)$).*)",
  ],
};
