import { fetchUserById } from "@/lib/server/auth-service";
import { jsonError, jsonOk } from "@/lib/server/api";
import { getSessionUserId } from "@/lib/server/session";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) {
    return jsonError("Not authenticated", 401);
  }

  const user = await fetchUserById(userId);
  if (!user) {
    return jsonError("User not found", 404);
  }

  return jsonOk({ user });
}
