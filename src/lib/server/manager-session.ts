import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const MANAGER_SESSION_COOKIE = "awsvision_manager_session";
const SESSION_DAYS = 14;

export function managerSessionExpiry() {
  const d = new Date();
  d.setDate(d.getDate() + SESSION_DAYS);
  return d;
}

export async function createManagerSession(ambassadorId: string) {
  const token = crypto.randomUUID();
  await prisma.managerSession.create({
    data: {
      ambassadorId,
      token,
      expiresAt: managerSessionExpiry(),
    },
  });
  return token;
}

export async function setManagerSessionCookie(token: string) {
  const jar = await cookies();
  jar.set(MANAGER_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: managerSessionExpiry(),
  });
}

export async function clearManagerSessionCookie() {
  const jar = await cookies();
  jar.delete(MANAGER_SESSION_COOKIE);
}

export async function getManagerSession() {
  const jar = await cookies();
  const token = jar.get(MANAGER_SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.managerSession.findUnique({
    where: { token },
    include: {
      ambassador: {
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          referralCode: true,
          status: true,
        },
      },
    },
  });

  if (!session || session.expiresAt < new Date() || session.ambassador.status !== "active") {
    if (session) {
      await prisma.managerSession.delete({ where: { id: session.id } }).catch(() => {});
    }
    return null;
  }

  return session;
}

export async function getManagerAmbassadorId() {
  const session = await getManagerSession();
  return session?.ambassadorId ?? null;
}

export async function deleteManagerSessionByToken(token: string) {
  await prisma.managerSession.deleteMany({ where: { token } });
}
