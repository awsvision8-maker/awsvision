import { fetchUserById } from "@/lib/server/auth-service";
import type { User } from "@/types";

export async function requireVerifiedKyc(userId: string): Promise<User | null> {
  const user = await fetchUserById(userId);
  if (!user || user.kycStatus !== "verified") return null;
  return user;
}
