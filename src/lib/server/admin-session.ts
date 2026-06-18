import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const ADMIN_SESSION_COOKIE = "awsvision_admin_session";
const SESSION_DAYS = 7;

export function adminSessionExpiry() {
  const d = new Date();
  d.setDate(d.getDate() + SESSION_DAYS);
  return d;
}

export async function createAdminSession(adminId: string) {
  const token = crypto.randomUUID();
  await prisma.adminSession.create({
    data: {
      adminId,
      token,
      expiresAt: adminSessionExpiry(),
    },
  });
  return token;
}

export async function setAdminSessionCookie(token: string) {
  const jar = await cookies();
  jar.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: adminSessionExpiry(),
  });
}

export async function clearAdminSessionCookie() {
  const jar = await cookies();
  jar.delete(ADMIN_SESSION_COOKIE);
}

export async function getAdminSession() {
  const jar = await cookies();
  const token = jar.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.adminSession.findUnique({
    where: { token },
    include: { admin: true },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await prisma.adminSession.delete({ where: { id: session.id } }).catch(() => {});
    }
    return null;
  }

  return session;
}

export async function getAdminId(): Promise<string | null> {
  const session = await getAdminSession();
  return session?.adminId ?? null;
}

export async function deleteAdminSessionByToken(token: string) {
  await prisma.adminSession.deleteMany({ where: { token } });
}
