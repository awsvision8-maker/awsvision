import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import type { ClientGeo } from "@/lib/request-geo";

export const VISITOR_PRESENCE_COOKIE = "awsvision_visitor_session";
export const LIVE_PRESENCE_MS = 60_000;

function newSessionToken() {
  return `vs_${crypto.randomUUID().replace(/-/g, "")}`;
}

export function isRecentlyLive(lastSeenAt: Date | null | undefined, now = Date.now()) {
  if (!lastSeenAt) return false;
  return now - lastSeenAt.getTime() <= LIVE_PRESENCE_MS;
}

export async function getVisitorSessionToken() {
  const jar = await cookies();
  return jar.get(VISITOR_PRESENCE_COOKIE)?.value ?? null;
}

export async function setVisitorSessionCookie(sessionToken: string) {
  const jar = await cookies();
  const expires = new Date();
  expires.setDate(expires.getDate() + 30);
  jar.set(VISITOR_PRESENCE_COOKIE, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
}

export async function upsertVisitorPresence(data: {
  sessionToken?: string | null;
  geo: ClientGeo;
  currentPath: string;
  status: "website" | "chat";
  userId?: string | null;
  visitorName?: string | null;
  visitorEmail?: string | null;
  conversationId?: string | null;
}) {
  let sessionToken = data.sessionToken ?? null;
  if (!sessionToken) {
    sessionToken = newSessionToken();
    await setVisitorSessionCookie(sessionToken);
  }

  const now = new Date();
  const presence = await prisma.visitorPresence.upsert({
    where: { sessionToken },
    create: {
      sessionToken,
      userId: data.userId ?? undefined,
      visitorName: data.visitorName ?? undefined,
      visitorEmail: data.visitorEmail ?? undefined,
      conversationId: data.conversationId ?? undefined,
      currentPath: data.currentPath,
      ipAddress: data.geo.ipAddress ?? undefined,
      city: data.geo.city ?? undefined,
      region: data.geo.region ?? undefined,
      country: data.geo.country ?? undefined,
      locationLabel: data.geo.locationLabel,
      status: data.status,
      lastSeenAt: now,
    },
    update: {
      userId: data.userId ?? undefined,
      visitorName: data.visitorName ?? undefined,
      visitorEmail: data.visitorEmail ?? undefined,
      conversationId: data.conversationId ?? undefined,
      currentPath: data.currentPath,
      ipAddress: data.geo.ipAddress ?? undefined,
      city: data.geo.city ?? undefined,
      region: data.geo.region ?? undefined,
      country: data.geo.country ?? undefined,
      locationLabel: data.geo.locationLabel,
      status: data.status,
      lastSeenAt: now,
    },
  });

  if (data.conversationId && data.status === "chat") {
    await touchConversationPresence(data.conversationId, data.geo);
  }

  return { presence, sessionToken };
}

export async function touchConversationPresence(conversationId: string, geo?: ClientGeo) {
  const now = new Date();
  return prisma.chatConversation.update({
    where: { id: conversationId },
    data: {
      lastSeenAt: now,
      ...(geo
        ? {
            visitorIp: geo.ipAddress ?? undefined,
            visitorCity: geo.city ?? undefined,
            visitorRegion: geo.region ?? undefined,
            visitorCountry: geo.country ?? undefined,
            visitorLocation: geo.locationLabel,
          }
        : {}),
    },
  });
}

export async function applyGeoToConversation(conversationId: string, geo: ClientGeo) {
  return prisma.chatConversation.update({
    where: { id: conversationId },
    data: {
      visitorIp: geo.ipAddress ?? undefined,
      visitorCity: geo.city ?? undefined,
      visitorRegion: geo.region ?? undefined,
      visitorCountry: geo.country ?? undefined,
      visitorLocation: geo.locationLabel,
      lastSeenAt: new Date(),
    },
  });
}

export async function listLiveVisitors() {
  const cutoff = new Date(Date.now() - LIVE_PRESENCE_MS);
  return prisma.visitorPresence.findMany({
    where: {
      lastSeenAt: { gte: cutoff },
    },
    orderBy: { lastSeenAt: "desc" },
  });
}

export function serializePresence(p: {
  id: string;
  sessionToken: string;
  userId: string | null;
  visitorName: string | null;
  visitorEmail: string | null;
  conversationId: string | null;
  currentPath: string;
  ipAddress: string | null;
  locationLabel: string | null;
  status: string;
  lastSeenAt: Date;
}) {
  const live = isRecentlyLive(p.lastSeenAt);
  return {
    id: p.id,
    sessionToken: p.sessionToken,
    userId: p.userId,
    displayName: p.visitorName ?? (p.userId ? "Logged-in user" : "Website visitor"),
    visitorEmail: p.visitorEmail,
    conversationId: p.conversationId,
    currentPath: p.currentPath,
    ipAddress: p.ipAddress,
    location: p.locationLabel,
    status: p.status,
    isLive: live,
    liveLabel: p.status === "chat" ? "Live on chat" : "Live on website",
    lastSeenAt: p.lastSeenAt.toISOString(),
  };
}
