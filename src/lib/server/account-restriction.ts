import { fetchUserById } from "@/lib/server/auth-service";
import { jsonError } from "@/lib/server/api";
import { SITE } from "@/lib/site-config";
import type { User } from "@/types";

export const ACCOUNT_RESTRICTED_MESSAGE =
  `Your account has been restricted. Please contact support at ${SITE.email}.`;

export async function getRestrictedUser(userId: string): Promise<User | null> {
  const user = await fetchUserById(userId);
  if (!user?.accountRestricted) return null;
  return user;
}

/** Returns a 403 JSON response if the account is restricted; otherwise null. */
export async function rejectIfAccountRestricted(userId: string) {
  const restricted = await getRestrictedUser(userId);
  if (!restricted) return null;
  return jsonError(ACCOUNT_RESTRICTED_MESSAGE, 403);
}
