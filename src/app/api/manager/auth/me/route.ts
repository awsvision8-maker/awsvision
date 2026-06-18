import { ambassadorReferralUrl } from "@/lib/server/ambassador-service";
import { getManagerSession } from "@/lib/server/manager-session";
import { jsonError, jsonOk } from "@/lib/server/api";

export async function GET() {
  const session = await getManagerSession();
  if (!session) return jsonError("Unauthorized", 401);

  const a = session.ambassador;
  return jsonOk({
    manager: {
      id: a.id,
      username: a.username,
      email: a.email,
      firstName: a.firstName,
      lastName: a.lastName,
      referralCode: a.referralCode,
      referralUrl: ambassadorReferralUrl(a.referralCode),
    },
  });
}
