import {
  adminUpdateAmbassadorCommission,
  adminUpdateAmbassadorProfile,
  getAdminAmbassadorProfile,
} from "@/lib/server/ambassador-service";
import { getAdminId } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const { id } = await params;
    const data = await getAdminAmbassadorProfile(id);
    if (!data) return jsonError("Ambassador not found", 404);
    return jsonOk(data);
  } catch (err) {
    console.error("Admin ambassador profile error:", err);
    return jsonError("Failed to load ambassador profile", 500);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const { id } = await params;
    const body = (await request.json()) as {
      commissionRatePercent?: number | string;
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      username?: string;
      status?: string;
      referralCode?: string;
      newPassword?: string;
    };

    const hasCommission = body.commissionRatePercent !== undefined;
    const hasProfile =
      body.firstName !== undefined ||
      body.lastName !== undefined ||
      body.email !== undefined ||
      body.phone !== undefined ||
      body.username !== undefined ||
      body.status !== undefined ||
      body.referralCode !== undefined ||
      (body.newPassword !== undefined && body.newPassword.length > 0);

    if (!hasCommission && !hasProfile) {
      return jsonError("No fields to update", 400);
    }

    let commissionRatePercent: number | undefined;
    if (hasCommission) {
      const rate =
        typeof body.commissionRatePercent === "string"
          ? parseFloat(body.commissionRatePercent)
          : body.commissionRatePercent;
      const updated = await adminUpdateAmbassadorCommission(id, rate as number);
      commissionRatePercent = updated.commissionRatePercent;
    }

    if (hasProfile) {
      await adminUpdateAmbassadorProfile(id, {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        username: body.username,
        status: body.status,
        referralCode: body.referralCode,
        newPassword: body.newPassword,
      });
    }

    const profile = await getAdminAmbassadorProfile(id);
    if (!profile) return jsonError("Ambassador not found", 404);

    return jsonOk({
      success: true,
      profile: profile.profile,
      commissionRatePercent:
        commissionRatePercent ?? profile.commissionRatePercent,
      stats: profile.stats,
      referrals: profile.referrals,
    });
  } catch (err) {
    console.error("Admin ambassador update error:", err);
    return jsonError(err instanceof Error ? err.message : "Failed to update ambassador", 400);
  }
}
