import { prisma } from "@/lib/prisma";

export type SignupProfileType = "individual" | "nonprofit";
export type SignupAttemptStatus = "success" | "failed";

export interface SignupAttemptInput {
  profileType: SignupProfileType;
  status: SignupAttemptStatus;
  email?: string | null;
  onlineId?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  orgName?: string | null;
  errorMessage?: string | null;
  errorCode?: string | null;
  source?: "server" | "client";
  ipAddress?: string | null;
  userAgent?: string | null;
  payloadKb?: number | null;
}

export function requestMeta(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ipAddress = forwarded?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? null;
  const userAgent = request.headers.get("user-agent");
  return { ipAddress, userAgent };
}

export function deriveSignupErrorCode(message: string, httpStatus?: number): string {
  const lower = message.toLowerCase();
  if (lower.includes("online id")) return "duplicate_online_id";
  if (lower.includes("email") && lower.includes("exists")) return "duplicate_email";
  if (lower.includes("unique constraint")) return "duplicate_account";
  if (lower.includes("referral")) return "invalid_referral";
  if (lower.includes("missing required")) return "missing_fields";
  if (lower.includes("too large") || lower.includes("payload")) return "payload_too_large";
  if (lower.includes("invalid signup") || lower.includes("json")) return "invalid_payload";
  if (httpStatus === 400) return "validation";
  if (httpStatus === 409) return "conflict";
  return "server_error";
}

export async function logSignupAttempt(input: SignupAttemptInput) {
  try {
    await prisma.signupAttemptLog.create({
      data: {
        profileType: input.profileType,
        status: input.status,
        email: input.email?.toLowerCase() ?? null,
        onlineId: input.onlineId ?? null,
        firstName: input.firstName ?? null,
        lastName: input.lastName ?? null,
        orgName: input.orgName ?? null,
        errorMessage: input.errorMessage ?? null,
        errorCode: input.errorCode ?? null,
        source: input.source ?? "server",
        ipAddress: input.ipAddress ?? null,
        userAgent: input.userAgent ?? null,
        payloadKb: input.payloadKb ?? null,
      },
    });
  } catch (err) {
    console.error("Failed to write signup attempt log:", err);
  }
}

export async function listSignupAttemptLogs(params?: {
  status?: string;
  profileType?: string;
  limit?: number;
}) {
  const limit = Math.min(params?.limit ?? 100, 500);
  const where: { status?: string; profileType?: string } = {};
  if (params?.status && params.status !== "all") where.status = params.status;
  if (params?.profileType && params.profileType !== "all") where.profileType = params.profileType;

  const rows = await prisma.signupAttemptLog.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return rows.map((r) => ({
    id: r.id,
    profileType: r.profileType,
    status: r.status,
    email: r.email,
    onlineId: r.onlineId,
    firstName: r.firstName,
    lastName: r.lastName,
    orgName: r.orgName,
    errorMessage: r.errorMessage,
    errorCode: r.errorCode,
    source: r.source,
    ipAddress: r.ipAddress,
    userAgent: r.userAgent,
    payloadKb: r.payloadKb,
    createdAt: r.createdAt.toISOString(),
  }));
}
