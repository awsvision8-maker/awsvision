import { fetchUserById } from "@/lib/server/auth-service";
import { jsonError, jsonOk } from "@/lib/server/api";
import { submitKycDocumentUpdate } from "@/lib/server/kyc-service";
import { getSessionUserId } from "@/lib/server/session";

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return jsonError("Not authenticated", 401);

  try {
    const body = (await request.json()) as {
      documentKey?: string;
      preview?: string;
      fileName?: string;
    };

    if (!body.documentKey || !body.preview || !body.fileName) {
      return jsonError("documentKey, preview, and fileName are required", 400);
    }

    const result = await submitKycDocumentUpdate(
      userId,
      body.documentKey,
      body.preview,
      body.fileName
    );

    const user = await fetchUserById(userId);
    return jsonOk({ ...result, user });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return jsonError(message, 400);
  }
}
