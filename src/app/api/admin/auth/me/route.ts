import { getAdminSession } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return jsonError("Not authenticated", 401);
  }
  return jsonOk({
    admin: {
      id: session.admin.id,
      email: session.admin.email,
      name: session.admin.name,
      role: session.admin.role,
    },
  });
}
