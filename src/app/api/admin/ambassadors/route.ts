import { listAmbassadorApplications } from "@/lib/server/ambassador-service";
import { getAdminId } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";

export async function GET(request: Request) {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") ?? undefined;

  try {
    const applications = await listAmbassadorApplications(status || undefined);
    return jsonOk({
      applications: applications.map((a) => ({
        id: a.id,
        firstName: a.firstName,
        lastName: a.lastName,
        email: a.email,
        phone: a.phone,
        city: a.city,
        state: a.state,
        linkedin: a.linkedin,
        experience: a.experience,
        message: a.message,
        status: a.status,
        reviewNote: a.reviewNote,
        reviewedAt: a.reviewedAt?.toISOString() ?? null,
        createdAt: a.createdAt.toISOString(),
        ambassador: a.ambassador,
      })),
    });
  } catch (err) {
    console.error("Admin ambassadors list error:", err);
    return jsonError("Failed to load applications", 500);
  }
}
