import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import type { ClientGeo } from "@/lib/request-geo";
import {
  VISITOR_PRESENCE_COOKIE,
  setVisitorSessionCookie,
} from "@/lib/server/presence-service";

const VISIT_IDLE_MS = 30 * 60 * 1000; // new visit after 30 min idle

function newSessionToken() {
  return `vs_${crypto.randomUUID().replace(/-/g, "")}`;
}

function clampDuration(ms: number) {
  if (!Number.isFinite(ms) || ms < 0) return 0;
  return Math.min(Math.round(ms), 24 * 60 * 60 * 1000);
}

export function formatDuration(ms: number) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  if (totalSec < 60) return `${totalSec}s`;
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  if (mins < 60) return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  return remMins > 0 ? `${hours}h ${remMins}m` : `${hours}h`;
}

async function ensureSessionToken(existing?: string | null) {
  if (existing) return existing;
  const jar = await cookies();
  const fromCookie = jar.get(VISITOR_PRESENCE_COOKIE)?.value;
  if (fromCookie) return fromCookie;
  const token = newSessionToken();
  await setVisitorSessionCookie(token);
  return token;
}

async function closeOpenPageView(visitId: string, now: Date) {
  const open = await prisma.sitePageView.findFirst({
    where: { visitId, leftAt: null },
    orderBy: { enteredAt: "desc" },
  });
  if (!open) return null;
  const durationMs = clampDuration(now.getTime() - open.enteredAt.getTime());
  return prisma.sitePageView.update({
    where: { id: open.id },
    data: { leftAt: now, durationMs },
  });
}

export async function trackPageView(input: {
  sessionToken?: string | null;
  path: string;
  title?: string | null;
  referrer?: string | null;
  userAgent?: string | null;
  geo: ClientGeo;
}) {
  const now = new Date();
  const path = input.path.slice(0, 500) || "/";
  const sessionToken = await ensureSessionToken(input.sessionToken);

  let visitor = await prisma.siteVisitor.findUnique({ where: { sessionToken } });
  if (!visitor) {
    visitor = await prisma.siteVisitor.create({
      data: {
        sessionToken,
        visitCount: 0,
        firstSeenAt: now,
        lastSeenAt: now,
        lastIp: input.geo.ipAddress,
        lastCity: input.geo.city,
        lastRegion: input.geo.region,
        lastCountry: input.geo.country,
        lastLatitude: input.geo.latitude,
        lastLongitude: input.geo.longitude,
        lastLocation: input.geo.locationLabel,
        lastUserAgent: input.userAgent?.slice(0, 500) ?? null,
        lastPath: path,
      },
    });
  }

  let visit = await prisma.siteVisit.findFirst({
    where: { visitorId: visitor.id },
    orderBy: { endedAt: "desc" },
  });

  const needsNewVisit =
    !visit || now.getTime() - visit.endedAt.getTime() > VISIT_IDLE_MS;

  if (needsNewVisit) {
    if (visit) {
      await closeOpenPageView(visit.id, now);
    }
    visit = await prisma.siteVisit.create({
      data: {
        visitorId: visitor.id,
        startedAt: now,
        endedAt: now,
        durationMs: 0,
        entryPath: path,
        exitPath: path,
        ipAddress: input.geo.ipAddress,
        city: input.geo.city,
        region: input.geo.region,
        country: input.geo.country,
        latitude: input.geo.latitude,
        longitude: input.geo.longitude,
        locationLabel: input.geo.locationLabel,
        userAgent: input.userAgent?.slice(0, 500) ?? null,
        referrer: input.referrer?.slice(0, 500) ?? null,
      },
    });
    visitor = await prisma.siteVisitor.update({
      where: { id: visitor.id },
      data: {
        visitCount: { increment: 1 },
        lastSeenAt: now,
        lastIp: input.geo.ipAddress,
        lastCity: input.geo.city,
        lastRegion: input.geo.region,
        lastCountry: input.geo.country,
        lastLatitude: input.geo.latitude,
        lastLongitude: input.geo.longitude,
        lastLocation: input.geo.locationLabel,
        lastUserAgent: input.userAgent?.slice(0, 500) ?? null,
        lastPath: path,
      },
    });
  } else {
    await closeOpenPageView(visit!.id, now);
    visit = await prisma.siteVisit.update({
      where: { id: visit!.id },
      data: {
        endedAt: now,
        exitPath: path,
        durationMs: clampDuration(now.getTime() - visit!.startedAt.getTime()),
        ipAddress: input.geo.ipAddress ?? visit!.ipAddress,
        city: input.geo.city ?? visit!.city,
        region: input.geo.region ?? visit!.region,
        country: input.geo.country ?? visit!.country,
        latitude: input.geo.latitude ?? visit!.latitude,
        longitude: input.geo.longitude ?? visit!.longitude,
        locationLabel: input.geo.locationLabel || visit!.locationLabel,
      },
    });
    await prisma.siteVisitor.update({
      where: { id: visitor.id },
      data: {
        lastSeenAt: now,
        lastIp: input.geo.ipAddress,
        lastCity: input.geo.city,
        lastRegion: input.geo.region,
        lastCountry: input.geo.country,
        lastLatitude: input.geo.latitude,
        lastLongitude: input.geo.longitude,
        lastLocation: input.geo.locationLabel,
        lastUserAgent: input.userAgent?.slice(0, 500) ?? null,
        lastPath: path,
      },
    });
  }

  const pageView = await prisma.sitePageView.create({
    data: {
      visitorId: visitor.id,
      visitId: visit.id,
      path,
      title: input.title?.slice(0, 300) ?? null,
      enteredAt: now,
      durationMs: 0,
      ipAddress: input.geo.ipAddress,
      city: input.geo.city,
      region: input.geo.region,
      country: input.geo.country,
      latitude: input.geo.latitude,
      longitude: input.geo.longitude,
    },
  });

  return {
    sessionToken,
    visitorId: visitor.id,
    visitId: visit.id,
    pageViewId: pageView.id,
    visitCount: visitor.visitCount,
  };
}

