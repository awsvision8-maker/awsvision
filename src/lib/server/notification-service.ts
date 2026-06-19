import { prisma } from "@/lib/prisma";

export type NotificationType = "info" | "success" | "warning" | "action";

export interface UserNotificationDto {
  id: string;
  title: string;
  message: string;
  type: string;
  readAt: string | null;
  createdAt: string;
  expiresAt: string;
}

function activeNotificationWhere(now = new Date()) {
  return { expiresAt: { gt: now } };
}

export function computeNotificationExpiresAt(
  durationDays: number,
  durationHours: number,
  from = new Date()
): Date {
  const days = Math.max(0, Math.floor(durationDays));
  const hours = Math.max(0, Math.floor(durationHours));
  if (days === 0 && hours === 0) {
    throw new Error("Set a visibility duration (days and/or hours)");
  }
  if (days > 365) throw new Error("Duration cannot exceed 365 days");
  if (hours > 168) throw new Error("Duration cannot exceed 168 hours (7 days)");

  const expiresAt = new Date(from);
  expiresAt.setDate(expiresAt.getDate() + days);
  expiresAt.setHours(expiresAt.getHours() + hours);
  return expiresAt;
}

function mapNotification(row: {
  id: string;
  title: string;
  message: string;
  type: string;
  readAt: Date | null;
  createdAt: Date;
  expiresAt: Date;
}): UserNotificationDto {
  return {
    id: row.id,
    title: row.title,
    message: row.message,
    type: row.type,
    readAt: row.readAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    expiresAt: row.expiresAt.toISOString(),
  };
}

export async function issueAdminNotifications(params: {
  title: string;
  message: string;
  type?: NotificationType;
  scope: "all" | "selected";
  userIds?: string[];
  adminId?: string;
  durationDays?: number;
  durationHours?: number;
}) {
  const title = params.title.trim();
  const message = params.message.trim();
  if (!title || !message) throw new Error("Title and message are required");

  const durationDays = params.durationDays ?? 0;
  const durationHours = params.durationHours ?? 0;
  const now = new Date();
  const expiresAt = computeNotificationExpiresAt(durationDays, durationHours, now);

  let targetUserIds: string[] = [];

  if (params.scope === "all") {
    const users = await prisma.user.findMany({ select: { id: true } });
    targetUserIds = users.map((u) => u.id);
  } else {
    targetUserIds = [...new Set((params.userIds ?? []).filter(Boolean))];
    if (targetUserIds.length === 0) {
      throw new Error("Select at least one user");
    }
    const found = await prisma.user.count({ where: { id: { in: targetUserIds } } });
    if (found !== targetUserIds.length) {
      throw new Error("One or more selected users were not found");
    }
  }

  if (targetUserIds.length === 0) {
    throw new Error("No users to notify");
  }

  const type = params.type ?? "info";

  const broadcast = await prisma.notificationBroadcast.create({
    data: {
      title,
      message,
      type,
      scope: params.scope,
      recipientCount: targetUserIds.length,
      durationDays: Math.max(0, Math.floor(durationDays)),
      durationHours: Math.max(0, Math.floor(durationHours)),
      expiresAt,
      adminId: params.adminId,
      notifications: {
        create: targetUserIds.map((userId) => ({
          userId,
          title,
          message,
          type,
          expiresAt,
        })),
      },
    },
    include: { notifications: true },
  });

  return {
    broadcastId: broadcast.id,
    recipientCount: broadcast.recipientCount,
    scope: broadcast.scope,
    durationDays: broadcast.durationDays,
    durationHours: broadcast.durationHours,
    expiresAt: broadcast.expiresAt.toISOString(),
    createdAt: broadcast.createdAt.toISOString(),
  };
}

export async function listAdminNotificationBroadcasts(limit = 50) {
  const rows = await prisma.notificationBroadcast.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  const now = new Date();
  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    message: r.message,
    type: r.type,
    scope: r.scope,
    recipientCount: r.recipientCount,
    durationDays: r.durationDays,
    durationHours: r.durationHours,
    expiresAt: r.expiresAt.toISOString(),
    expired: r.expiresAt <= now,
    createdAt: r.createdAt.toISOString(),
  }));
}

export async function listUserNotifications(userId: string, limit = 100) {
  const rows = await prisma.userNotification.findMany({
    where: { userId, ...activeNotificationWhere() },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map(mapNotification);
}

export async function countUnreadNotifications(userId: string) {
  return prisma.userNotification.count({
    where: { userId, readAt: null, ...activeNotificationWhere() },
  });
}

export async function markNotificationRead(notificationId: string, userId: string) {
  const row = await prisma.userNotification.findFirst({
    where: { id: notificationId, userId, ...activeNotificationWhere() },
  });
  if (!row) throw new Error("Notification not found");
  if (row.readAt) return mapNotification(row);

  const updated = await prisma.userNotification.update({
    where: { id: notificationId },
    data: { readAt: new Date() },
  });
  return mapNotification(updated);
}

export async function markAllNotificationsRead(userId: string) {
  await prisma.userNotification.updateMany({
    where: { userId, readAt: null, ...activeNotificationWhere() },
    data: { readAt: new Date() },
  });
  return countUnreadNotifications(userId);
}

export async function deleteUserAccount(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  await prisma.user.delete({ where: { id: userId } });
  return { email: user.email, name: `${user.firstName} ${user.lastName}` };
}
