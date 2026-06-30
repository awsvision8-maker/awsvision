import { listKycQueue } from "@/lib/server/admin-service";
import { getAdminId } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";

export async function GET() {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const users = await listKycQueue();
    return jsonOk({
      users: users.map((u) => ({
        id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        phone: u.phone,
        kycStatus: u.kycStatus,
        profileType: u.profileType,
        createdAt: u.createdAt.toISOString(),
        kycData: u.kycData ? JSON.parse(u.kycData) : null,
        pendingRequests: u.kycDocumentRequests.map((r) => ({
          documentKey: r.documentKey,
          adminNote: r.adminNote,
        })),
      })),
    });
  } catch (err) {
    console.error("Admin KYC queue error:", err);
    return jsonError("Failed to load KYC queue", 500);
  }
}
