import { getAdminId } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";
import {
  adminSendPasswordResetLink,
  adminSetUserPassword,
} from "@/lib/server/password-reset-service";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const { id } = await params;
    const body = (await request.json()) as {
      action?: "set" | "send_link";
      newPassword?: string;
      emailPassword?: boolean;
    };

    const action = body.action ?? "set";

    if (action === "send_link") {
      const result = await adminSendPasswordResetLink(id);
      return jsonOk({
        message: `Password reset link emailed to ${result.email}`,
        email: result.email,
      });
    }

    if (action === "set") {
      const password =
        typeof body.newPassword === "string" ? body.newPassword.trim() : "";
      const result = await adminSetUserPassword(id, password, {
        emailPassword: Boolean(body.emailPassword),
      });
      return jsonOk({
        message: result.emailed
          ? `Password updated and emailed to ${result.email}`
          : "Password updated. Customer sessions were signed out.",
        email: result.email,
        emailed: result.emailed,
      });
    }

    return jsonError("Invalid action", 400);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to reset password";
    const status = message.includes("not found") ? 404 : 400;
    return jsonError(message, status);
  }
}
