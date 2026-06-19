import { adminUpdateAgreement } from "@/lib/server/agreement-service";
import { getAdminId } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; agreementId: string }> }
) {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const { id: userId, agreementId } = await params;
    const body = (await request.json()) as {
      planId?: string;
      planName?: string;
      monthlyRatePercent?: number;
      termMonths?: number;
      totalRoiPercent?: number;
      totalPrincipal?: number;
      maturityDate?: string;
      amendmentNote?: string;
    };

    if (
      body.monthlyRatePercent !== undefined &&
      (body.monthlyRatePercent <= 0 || body.monthlyRatePercent > 100)
    ) {
      return jsonError("Monthly rate must be between 0 and 100", 400);
    }

    if (body.termMonths !== undefined && body.termMonths <= 0) {
      return jsonError("Term must be at least 1 month", 400);
    }

    const agreement = await adminUpdateAgreement(agreementId, userId, body);
    return jsonOk({ agreement });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Update failed";
    if (message.includes("not found")) return jsonError(message, 404);
    console.error("Admin agreement update error:", err);
    return jsonError("Failed to update agreement", 500);
  }
}
