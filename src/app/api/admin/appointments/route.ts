import { listAppointments } from "@/lib/server/admin-service";
import { getAdminId } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";

export async function GET() {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const appointments = await listAppointments();
    return jsonOk({
      appointments: appointments.map((a) => ({
        ...a,
        createdAt: a.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    console.error("Admin appointments error:", err);
    return jsonError("Failed to load appointments", 500);
  }
}
