import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/server/auth-service";
import { jsonError, jsonOk } from "@/lib/server/api";
import { mapUser, userInclude } from "@/lib/server/user-mapper";
import { notifyLogin } from "@/lib/server/notifications";
import {
  createSession,
  setSessionCookie,
} from "@/lib/server/session";

export async function POST(request: Request) {
  try {
    const { email, password } = (await request.json()) as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return jsonError("Email and password are required", 400);
    }

    const row = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: userInclude,
    });

    if (!row || !(await verifyPassword(password, row.passwordHash))) {
      return jsonError("Invalid email or password", 401);
    }

    const token = await createSession(row.id);
    await setSessionCookie(token);

    const user = mapUser(row);
    notifyLogin(user);

    return jsonOk({ user });
  } catch (err) {
    console.error("Login error:", err);
    return jsonError("Login failed", 500);
  }
}
