import { NextResponse } from "next/server";

const KEEPALIVE_URL =
  process.env.CPANEL_BORE_KEEPALIVE_URL ||
  "https://web.awsvision.com/bore-keepalive.php?token=awsv-bore-20260831";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetch(KEEPALIVE_URL, { cache: "no-store" });
    const body = await response.text();
    return NextResponse.json({
      ok: response.ok,
      status: response.status,
      body: body.trim(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Keepalive failed";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
