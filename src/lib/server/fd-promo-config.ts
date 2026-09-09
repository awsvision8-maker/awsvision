import { prisma } from "@/lib/prisma";
import {
  type ActiveFdPromo,
  type FdPromoRuntimeConfig,
  buildActiveFdPromo,
  defaultFdPromoRuntimeConfig,
  isFdPromoOfferingOpen,
} from "@/lib/promotions";

const CONFIG_ID = "default";

export type FdPromoConfigRecord = FdPromoRuntimeConfig & {
  id: string;
  updatedAt: string;
  updatedByAdminId: string | null;
};

function toRuntime(row: {
  isActive: boolean;
  displayMonth: number;
  displayYear: number;
  endsAt: Date;
  minDeposit: number;
  returnPercent: number;
  termMonths: number;
  planId: string;
  packageName: string | null;
  headline: string | null;
  subheadline: string | null;
}): FdPromoRuntimeConfig {
  return {
    isActive: row.isActive,
    displayMonth: row.displayMonth,
    displayYear: row.displayYear,
    endsAt: row.endsAt.toISOString(),
    minDeposit: row.minDeposit,
    returnPercent: row.returnPercent,
    termMonths: row.termMonths,
    planId: row.planId,
    packageName: row.packageName,
    headline: row.headline,
    subheadline: row.subheadline,
  };
}

function endOfMonth(year: number, month1to12: number) {
  return new Date(year, month1to12, 0, 23, 59, 59, 999);
}

/** Ensure singleton exists; seed from current calendar month defaults */
export async function ensureFdPromoConfig(): Promise<FdPromoConfigRecord> {
  const existing = await prisma.fdPromoConfig.findUnique({ where: { id: CONFIG_ID } });
  if (existing) {
    return {
      id: existing.id,
      ...toRuntime(existing),
      updatedAt: existing.updatedAt.toISOString(),
      updatedByAdminId: existing.updatedByAdminId,
    };
  }

  const defaults = defaultFdPromoRuntimeConfig();
  const created = await prisma.fdPromoConfig.create({
    data: {
      id: CONFIG_ID,
      isActive: defaults.isActive,
      displayMonth: defaults.displayMonth,
      displayYear: defaults.displayYear,
      endsAt: new Date(defaults.endsAt),
      minDeposit: defaults.minDeposit,
      returnPercent: defaults.returnPercent,
      termMonths: defaults.termMonths,
      planId: defaults.planId,
    },
  });

  return {
    id: created.id,
    ...toRuntime(created),
    updatedAt: created.updatedAt.toISOString(),
    updatedByAdminId: created.updatedByAdminId,
  };
}

export async function getFdPromoConfig(): Promise<FdPromoConfigRecord> {
  return ensureFdPromoConfig();
}

/** Public marketing payload — null when turned off or past endsAt */
export async function resolveActiveFdPromo(
  now: Date = new Date()
): Promise<ActiveFdPromo | null> {
  const config = await getFdPromoConfig();
  if (!isFdPromoOfferingOpen(config, now)) return null;
  return buildActiveFdPromo(config);
}

/** Always builds from DB config (even if inactive) — for admin preview */
export async function resolveFdPromoPreview(): Promise<{
  config: FdPromoConfigRecord;
  promo: ActiveFdPromo;
  offeringOpen: boolean;
}> {
  const config = await getFdPromoConfig();
  const promo = buildActiveFdPromo(config);
  return {
    config,
    promo,
    offeringOpen: isFdPromoOfferingOpen(config),
  };
}

export type UpdateFdPromoInput = {
  isActive?: boolean;
  displayMonth?: number;
  displayYear?: number;
  endsAt?: string;
  minDeposit?: number;
  returnPercent?: number;
  termMonths?: number;
  packageName?: string | null;
  headline?: string | null;
  subheadline?: string | null;
  /** Quick action: set display month/year to calendar now and endsAt to month end */
  rollToCurrentMonth?: boolean;
  /** Quick action: push endsAt forward by N days (keeps display month) */
  extendDays?: number;
  /** Quick action: set display to next month and extend endsAt to that month’s end */
  rollToNextMonth?: boolean;
};

export async function updateFdPromoConfig(
  input: UpdateFdPromoInput,
  adminId?: string | null
): Promise<FdPromoConfigRecord> {
  const current = await ensureFdPromoConfig();
  let displayMonth = input.displayMonth ?? current.displayMonth;
  let displayYear = input.displayYear ?? current.displayYear;
  let endsAt = input.endsAt ? new Date(input.endsAt) : new Date(current.endsAt);

  if (input.rollToCurrentMonth) {
    const now = new Date();
    displayMonth = now.getMonth() + 1;
    displayYear = now.getFullYear();
    endsAt = endOfMonth(displayYear, displayMonth);
  }

  if (input.rollToNextMonth) {
    const base = new Date(displayYear, displayMonth - 1, 1);
    base.setMonth(base.getMonth() + 1);
    displayMonth = base.getMonth() + 1;
    displayYear = base.getFullYear();
    endsAt = endOfMonth(displayYear, displayMonth);
  }

  if (input.extendDays && input.extendDays > 0) {
    const next = new Date(endsAt);
    next.setDate(next.getDate() + input.extendDays);
    next.setHours(23, 59, 59, 999);
    endsAt = next;
  }

  if (Number.isNaN(endsAt.getTime())) {
    throw new Error("Invalid endsAt date");
  }
  if (displayMonth < 1 || displayMonth > 12) {
    throw new Error("displayMonth must be 1–12");
  }
  if (displayYear < 2020 || displayYear > 2100) {
    throw new Error("Invalid displayYear");
  }

  const minDeposit = input.minDeposit ?? current.minDeposit;
  const returnPercent = input.returnPercent ?? current.returnPercent;
  const termMonths = input.termMonths ?? current.termMonths;

  if (minDeposit < 1000) throw new Error("Minimum deposit must be at least $1,000");
  if (returnPercent <= 0 || returnPercent > 500) {
    throw new Error("Return percent must be between 0 and 500");
  }
  if (termMonths < 1 || termMonths > 60) {
    throw new Error("Term months must be between 1 and 60");
  }

  const updated = await prisma.fdPromoConfig.update({
    where: { id: CONFIG_ID },
    data: {
      isActive: input.isActive ?? current.isActive,
      displayMonth,
      displayYear,
      endsAt,
      minDeposit,
      returnPercent,
      termMonths,
      packageName:
        input.packageName !== undefined ? input.packageName?.trim() || null : current.packageName,
      headline:
        input.headline !== undefined ? input.headline?.trim() || null : current.headline,
      subheadline:
        input.subheadline !== undefined
          ? input.subheadline?.trim() || null
          : current.subheadline,
      updatedByAdminId: adminId ?? current.updatedByAdminId,
    },
  });

  return {
    id: updated.id,
    ...toRuntime(updated),
    updatedAt: updated.updatedAt.toISOString(),
    updatedByAdminId: updated.updatedByAdminId,
  };
}
