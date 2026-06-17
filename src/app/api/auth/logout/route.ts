import { cookies } from "next/headers";
import { jsonOk } from "@/lib/server/api";
import {
  clearSessionCookie,
  deleteSessionByToken,
  SESSION_COOKIE,
} from "@/lib/server/session";

export async function POST() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    await deleteSessionByToken(token).catch(() => {});
  }
  await clearSessionCookie();
  return jsonOk({ ok: true });
}
