import { prisma } from "@/lib/prisma";
import {
  getBirthdayMonthDay,
  getSiteCalendarDate,
  parseDateOfBirthForStorage,
} from "@/lib/birthday";
import { createUserNotification } from "@/lib/server/notification-service";
import { notifyBirthday } from "@/lib/server/notifications";

export async function backfillUserDatesOfBirth(limit = 500) {
  const users = await prisma.user.findMany({
    where: { dateOfBirth: null, kycData: { not: null } },
    select: { id: true, kycData: true },
    take: limit,
  });

  let updated = 0;
  for (const user of users) {
    try {
      const kyc = JSON.parse(user.kycData!) as { dateOfBirth?: string };
      const stored = parseDateOfBirthForStorage(kyc.dateOfBirth);
      if (!stored) continue;
      await prisma.user.update({
        where: { id: user.id },
        data: { dateOfBirth: stored },
      });
      updated++;
    } catch {
      // skip invalid kyc payloads
    }
  }
  return updated;
}

function birthdayWishCopy(firstName: string) {
  const title = "Happy Birthday from AWS Vision!";
  const message = `Happy Birthday, ${firstName}! 🎂

The entire AWS Vision team wishes you a wonderful day filled with joy and success. Thank you for being a valued member of our community — we're honored to celebrate with you today.

Warm regards,
AWS Vision Financial`;
  return { title, message };
}

export async function runBirthdayWishes() {
  const backfilled = await backfillUserDatesOfBirth();
  const today = getSiteCalendarDate();

  const users = await prisma.user.findMany({
    where: { dateOfBirth: { not: null } },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      dateOfBirth: true,
      birthdayWishes: {
        where: { year: today.year },
        select: { id: true },
      },
    },
  });

  const result = {
    date: today,
    backfilled,
    eligible: 0,
    sent: 0,
    skipped: 0,
    errors: 0 as number,
    errorDetails: [] as string[],
  };

  for (const user of users) {
    if (!user.dateOfBirth) continue;
    const parts = getBirthdayMonthDay(user.dateOfBirth);
    if (!parts || parts.month !== today.month || parts.day !== today.day) continue;

    result.eligible++;

    if (user.birthdayWishes.length > 0) {
      result.skipped++;
      continue;
    }

    try {
      const { title, message } = birthdayWishCopy(user.firstName);
      const notification = await createUserNotification({
        userId: user.id,
        title,
        message,
        type: "success",
        durationDays: 7,
      });

      notifyBirthday({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      });

      await prisma.birthdayWish.create({
        data: {
          userId: user.id,
          year: today.year,
          emailSent: true,
          notificationId: notification.id,
        },
      });

      result.sent++;
    } catch (err) {
      result.errors++;
      result.errorDetails.push(
        `${user.email}: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  }

  return result;
}
