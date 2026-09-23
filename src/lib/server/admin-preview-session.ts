import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { getAdminId, getAdminSession } from "@/lib/server/admin-session";
import { getManagerUserPreview } from "@/lib/server/manager-preview-session";
import { getSessionUserId } from "@/lib/server/session";
import { jsonError } from "@/lib/server/api";

export const ADMIN_PREVIEW_COOKIE = "awsvision_admin_preview";
const PREVIEW_HOURS = 4;

type PreviewPayload = {
  a: string; // adminId
  u: string; // target userId
  e: number; // expiry ms
};

function previewSecret() {
  return (
    process.env.ADMIN_PREVIEW_SECRET ||
    process.env.ADMIN_PORTAL_PASSWORD ||
    process.env.DATABASE_URL ||
    "awsvision-admin-preview"
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
    if (!parsed?.a || !parsed?.u || !parsed?.e) return null;
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

/** Start view-only preview of a client portal for an admin. */
export async function startAdminUserPreview(adminId: string, userId: string) {
  const token = encodePreview({
    a: adminId,
    u: userId,
    e: previewExpiryDate().getTime(),
  });
  const jar = await cookies();
  jar.set(ADMIN_PREVIEW_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: previewExpiryDate(),
  });
}

export async function clearAdminUserPreview() {
  const jar = await cookies();
  jar.delete(ADMIN_PREVIEW_COOKIE);
}

/**
 * Active admin preview of a specific user (requires valid admin session).
 * Cookie is checked first so normal portal traffic skips the admin-session DB hit.
 */
export async function getAdminUserPreview(): Promise<{
  adminId: string;
  userId: string;
} | null> {
  const jar = await cookies();
  const token = jar.get(ADMIN_PREVIEW_COOKIE)?.value;
  if (!token) return null;

  const payload = decodePreview(token);
  if (!payload) {
    await clearAdminUserPreview();
    return null;
  }

  const adminSession = await getAdminSession();
  if (!adminSession) return null;

  if (payload.a !== adminSession.adminId) {
    await clearAdminUserPreview();
    return null;
  }

  return { adminId: payload.a, userId: payload.u };
}

export async function isAdminPreviewMode(): Promise<boolean> {
  return Boolean(await getAdminUserPreview());
}

/**
 * Portal identity: admin preview → BA preview → real user session.
 */
export async function getPortalUserId(): Promise<string | null> {
  const adminPreview = await getAdminUserPreview();
  if (adminPreview) return adminPreview.userId;
  const managerPreview = await getManagerUserPreview();
  if (managerPreview) return managerPreview.userId;
  return getSessionUserId();
}

/** Block deposits/withdrawals/chat/etc. during any view-only portal preview. */
export async function rejectIfAdminPreview() {
  if (await isAdminPreviewMode()) {
    return jsonError("View-only admin preview — actions are disabled", 403);
  }
  if (await getManagerUserPreview()) {
    return jsonError("View-only ambassador preview — actions are disabled", 403);
  }
  return null;
}

export async function requireAdminIdOrThrow() {
  const adminId = await getAdminId();
  if (!adminId) throw new Error("Unauthorized");
  return adminId;
}
