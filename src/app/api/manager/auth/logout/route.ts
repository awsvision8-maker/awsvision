import { cookies } from "next/headers";
import { jsonOk } from "@/lib/server/api";
import {
  clearManagerSessionCookie,
  deleteManagerSessionByToken,
  MANAGER_SESSION_COOKIE,
} from "@/lib/server/manager-session";

export async function POST() {
  const jar = await cookies();
  const token = jar.get(MANAGER_SESSION_COOKIE)?.value;
  if (token) await deleteManagerSessionByToken(token);
  await clearManagerSessionCookie();
  return jsonOk({ ok: true });
}
