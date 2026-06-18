import { jsonError, jsonOk } from "@/lib/server/api";
import {
  ADMIN_SESSION_COOKIE,
  clearAdminSessionCookie,
  deleteAdminSessionByToken,
} from "@/lib/server/admin-session";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const jar = await cookies();
    const token = jar.get(ADMIN_SESSION_COOKIE)?.value;
    if (token) await deleteAdminSessionByToken(token);
    await clearAdminSessionCookie();
    return jsonOk({ ok: true });
  } catch {
    return jsonError("Logout failed", 500);
  }
}
