import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { agentForConversation, buildAgentGreeting } from "@/lib/chat-agents";
import { buildHumanTakeoverNotice, generateBotReply } from "@/lib/chat-bot";
import type { ClientGeo } from "@/lib/request-geo";
export const CHAT_COOKIE = "awsvision_chat_id";

export async function getVisitorConversationId() {
  const jar = await cookies();
  return jar.get(CHAT_COOKIE)?.value ?? null;
}

export async function setVisitorConversationCookie(conversationId: string) {
  const jar = await cookies();
  const expires = new Date();
  expires.setDate(expires.getDate() + 30);
  jar.set(CHAT_COOKIE, conversationId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
}

export async function startConversation(data: {
  visitorName: string;
  visitorEmail: string;
  userId?: string;
  initialMessage?: string;
  geo?: ClientGeo;
}) {
  const conversation = await prisma.chatConversation.create({
    data: {
      visitorName: data.visitorName.trim(),
      visitorEmail: data.visitorEmail.trim().toLowerCase(),
      userId: data.userId,
      visitorIp: data.geo?.ipAddress ?? undefined,
      visitorCity: data.geo?.city ?? undefined,
      visitorRegion: data.geo?.region ?? undefined,
      visitorCountry: data.geo?.country ?? undefined,
      visitorLocation: data.geo?.locationLabel ?? undefined,
      lastSeenAt: new Date(),
      messages: data.initialMessage
        ? {
            create: {
              senderType: "visitor",
              senderName: data.visitorName.trim(),
              body: data.initialMessage.trim(),
            },
          }
        : undefined,
    },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  return conversation;
}

export function isBotActive(conversation: { humanTakeoverAt: Date | null }) {
  return !conversation.humanTakeoverAt;
}

async function staffMessageIndex(conversationId: string) {
  return prisma.chatMessage.count({
    where: { conversationId, senderType: { in: ["admin", "agent"] } },
  });
}

export async function claimHumanTakeover(conversationId: string, adminId: string) {
  const conversation = await prisma.chatConversation.findUnique({
    where: { id: conversationId },
  });
  if (!conversation) return null;

  if (conversation.humanTakeoverAt) {
    return conversation;
  }

  const priorStaffCount = await staffMessageIndex(conversationId);
  const agentName = agentForConversation(conversationId, priorStaffCount);

  await prisma.chatMessage.create({
    data: {
      conversationId,
      senderType: "system",
      senderName: "AWS Vision",
      body: buildHumanTakeoverNotice(agentName, conversation.visitorName),
    },
  });

  return prisma.chatConversation.update({
    where: { id: conversationId },
    data: {
      humanTakeoverAt: new Date(),
      assignedToId: adminId,
      updatedAt: new Date(),
    },
  });
}

export async function sendBotReply(conversationId: string, visitorMessage: string, visitorName: string) {
  const conversation = await prisma.chatConversation.findUnique({ where: { id: conversationId } });
  if (!conversation || conversation.status !== "open" || conversation.humanTakeoverAt) {
    return null;
  }

  const index = await staffMessageIndex(conversationId);
  const { body, agentName } = generateBotReply(visitorMessage, visitorName, conversationId, index);

  const message = await prisma.chatMessage.create({
    data: {
      conversationId,
      senderType: "agent",
      senderName: agentName,
      body,
    },
  });

  await prisma.chatConversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  return message;
}

export async function maybeAutoReplyAsBot(
  conversationId: string,
  visitorMessage: string,
  visitorName: string
) {
  const conversation = await prisma.chatConversation.findUnique({ where: { id: conversationId } });
  if (!conversation || !isBotActive(conversation)) return null;
  return sendBotReply(conversationId, visitorMessage, visitorName);
}

export async function getConversationForVisitor(conversationId: string) {
  return prisma.chatConversation.findFirst({
    where: { id: conversationId },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
}

export async function sendVisitorMessage(conversationId: string, body: string, senderName: string) {
  const conv = await prisma.chatConversation.findUnique({ where: { id: conversationId } });
  if (!conv || conv.status !== "open") {
    throw new Error("Conversation closed");
  }

  const message = await prisma.chatMessage.create({
    data: {
      conversationId,
      senderType: "visitor",
      senderName,
      body: body.trim(),
    },
  });

  await prisma.chatConversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date(), lastSeenAt: new Date() },
  });

  return message;
}

export async function listConversations(status?: string) {
  return prisma.chatConversation.findMany({
    where: status ? { status } : undefined,
    orderBy: { updatedAt: "desc" },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      assignedTo: { select: { id: true, name: true, email: true } },
      _count: { select: { messages: true } },
    },
  });
}

export async function getConversationWithMessages(conversationId: string, since?: Date) {
  const conversation = await prisma.chatConversation.findUnique({
    where: { id: conversationId },
    include: {
      assignedTo: { select: { id: true, name: true, email: true } },
      messages: {
        where: since ? { createdAt: { gt: since } } : undefined,
        orderBy: { createdAt: "asc" },
      },
    },
  });
  return conversation;
}

export async function sendAdminMessage(conversationId: string, adminId: string, body: string) {
  const conversation = await prisma.chatConversation.findUnique({ where: { id: conversationId } });
  if (!conversation) throw new Error("Conversation not found");

  const priorStaffCount = await staffMessageIndex(conversationId);
  const agentName = agentForConversation(conversationId, priorStaffCount);

  const message = await prisma.chatMessage.create({
    data: {
      conversationId,
      senderType: "agent",
      senderName: agentName,
      body: body.trim(),
    },
  });

  await prisma.chatConversation.update({
    where: { id: conversationId },
    data: {
      updatedAt: new Date(),
      assignedToId: adminId,
      humanTakeoverAt: conversation.humanTakeoverAt ?? new Date(),
    },
  });

  return message;
}

export async function sendAgentWelcomeMessage(conversationId: string, visitorName: string) {
  const agentName = agentForConversation(conversationId, 0);

  return prisma.chatMessage.create({
    data: {
      conversationId,
      senderType: "agent",
      senderName: agentName,
      body: buildAgentGreeting(visitorName, agentName),
    },
  });
}
export async function updateConversationStatus(
  conversationId: string,
  status: "open" | "closed",
  adminId?: string
) {
  return prisma.chatConversation.update({
    where: { id: conversationId },
    data: {
      status,
      assignedToId: adminId,
    },
  });
}

export async function markMessagesRead(conversationId: string, senderType: "visitor" | "admin") {
  const types =
    senderType === "visitor"
      ? ["visitor"]
      : (["admin", "agent"] as const);

  await prisma.chatMessage.updateMany({
    where: {
      conversationId,
      senderType: { in: [...types] },
      readAt: null,
    },
    data: { readAt: new Date() },
  });
}
export async function countUnreadForAdmin(conversationId: string) {
  return prisma.chatMessage.count({
    where: {
      conversationId,
      senderType: "visitor",
      readAt: null,
    },
  });
}
