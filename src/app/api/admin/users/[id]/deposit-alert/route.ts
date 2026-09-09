import { getAdminId } from "@/lib/server/admin-session";
import { jsonError, jsonOk } from "@/lib/server/api";
import { sendDepositShortfallAlert } from "@/lib/server/notification-service";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = await getAdminId();
  if (!adminId) return jsonError("Unauthorized", 401);

  try {
    const { id } = await params;
    const body = (await request.json()) as {
      amountDue?: number | string;
      note?: string;
      durationDays?: number;
    };

    const amountDue =
      typeof body.amountDue === "string" ? parseFloat(body.amountDue) : Number(body.amountDue);

    const notification = await sendDepositShortfallAlert({
      userId: id,
      amountDue,
      adminNote: body.note,
      durationDays: body.durationDays,
    });

    return jsonOk({ notification });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send deposit alert";
    const status = message.includes("not found") ? 404 : 400;
    return jsonError(message, status);
  }
}
