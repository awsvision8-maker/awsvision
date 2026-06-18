import { buildComparisonReport, COMPARISON_SOURCES, COMPETITOR_BANKS } from "@/lib/bank-comparison";
import { jsonError, jsonOk } from "@/lib/server/api";

export const revalidate = 86400;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const principalParam = searchParams.get("principal");
    const principal = principalParam ? Number(principalParam) : 50_000;

    if (!Number.isFinite(principal) || principal < 1_000 || principal > 10_000_000) {
      return jsonError("Principal must be between $1,000 and $10,000,000", 400);
    }

    const report = buildComparisonReport(principal);

    return jsonOk({
      report,
      sources: COMPARISON_SOURCES,
      banks: COMPETITOR_BANKS.map((b) => ({
        id: b.id,
        name: b.name,
        savingsApy: b.savingsApy,
        cd12MonthApy: b.cd12MonthApy,
        bestPromoApy: b.bestPromoApy,
        bestComparableApy: Math.max(b.savingsApy, b.cd12MonthApy, b.bestPromoApy ?? 0),
        sourceUrl: b.sourceUrl,
      })),
    });
  } catch (err) {
    console.error("Compare rates error:", err);
    return jsonError("Failed to build comparison", 500);
  }
}
