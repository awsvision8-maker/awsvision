import { authenticateManager } from "@/lib/server/ambassador-service";
import { jsonError, jsonOk } from "@/lib/server/api";
import { createManagerSession, setManagerSessionCookie } from "@/lib/server/manager-session";

export async function POST(request: Request) {
  try {
    const { username, password } = (await request.json()) as {
      username?: string;
      password?: string;
    };

    if (!username?.trim() || !password) {
      return jsonError("Username and password are required", 400);
    }

    const ambassador = await authenticateManager(username, password);
    if (!ambassador) {
      return jsonError("Invalid manager credentials", 401);
    }

    const token = await createManagerSession(ambassador.id);
    await setManagerSessionCookie(token);

    return jsonOk({
      manager: {
        id: ambassador.id,
        username: ambassador.username,
        email: ambassador.email,
        firstName: ambassador.firstName,
        lastName: ambassador.lastName,
        referralCode: ambassador.referralCode,
      },
    });
  } catch (err) {
    console.error("Manager login error:", err);
    return jsonError("Login failed", 500);
  }
}
