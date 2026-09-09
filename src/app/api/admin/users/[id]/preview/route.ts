import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import { getAdminId } from "@/lib/server/admin-session";
import { getUserDetail } from "@/lib/server/admin-service";
import { clearAdminUserPreview } from "@/lib/server/admin-preview-session";
import { jsonError, jsonOk } from "@/lib/server/api";

const PREVIEW_COOKIE = "awsvision_admin_preview";
const PREVIEW_HOURS = 4;

function previewSecret() {
  return (
    process.env.ADMIN_PREVIEW_SECRET ||
    process.env.ADMIN_PORTAL_PASSWORD ||
    process.env.DATABASE_URL ||
    "awsvision-admin-preview"
  );
}

function encodePreview(adminId: string, userId: string, exp: number) {
  const body = Buffer.from(
    JSON.stringify({ a: adminId, u: userId, e: exp }),
    "utf8"
  ).toString("base64url");
  const sig = createHmac("sha256", previewSecret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

/**
 * GET — set view-only preview cookie and redirect to the client portal dashboard (new tab).
 * DELETE — clear preview cookie.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = await getAdminId();
  if (!adminId) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const { id: userId } = await params;
  const user = await getUserDetail(userId);
  if (!user) return jsonError("User not found", 404);

  const expires = new Date();
  expires.setHours(expires.getHours() + PREVIEW_HOURS);
  const token = encodePreview(adminId, userId, expires.getTime());

  const dest = new URL("/portal/dashboard", request.url);
  dest.searchParams.set("adminPreview", "1");
  const response = NextResponse.redirect(dest);
  response.cookies.set(PREVIEW_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
  return response;
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);
  await params;
  await clearAdminUserPreview();
  return jsonOk({ success: true });
}
