const SITE_TIMEZONE = "America/Chicago";

export function getSiteCalendarDate(date = new Date()): {
  year: number;
  month: number;
  day: number;
} {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: SITE_TIMEZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const parts = Object.fromEntries(
    fmt
      .formatToParts(date)
      .filter((p) => p.type !== "literal")
      .map((p) => [p.type, parseInt(p.value, 10)])
  ) as { year: number; month: number; day: number };
  return parts;
}

export function getBirthdayMonthDay(dob: Date | string): { month: number; day: number } | null {
  if (typeof dob === "string" && /^\d{4}-\d{2}-\d{2}/.test(dob)) {
    const match = dob.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (!match) return null;
    return { month: parseInt(match[2]!, 10), day: parseInt(match[3]!, 10) };
  }
  if (dob instanceof Date && !Number.isNaN(dob.getTime())) {
    return { month: dob.getUTCMonth() + 1, day: dob.getUTCDate() };
  }
  return null;
}

export function parseDateOfBirthForStorage(value: string | undefined | null): Date | null {
  if (!value?.trim()) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const parsed = new Date(`${value}T12:00:00.000Z`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function isBirthdayToday(dob: Date | string | undefined | null, now = new Date()): boolean {
  if (!dob) return false;
  const birthday = getBirthdayMonthDay(dob);
  if (!birthday) return false;
  const today = getSiteCalendarDate(now);
  return birthday.month === today.month && birthday.day === today.day;
}
