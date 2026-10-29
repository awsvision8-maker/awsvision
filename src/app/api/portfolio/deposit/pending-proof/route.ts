import { jsonError, jsonOk } from "@/lib/server/api";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/server/session";

/** Pending eCheck deposits that still need front/back screenshots. */
export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return jsonError("Not authenticated", 401);

  try {
    const deposits = await prisma.transaction.findMany({
      where: {
        userId,
        type: "deposit",
        status: "pending",
        OR: [
          { proofFront: null },
          { proofBack: null },
          { proofFront: "" },
          { proofBack: "" },
        ],
      },
      orderBy: { date: "desc" },
      select: {
        id: true,
        amount: true,
        description: true,
        date: true,
        proofFront: true,
        proofBack: true,
      },
    });

    const needingProof = deposits.filter((d) =>
      /echeck|e-check|cheque/i.test(d.description)
    );

    return jsonOk({
      deposits: needingProof.map((d) => ({
        id: d.id,
        amount: d.amount,
        description: d.description,
        date: d.date.toISOString(),
        hasFront: Boolean(d.proofFront),
        hasBack: Boolean(d.proofBack),
      })),
    });
  } catch (err) {
    console.error("Pending proof list error:", err);
    return jsonError("Failed to load deposits", 500);
  }
}
