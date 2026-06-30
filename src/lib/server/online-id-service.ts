import { prisma } from "@/lib/prisma";

export function normalizeOnlineId(value: string): string {
  return value.trim().replace(/\s/g, "");
}

export function isValidOnlineIdFormat(value: string): boolean {
  const id = normalizeOnlineId(value);
  return id.length >= 4 && id.length <= 32 && /^[a-zA-Z0-9._-]+$/.test(id);
}

export async function isOnlineIdTaken(onlineId: string): Promise<boolean> {
  const normalized = normalizeOnlineId(onlineId);
  if (!normalized) return false;

  const existing = await prisma.user.findFirst({
    where: { onlineId: { equals: normalized, mode: "insensitive" } },
    select: { id: true },
  });

  return !!existing;
}

export async function suggestOnlineIds(
  base: string,
  hints?: { firstName?: string; lastName?: string; orgName?: string }
): Promise<string[]> {
  const normalized = normalizeOnlineId(base).toLowerCase().replace(/[^a-z0-9._-]/g, "");
  const candidates: string[] = [];

  if (hints?.firstName && hints?.lastName) {
    const f = hints.firstName.toLowerCase().replace(/[^a-z0-9]/g, "");
    const l = hints.lastName.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (f && l) {
      candidates.push(`${f}.${l}`, `${f}${l}`, `${f}_${l}`, `${l}.${f}`, `${f}${l.slice(0, 1)}`);
    }
  }

  if (hints?.orgName) {
    const slug = hints.orgName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "")
      .slice(0, 24);
    if (slug.length >= 4) {
      candidates.push(slug, `${slug}_org`, `org_${slug}`);
    }
  }

  if (normalized.length >= 4) {
    for (let i = 1; i <= 20; i++) {
      candidates.push(`${normalized}${i}`, `${normalized}_${i}`);
    }
    candidates.push(`${normalized}_${Math.floor(Math.random() * 900 + 100)}`);
  }

  const seen = new Set<string>();
  const available: string[] = [];

  for (const candidate of candidates) {
    const id = normalizeOnlineId(candidate);
    if (id.length < 4 || id.length > 32 || !isValidOnlineIdFormat(id)) continue;
    const key = id.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    if (!(await isOnlineIdTaken(id))) {
      available.push(id);
      if (available.length >= 4) break;
    }
  }

  return available;
}

export async function checkOnlineIdAvailability(
  onlineId: string,
  hints?: { firstName?: string; lastName?: string; orgName?: string }
) {
  const normalized = normalizeOnlineId(onlineId);

  if (!normalized) {
    return {
      available: false,
      onlineId: normalized,
      message: "Online ID is required",
      suggestions: [] as string[],
    };
  }

  if (!isValidOnlineIdFormat(normalized)) {
    return {
      available: false,
      onlineId: normalized,
      message: "Online ID must be 4–32 characters and use only letters, numbers, dots, dashes, or underscores",
      suggestions: [] as string[],
    };
  }

  const taken = await isOnlineIdTaken(normalized);
  if (!taken) {
    return {
      available: true,
      onlineId: normalized,
      message: null as string | null,
      suggestions: [] as string[],
    };
  }

  const suggestions = await suggestOnlineIds(normalized, hints);
  return {
    available: false,
    onlineId: normalized,
    message: "This Online ID is already taken. Please choose a different one.",
    suggestions,
  };
}
