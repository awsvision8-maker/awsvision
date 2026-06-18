import { setUserKycStatus } from "@/lib/server/admin-service";
import { getAdminId } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";
import { notifyKycVerified } from "@/lib/server/notifications";
import { mapUser, userInclude } from "@/lib/server/user-mapper";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const { id } = await params;
    const body = (await request.json()) as { action?: string };
    if (body.action !== "approve" && body.action !== "reject") {
      return jsonError("Invalid action", 400);
    }

    const status = body.action === "approve" ? "verified" : "rejected";
    await setUserKycStatus(id, status);

    if (status === "verified") {
      const row = await prisma.user.findUnique({ where: { id }, include: userInclude });
      if (row) notifyKycVerified(mapUser(row));
    }

    return jsonOk({ success: true, status });
  } catch (err) {
    console.error("Admin KYC action error:", err);
    return jsonError("KYC update failed", 500);
  }
}
