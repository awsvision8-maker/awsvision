import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getManagerAmbassadorId, getManagerSession } from "@/lib/server/manager-session";

export const MANAGER_PREVIEW_COOKIE = "awsvision_manager_preview";
const PREVIEW_HOURS = 4;

type PreviewPayload = {
  m: string; // ambassadorId
  u: string; // target userId
  e: number; // expiry ms
};

function previewSecret() {
  return (
    process.env.MANAGER_PREVIEW_SECRET ||
    process.env.ADMIN_PREVIEW_SECRET ||
    process.env.DATABASE_URL ||
    "awsvision-manager-preview"
  );
}

function sign(payload: string) {
  return createHmac("sha256", previewSecret()).update(payload).digest("base64url");
}

function encodePreview(payload: PreviewPayload) {
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${body}.${sign(body)}`;
}

function decodePreview(token: string): PreviewPayload | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  try {
    const parsed = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8")
    ) as PreviewPayload;
    if (!parsed?.m || !parsed?.u || !parsed?.e) return null;
    if (parsed.e < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

function previewExpiryDate() {
  const d = new Date();
  d.setHours(d.getHours() + PREVIEW_HOURS);
  return d;
}

export async function clearManagerUserPreview() {
  const jar = await cookies();
  jar.delete(MANAGER_PREVIEW_COOKIE);
}

/**
 * Active BA preview of a referred client (requires live manager session + ownership).
 */
export async function getManagerUserPreview(): Promise<{
  ambassadorId: string;
  userId: string;
} | null> {
  const jar = await cookies();
  const token = jar.get(MANAGER_PREVIEW_COOKIE)?.value;
  if (!token) return null;

  const payload = decodePreview(token);
  if (!payload) {
    await clearManagerUserPreview();
    return null;
  }

  const session = await getManagerSession();
  if (!session) return null;

  if (payload.m !== session.ambassadorId) {
    await clearManagerUserPreview();
    return null;
  }

  // Re-check referral ownership so reassigned clients drop out mid-session
  const user = await prisma.user.findUnique({
    where: { id: payload.u },
    select: { id: true, ambassadorId: true },
  });
  if (!user || user.ambassadorId !== session.ambassadorId) {
    await clearManagerUserPreview();
    return null;
  }

  return { ambassadorId: payload.m, userId: payload.u };
}

export async function isManagerPreviewMode(): Promise<boolean> {
  return Boolean(await getManagerUserPreview());
}

/** Cookie options for redirect response (route handlers set cookies on NextResponse). */
export function buildManagerPreviewCookie(ambassadorId: string, userId: string) {
  const expires = previewExpiryDate();
  const token = encodePreview({
    m: ambassadorId,
    u: userId,
    e: expires.getTime(),
  });
  return {
    name: MANAGER_PREVIEW_COOKIE,
    value: token,
    expires,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      expires,
    },
  };
}

export async function assertManagerOwnsUser(userId: string) {
  const ambassadorId = await getManagerAmbassadorId();
  if (!ambassadorId) return { ok: false as const, reason: "unauthorized" as const };

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, ambassadorId: true, firstName: true, lastName: true },
  });
  if (!user) return { ok: false as const, reason: "not_found" as const };
  if (user.ambassadorId !== ambassadorId) {
    return { ok: false as const, reason: "forbidden" as const };
  }
  return { ok: true as const, ambassadorId, user };
}
