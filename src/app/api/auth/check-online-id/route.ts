import { checkOnlineIdAvailability } from "@/lib/server/online-id-service";
import { jsonOk } from "@/lib/server/api";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") ?? "";
    const firstName = searchParams.get("firstName") ?? undefined;
    const lastName = searchParams.get("lastName") ?? undefined;
    const orgName = searchParams.get("orgName") ?? undefined;

    const result = await checkOnlineIdAvailability(id, { firstName, lastName, orgName });
    return jsonOk(result);
  } catch (err) {
    console.error("Check online ID error:", err);
    return jsonOk({
      available: false,
      onlineId: "",
      message: "Could not verify Online ID. Please try again.",
      suggestions: [],
    });
  }
}