export async function trackHeartbeat(input: {
  pageViewId: string;
  sessionToken?: string | null;
}) {
  const now = new Date();
  const pageView = await prisma.sitePageView.findUnique({
    where: { id: input.pageViewId },
    include: { visit: true, visitor: true },
  });
  if (!pageView) return null;

  if (input.sessionToken && pageView.visitor.sessionToken !== input.sessionToken) {
    return null;
  }

  const durationMs = clampDuration(now.getTime() - pageView.enteredAt.getTime());
  await prisma.sitePageView.update({
    where: { id: pageView.id },
    data: { durationMs, leftAt: null },
  });
  await prisma.siteVisit.update({
    where: { id: pageView.visitId },
    data: {
      endedAt: now,
      exitPath: pageView.path,
      durationMs: clampDuration(now.getTime() - pageView.visit.startedAt.getTime()),
    },
  });
  await prisma.siteVisitor.update({
    where: { id: pageView.visitorId },
    data: { lastSeenAt: now, lastPath: pageView.path },
  });

  return { pageViewId: pageView.id, durationMs };
}

export async function trackLeave(input: {
  pageViewId: string;
  durationMs?: number;
  sessionToken?: string | null;
}) {
  const now = new Date();
  const pageView = await prisma.sitePageView.findUnique({
    where: { id: input.pageViewId },
    include: { visit: true, visitor: true },
  });
  if (!pageView) return null;

  if (input.sessionToken && pageView.visitor.sessionToken !== input.sessionToken) {
    return null;
  }

  const durationMs =
    input.durationMs != null
      ? clampDuration(input.durationMs)
      : clampDuration(now.getTime() - pageView.enteredAt.getTime());

  await prisma.sitePageView.update({
    where: { id: pageView.id },
    data: { leftAt: now, durationMs },
  });
  await prisma.siteVisit.update({
    where: { id: pageView.visitId },
    data: {
      endedAt: now,
      exitPath: pageView.path,
      durationMs: clampDuration(now.getTime() - pageView.visit.startedAt.getTime()),
    },
  });
  await prisma.siteVisitor.update({
    where: { id: pageView.visitorId },
    data: { lastSeenAt: now },
  });

  return { pageViewId: pageView.id, durationMs };
}

export async function listSiteVisitors(opts?: { limit?: number; q?: string }) {
  const limit = Math.min(Math.max(opts?.limit ?? 100, 1), 300);
  const q = opts?.q?.trim();

  const visitors = await prisma.siteVisitor.findMany({
    where: q
      ? {
          OR: [
            { lastIp: { contains: q, mode: "insensitive" } },
            { lastCity: { contains: q, mode: "insensitive" } },
            { lastRegion: { contains: q, mode: "insensitive" } },
            { lastCountry: { contains: q, mode: "insensitive" } },
            { lastPath: { contains: q, mode: "insensitive" } },
            { lastLocation: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { lastSeenAt: "desc" },
    take: limit,
    include: {
      visits: {
        orderBy: { startedAt: "desc" },
        take: 8,
        include: {
          pageViews: { orderBy: { enteredAt: "desc" }, take: 40 },
        },
      },
      _count: { select: { visits: true, pageViews: true } },
    },
  });

  return visitors.map((v) => ({
    id: v.id,
    sessionToken: v.sessionToken,
    visitCount: v.visitCount,
    pageViewCount: v._count.pageViews,
    firstSeenAt: v.firstSeenAt.toISOString(),
    lastSeenAt: v.lastSeenAt.toISOString(),
    lastIp: v.lastIp,
    lastCity: v.lastCity,
    lastRegion: v.lastRegion,
    lastCountry: v.lastCountry,
    lastLatitude: v.lastLatitude,
    lastLongitude: v.lastLongitude,
    lastLocation: v.lastLocation,
    lastUserAgent: v.lastUserAgent,
    lastPath: v.lastPath,
    visits: v.visits.map((visit) => ({
      id: visit.id,
      startedAt: visit.startedAt.toISOString(),
      endedAt: visit.endedAt.toISOString(),
      durationMs: visit.durationMs,
      durationLabel: formatDuration(visit.durationMs),
      entryPath: visit.entryPath,
      exitPath: visit.exitPath,
      ipAddress: visit.ipAddress,
      city: visit.city,
      region: visit.region,
      country: visit.country,
      latitude: visit.latitude,
      longitude: visit.longitude,
      locationLabel: visit.locationLabel,
      referrer: visit.referrer,
      pageViews: visit.pageViews.map((pv) => ({
        id: pv.id,
        path: pv.path,
        title: pv.title,
        enteredAt: pv.enteredAt.toISOString(),
        leftAt: pv.leftAt?.toISOString() ?? null,
        durationMs: pv.durationMs,
        durationLabel: formatDuration(pv.durationMs),
        ipAddress: pv.ipAddress,
        city: pv.city,
        region: pv.region,
        country: pv.country,
        latitude: pv.latitude,
        longitude: pv.longitude,
      })),
    })),
  }));
}

export async function getVisitorAnalyticsSummary() {
  const [visitors, visits, pageViews, todayVisitors] = await Promise.all([
    prisma.siteVisitor.count(),
    prisma.siteVisit.count(),
    prisma.sitePageView.count(),
    prisma.siteVisitor.count({
      where: {
        lastSeenAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
  ]);
  return { visitors, visits, pageViews, todayVisitors };
}
