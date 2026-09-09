import {
  adminBulkAssignUsersToAmbassador,
  listUsersForAmbassadorAssign,
} from "@/lib/server/admin-service";
import { getAdminId } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const { id: ambassadorId } = await params;
    const users = await listUsersForAmbassadorAssign();

    return jsonOk({
      users: users.map((u) => ({
        id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        phone: u.phone,
        onlineId: u.onlineId,
        kycStatus: u.kycStatus,
        profileType: u.profileType,
        createdAt: u.createdAt.toISOString(),
        ambassadorId: u.ambassadorId,
        isLinkedHere: u.ambassadorId === ambassadorId,
        ambassador: u.ambassador
          ? {
              id: u.ambassador.id,
              name: `${u.ambassador.firstName} ${u.ambassador.lastName}`,
              referralCode: u.ambassador.referralCode,
            }
          : null,
      })),
    });
  } catch (err) {
    console.error("List users for ambassador assign error:", err);
    return jsonError("Failed to load clients", 500);
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const { id: ambassadorId } = await params;
    const body = (await request.json()) as { userIds?: string[] };
    const userIds = Array.isArray(body.userIds) ? body.userIds : [];

    const result = await adminBulkAssignUsersToAmbassador(ambassadorId, userIds);
    return jsonOk({
      success: true,
      assignedCount: result.assignedCount,
      requestedCount: result.requestedCount,
      ambassador: {
        id: result.ambassador.id,
        name: `${result.ambassador.firstName} ${result.ambassador.lastName}`,
        referralCode: result.ambassador.referralCode,
      },
    });
  } catch (err) {
    console.error("Bulk assign ambassador error:", err);
    return jsonError(err instanceof Error ? err.message : "Failed to assign clients", 400);
  }
}
