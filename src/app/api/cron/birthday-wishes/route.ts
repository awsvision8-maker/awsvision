import { runBirthdayWishes } from "@/lib/server/birthday-service";
import { jsonError, jsonOk } from "@/lib/server/api";

export const dynamic = "force-dynamic";

function authorizeCron(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

/** Daily job — sends birthday emails and portal notifications. */
export async function GET(request: Request) {
  if (!authorizeCron(request)) {
    return jsonError("Unauthorized", 401);
  }

  try {
    const result = await runBirthdayWishes();
    return jsonOk(result);
  } catch (err) {
    console.error("[cron/birthday-wishes]", err);
    return jsonError(err instanceof Error ? err.message : "Birthday job failed", 500);
  }
}
