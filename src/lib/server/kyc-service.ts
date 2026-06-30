import { prisma } from "@/lib/prisma";
import {
  documentsForProfileType,
  getKycDocumentDef,
  isKycDocumentKey,
  type KycDocumentKey,
} from "@/lib/kyc-documents";
import { createUserNotification } from "@/lib/server/notification-service";
import { notifyKycReuploadRequest } from "@/lib/server/notifications";
import type { KYCData } from "@/types";

export interface KycDocumentRequestDto {
  id: string;
  documentKey: KycDocumentKey;
  documentLabel: string;
  adminNote: string | null;
  status: string;
  requestedAt: string;
  fulfilledAt: string | null;
}

function mapRequest(row: {
  id: string;
  documentKey: string;
  adminNote: string | null;
  status: string;
  requestedAt: Date;
  fulfilledAt: Date | null;
}): KycDocumentRequestDto {
  const def = getKycDocumentDef(row.documentKey);
  return {
    id: row.id,
    documentKey: row.documentKey as KycDocumentKey,
    documentLabel: def?.label ?? row.documentKey,
    adminNote: row.adminNote,
    status: row.status,
    requestedAt: row.requestedAt.toISOString(),
    fulfilledAt: row.fulfilledAt?.toISOString() ?? null,
  };
}

function parseKycData(raw: string | null): KYCData {
  if (!raw) return {} as KYCData;
  try {
    return JSON.parse(raw) as KYCData;
  } catch {
    return {} as KYCData;
  }
}

export async function listPendingKycDocumentRequests(userId: string) {
  const rows = await prisma.kycDocumentRequest.findMany({
    where: { userId, status: "pending" },
    orderBy: { requestedAt: "desc" },
  });
  return rows.map(mapRequest);
}

export async function listKycDocumentRequestsForUser(userId: string) {
  const rows = await prisma.kycDocumentRequest.findMany({
    where: { userId },
    orderBy: { requestedAt: "desc" },
    take: 50,
  });
  return rows.map(mapRequest);
}

export async function requestKycDocumentReupload(params: {
  userId: string;
  documentKey: string;
  adminNote?: string;
  adminId?: string;
}) {
  if (!isKycDocumentKey(params.documentKey)) {
    throw new Error("Invalid document type");
  }

  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    select: { id: true, email: true, firstName: true, lastName: true, profileType: true, kycStatus: true },
  });
  if (!user) throw new Error("User not found");
  if (user.kycStatus === "verified") {
    throw new Error("User KYC is already verified");
  }

  const allowed = documentsForProfileType(user.profileType).map((d) => d.key);
  if (!allowed.includes(params.documentKey)) {
    throw new Error("This document type does not apply to this account");
  }

  const existing = await prisma.kycDocumentRequest.findFirst({
    where: {
      userId: params.userId,
      documentKey: params.documentKey,
      status: "pending",
    },
  });
  if (existing) {
    throw new Error("A re-upload request for this document is already pending");
  }

  const def = getKycDocumentDef(params.documentKey)!;
  const note = params.adminNote?.trim() || null;
  const title = "KYC document re-upload required";
  const message = [
    `Please upload a new copy of your ${def.label}.`,
    note ? `Admin note: ${note}` : null,
    "Sign in and go to your verification page to submit the updated document.",
  ]
    .filter(Boolean)
    .join("\n\n");

  const notification = await createUserNotification({
    userId: user.id,
    title,
    message,
    type: "action",
    durationDays: 14,
  });

  const request = await prisma.kycDocumentRequest.create({
    data: {
      userId: user.id,
      documentKey: params.documentKey,
      adminNote: note,
      adminId: params.adminId,
      notificationId: notification.id,
    },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { kycStatus: "resubmit_required" },
  });

  notifyKycReuploadRequest(
    { email: user.email, firstName: user.firstName, lastName: user.lastName },
    def.label,
    note
  );

  return mapRequest(request);
}

export async function submitKycDocumentUpdate(
  userId: string,
  documentKey: string,
  preview: string,
  fileName: string
) {
  if (!isKycDocumentKey(documentKey)) {
    throw new Error("Invalid document type");
  }
  if (!preview?.startsWith("data:image/")) {
    throw new Error("Invalid image data");
  }
  if (!fileName?.trim()) {
    throw new Error("File name is required");
  }

  const pending = await prisma.kycDocumentRequest.findFirst({
    where: { userId, documentKey, status: "pending" },
  });
  if (!pending) {
    throw new Error("No pending re-upload request for this document");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { kycData: true, profileType: true },
  });
  if (!user) throw new Error("User not found");

  const def = getKycDocumentDef(documentKey)!;
  const allowed = documentsForProfileType(user.profileType).map((d) => d.key);
  if (!allowed.includes(documentKey)) {
    throw new Error("This document type does not apply to your account");
  }

  const kycData = parseKycData(user.kycData);
  const updated: KYCData = {
    ...kycData,
    [def.previewKey]: preview,
    [def.nameKey]: fileName,
  };

  const now = new Date();
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { kycData: JSON.stringify(updated) },
    }),
    prisma.kycDocumentRequest.update({
      where: { id: pending.id },
      data: { status: "fulfilled", fulfilledAt: now },
    }),
  ]);

  const remaining = await prisma.kycDocumentRequest.count({
    where: { userId, status: "pending" },
  });

  if (remaining === 0) {
    await prisma.user.update({
      where: { id: userId },
      data: { kycStatus: "submitted" },
    });
  }

  return { fulfilled: documentKey, pendingRemaining: remaining };
}
