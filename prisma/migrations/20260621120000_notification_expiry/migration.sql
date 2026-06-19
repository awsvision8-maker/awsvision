-- AlterTable
ALTER TABLE "NotificationBroadcast" ADD COLUMN "durationDays" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "NotificationBroadcast" ADD COLUMN "durationHours" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "NotificationBroadcast" ADD COLUMN "expiresAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "UserNotification" ADD COLUMN "expiresAt" TIMESTAMP(3);

-- Backfill existing rows (30-day default visibility)
UPDATE "NotificationBroadcast"
SET "expiresAt" = "createdAt" + INTERVAL '30 days',
    "durationDays" = 30
WHERE "expiresAt" IS NULL;

UPDATE "UserNotification"
SET "expiresAt" = "createdAt" + INTERVAL '30 days'
WHERE "expiresAt" IS NULL;

ALTER TABLE "NotificationBroadcast" ALTER COLUMN "expiresAt" SET NOT NULL;
ALTER TABLE "UserNotification" ALTER COLUMN "expiresAt" SET NOT NULL;

-- CreateIndex
CREATE INDEX "NotificationBroadcast_expiresAt_idx" ON "NotificationBroadcast"("expiresAt");

-- CreateIndex
CREATE INDEX "UserNotification_userId_expiresAt_idx" ON "UserNotification"("userId", "expiresAt");
