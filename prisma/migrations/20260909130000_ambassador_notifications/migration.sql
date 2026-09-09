-- AlterTable
ALTER TABLE "NotificationBroadcast" ADD COLUMN IF NOT EXISTS "ambassadorId" TEXT;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "NotificationBroadcast_ambassadorId_idx" ON "NotificationBroadcast"("ambassadorId");
