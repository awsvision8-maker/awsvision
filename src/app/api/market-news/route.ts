import { jsonError, jsonOk } from "@/lib/server/api";
import { getMarketUpdatePayload } from "@/lib/server/yahoo-finance-news";

/** Refresh hourly so today's important headlines rotate and older ones drop off */
export const revalidate = 3600;

export async function GET() {
  try {
    const payload = await getMarketUpdatePayload();
    if (payload.news.length === 0 && payload.tickers.length === 0) {
      return jsonError("Market updates unavailable right now", 503);
    }
    return jsonOk({
      ...payload,
      window: "last-24-hours",
      policy: "Most important headlines from the last 24 hours; older stories are removed automatically.",
    });
  } catch (err) {
    console.error("Market news error:", err);
    return jsonError("Failed to load market updates", 500);
  }
}
