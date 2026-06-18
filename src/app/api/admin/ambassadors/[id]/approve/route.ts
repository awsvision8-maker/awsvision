import {
  ambassadorReferralUrl,
  approveAmbassadorApplication,
  managerPortalUrl,
} from "@/lib/server/ambassador-service";
import { getAdminId } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";
import { notifyAmbassadorApproved } from "@/lib/server/notifications";

type RouteCtx = { params: Promise<{ id: string }> };

export async function POST(request: Request, ctx: RouteCtx) {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  const { id } = await ctx.params;
  const { reviewNote } = (await request.json().catch(() => ({}))) as { reviewNote?: string };

  try {
    const { ambassador, plainPassword, username } = await approveAmbassadorApplication(id, reviewNote);

    notifyAmbassadorApproved({
      email: ambassador.email,
      firstName: ambassador.firstName,
      username,
      password: plainPassword,
      loginUrl: managerPortalUrl(),
      referralCode: ambassador.referralCode,
      referralUrl: ambassadorReferralUrl(ambassador.referralCode),
    });

    return jsonOk({
      application: { id, status: "approved" },
      ambassador: {
        id: ambassador.id,
        username: ambassador.username,
        referralCode: ambassador.referralCode,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Approval failed";
    return jsonError(message, 400);
  }
}
