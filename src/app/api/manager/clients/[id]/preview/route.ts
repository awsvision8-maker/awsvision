import { NextResponse } from "next/server";
import {
  assertManagerOwnsUser,
  buildManagerPreviewCookie,
  clearManagerUserPreview,
} from "@/lib/server/manager-preview-session";
import { getManagerAmbassadorId } from "@/lib/server/manager-session";
import { jsonError, jsonOk } from "@/lib/server/api";

/**
 * GET — BA view-only preview of a referred client's portal (new tab).
 * DELETE — clear BA preview cookie.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const ambassadorId = await getManagerAmbassadorId();
  if (!ambassadorId) {
    return NextResponse.redirect(new URL("/manager/login", request.url));
  }

  const { id: userId } = await params;
  const ownership = await assertManagerOwnsUser(userId);
  if (!ownership.ok) {
    if (ownership.reason === "not_found") return jsonError("Client not found", 404);
    if (ownership.reason === "forbidden") {
      return jsonError("You can only view clients linked to your referral code", 403);
    }
    return NextResponse.redirect(new URL("/manager/login", request.url));
  }

  const cookie = buildManagerPreviewCookie(ownership.ambassadorId, userId);
  const dest = new URL("/portal/dashboard", request.url);
  dest.searchParams.set("managerPreview", "1");
  const response = NextResponse.redirect(dest);
  response.cookies.set(cookie.name, cookie.value, cookie.options);
  return response;
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const ambassadorId = await getManagerAmbassadorId();
  if (!ambassadorId) return jsonError("Unauthorized", 401);
  await params;
  await clearManagerUserPreview();
  return jsonOk({ success: true });
}
