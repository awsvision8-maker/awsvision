import { prisma } from "@/lib/prisma";
import { VALID_COUNTRY_CODES } from "@/lib/countries";

/** Default blocked countries when config row is first created. */
export const DEFAULT_BLOCKED_COUNTRY_CODES = ["PK", "IN", "BD"] as const;

const CONFIG_ID = "default";

function normalizeCodes(codes: string[]): string[] {
  const unique = new Set<string>();
  for (const raw of codes) {
    const code = raw.trim().toUpperCase();
    if (code.length === 2 && VALID_COUNTRY_CODES.has(code)) {
      unique.add(code);
    }
  }
  return Array.from(unique).sort();
}

export async function getBlockedCountryCodes(): Promise<string[]> {
  const row = await prisma.geoBlockConfig.findUnique({ where: { id: CONFIG_ID } });
  if (!row) {
    await prisma.geoBlockConfig.create({
      data: {
        id: CONFIG_ID,
        blockedCodes: [...DEFAULT_BLOCKED_COUNTRY_CODES],
      },
    });
    return [...DEFAULT_BLOCKED_COUNTRY_CODES];
  }
  return normalizeCodes(row.blockedCodes);
}

export async function setBlockedCountryCodes(
  codes: string[],
  adminId?: string | null
): Promise<string[]> {
  const blockedCodes = normalizeCodes(codes);
  await prisma.geoBlockConfig.upsert({
    where: { id: CONFIG_ID },
    create: {
      id: CONFIG_ID,
      blockedCodes,
      updatedByAdminId: adminId ?? undefined,
    },
    update: {
      blockedCodes,
      updatedByAdminId: adminId ?? undefined,
    },
  });
  return blockedCodes;
}
