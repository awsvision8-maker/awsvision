import { listActiveAmbassadors } from "@/lib/server/ambassador-service";
import { getAdminId } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";

export async function GET() {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const ambassadors = await listActiveAmbassadors();
    return jsonOk({
      ambassadors: ambassadors.map((a) => ({
        id: a.id,
        name: `${a.firstName} ${a.lastName}`,
        email: a.email,
        referralCode: a.referralCode,
        username: a.username,
        referralCount: a._count.referrals,
      })),
    });
  } catch (err) {
    console.error("List active ambassadors error:", err);
    return jsonError("Failed to load ambassadors", 500);
  }
}
