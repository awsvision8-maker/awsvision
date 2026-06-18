import { listAllUsers } from "@/lib/server/admin-service";
import { getAdminId } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";

export async function GET() {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const users = await listAllUsers();
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
        accounts: u.accounts,
        transactionCount: u._count.transactions,
        withdrawalCount: u._count.withdrawalRequests,
        nonprofit: u.nonprofitProfile
          ? {
              organizationLegalName: u.nonprofitProfile.organizationLegalName,
              ein: u.nonprofitProfile.ein,
              fundCapital: u.nonprofitProfile.fundCapital,
              monthlyRate: u.nonprofitProfile.monthlyRate,
            }
          : null,
      })),
    });
  } catch (err) {
    console.error("Admin users error:", err);
    return jsonError("Failed to load users", 500);
  }
}
