import { getAdminId } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";
import { requestKycDocumentReupload } from "@/lib/server/kyc-service";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const { id } = await params;
    const body = (await request.json()) as { documentKey?: string; note?: string };
    if (!body.documentKey?.trim()) {
      return jsonError("Document type is required", 400);
    }

    const result = await requestKycDocumentReupload({
      userId: id,
      documentKey: body.documentKey.trim(),
      adminNote: body.note,
      adminId,
    });

    return jsonOk({ request: result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to request re-upload";
    const status = message.includes("not found") ? 404 : message.includes("already") ? 409 : 400;
    return jsonError(message, status);
  }
}
