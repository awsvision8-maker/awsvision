import { rejectAmbassadorApplication } from "@/lib/server/ambassador-service";
import { getAdminId } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";
import { notifyAmbassadorRejected } from "@/lib/server/notifications";

type RouteCtx = { params: Promise<{ id: string }> };

export async function POST(request: Request, ctx: RouteCtx) {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  const { id } = await ctx.params;
  const { reviewNote } = (await request.json().catch(() => ({}))) as { reviewNote?: string };

  try {
    const application = await rejectAmbassadorApplication(id, reviewNote);
    notifyAmbassadorRejected(application.email, application.firstName, reviewNote);

    return jsonOk({ application: { id: application.id, status: application.status } });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Rejection failed";
    return jsonError(message, 400);
  }
}
