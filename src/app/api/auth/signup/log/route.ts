import {
  deriveSignupErrorCode,
  logSignupAttempt,
  requestMeta,
  type SignupProfileType,
} from "@/lib/server/signup-log-service";
import { jsonError, jsonOk } from "@/lib/server/api";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      profileType?: SignupProfileType;
      status?: "failed";
      email?: string;
      onlineId?: string;
      firstName?: string;
      lastName?: string;
      orgName?: string;
      errorMessage?: string;
      errorCode?: string;
    };

    if (!body.errorMessage?.trim()) {
      return jsonError("errorMessage is required", 400);
    }

    const meta = requestMeta(request);
    await logSignupAttempt({
      ...meta,
      profileType: body.profileType === "nonprofit" ? "nonprofit" : "individual",
      status: "failed",
      email: body.email,
      onlineId: body.onlineId,
      firstName: body.firstName,
      lastName: body.lastName,
      orgName: body.orgName,
      errorMessage: body.errorMessage,
      errorCode: body.errorCode ?? deriveSignupErrorCode(body.errorMessage),
      source: "client",
    });

    return jsonOk({ logged: true });
  } catch (err) {
    console.error("Client signup log error:", err);
    return jsonError("Failed to log signup attempt", 500);
  }
}
