import { cookies } from "next/headers";

export const HUMAN_VERIFY_COOKIE = "awsvision_human";

/** 24 hours — visitors re-verify occasionally; bots cannot mint this without captcha */
const HUMAN_TTL_MS = 24 * 60 * 60 * 1000;

export async function isHumanVerified(): Promise<boolean> {
  const jar = await cookies();
  const value = jar.get(HUMAN_VERIFY_COOKIE)?.value;
  return value === "1";
}

export async function setHumanVerifiedCookie() {
  const jar = await cookies();
  jar.set(HUMAN_VERIFY_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(Date.now() + HUMAN_TTL_MS),
  });
}
