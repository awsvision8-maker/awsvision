import { getAdminId } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";
import { prisma } from "@/lib/prisma";

/** Load cheque screenshots for one deposit (on demand — keeps list APIs light). */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const { id } = await params;
    const tx = await prisma.transaction.findFirst({
      where: { id, type: "deposit" },
      select: {
        id: true,
        proofFront: true,
        proofBack: true,
        description: true,
      },
    });
    if (!tx) return jsonError("Deposit not found", 404);

    return jsonOk({
      id: tx.id,
      description: tx.description,
      proofFront: tx.proofFront,
      proofBack: tx.proofBack,
      hasFront: Boolean(tx.proofFront),
      hasBack: Boolean(tx.proofBack),
    });
  } catch (err) {
    console.error("Admin deposit proof error:", err);
    return jsonError("Failed to load check screenshots", 500);
  }
}
