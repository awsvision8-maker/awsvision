import { authenticateAdmin, ensureDefaultAdmin } from "@/lib/server/admin-service";
import { jsonError, jsonOk } from "@/lib/server/api";
import { createAdminSession, setAdminSessionCookie } from "@/lib/server/admin-session";

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as {
      email?: string;
      password?: string;
    };

    if (!email?.trim() || !password) {
      return jsonError("Email and password are required", 400);
    }

    await ensureDefaultAdmin();

    const admin = await authenticateAdmin(email, password);
    if (!admin) {
      return jsonError("Invalid admin credentials", 401);
    }

    const token = await createAdminSession(admin.id);
    await setAdminSessionCookie(token);

    return jsonOk({
      admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
    });
  } catch (err) {
    console.error("Admin login error:", err);
    return jsonError("Login failed", 500);
  }
}
