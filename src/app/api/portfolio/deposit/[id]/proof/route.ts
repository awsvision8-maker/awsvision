import { jsonError, jsonOk } from "@/lib/server/api";
import { rejectIfAdminPreview } from "@/lib/server/admin-preview-session";
import { requireVerifiedKyc } from "@/lib/server/kyc-guard";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/server/session";

function isDataImage(value: string | undefined | null): value is string {
  return Boolean(value && /^data:image\/(jpeg|jpg|png|webp);base64,/i.test(value));
}

/** Client attaches front/back cheque screenshots to an existing pending eCheck deposit. */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const blocked = await rejectIfAdminPreview();
  if (blocked) return blocked;

  const userId = await getSessionUserId();
  if (!userId) return jsonError("Not authenticated", 401);

  // Restricted accounts may still attach deposit proofs.

  const verifiedUser = await requireVerifiedKyc(userId);
  if (!verifiedUser) {
    return jsonError(
      "Your identity must be verified by an administrator before depositing funds",
      403
    );
  }

  try {
    const { id } = await params;
    const body = (await request.json()) as {
      proofFront?: string;
      proofBack?: string;
    };

    if (!isDataImage(body.proofFront) || !isDataImage(body.proofBack)) {
      return jsonError(
        "Upload clear screenshots of both the front and back of the check",
        400
      );
    }
    if (body.proofFront.length > 5_500_000 || body.proofBack.length > 5_500_000) {
      return jsonError("Check images are too large. Please upload smaller screenshots.", 400);
    }

    const tx = await prisma.transaction.findFirst({
      where: { id, userId, type: "deposit", status: "pending" },
    });
    if (!tx) return jsonError("Pending deposit not found", 404);

    const isEcheck = /echeck|e-check|cheque/i.test(tx.description);
    if (!isEcheck) {
      return jsonError("Check screenshots can only be attached to eCheck deposits", 400);
    }

    await prisma.transaction.update({
      where: { id: tx.id },
      data: {
        proofFront: body.proofFront,
        proofBack: body.proofBack,
      },
    });

    return jsonOk({
      ok: true,
      depositId: tx.id,
      message: "Check screenshots attached. Admin can now review your eCheck deposit.",
    });
  } catch (err) {
    console.error("Attach deposit proof error:", err);
    return jsonError("Failed to attach check screenshots", 500);
  }
}
