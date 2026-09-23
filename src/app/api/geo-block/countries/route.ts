import { NextResponse } from "next/server";
import { getBlockedCountryCodes } from "@/lib/server/geo-block-service";
import { DEFAULT_BLOCKED_COUNTRY_CODES } from "@/lib/geo-block";

export const dynamic = "force-dynamic";

/** Public list for edge middleware geo checks (middleware caches ~30s). */
export async function GET() {
  try {
    const codes = await getBlockedCountryCodes();
    return NextResponse.json(
      { codes },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (err) {
    console.error("geo-block countries GET error:", err);
    return NextResponse.json(
      { codes: [...DEFAULT_BLOCKED_COUNTRY_CODES] },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}
