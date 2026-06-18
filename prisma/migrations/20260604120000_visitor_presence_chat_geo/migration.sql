-- AlterTable
ALTER TABLE "ChatConversation" ADD COLUMN "visitorIp" TEXT;
ALTER TABLE "ChatConversation" ADD COLUMN "visitorCity" TEXT;
ALTER TABLE "ChatConversation" ADD COLUMN "visitorRegion" TEXT;
ALTER TABLE "ChatConversation" ADD COLUMN "visitorCountry" TEXT;
ALTER TABLE "ChatConversation" ADD COLUMN "visitorLocation" TEXT;
ALTER TABLE "ChatConversation" ADD COLUMN "lastSeenAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "VisitorPresence" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT,
    "visitorName" TEXT,
    "visitorEmail" TEXT,
    "conversationId" TEXT,
    "currentPath" TEXT NOT NULL DEFAULT '/',
    "ipAddress" TEXT,
    "city" TEXT,
    "region" TEXT,
    "country" TEXT,
    "locationLabel" TEXT,
    "status" TEXT NOT NULL DEFAULT 'website',
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VisitorPresence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VisitorPresence_sessionToken_key" ON "VisitorPresence"("sessionToken");

-- CreateIndex
CREATE INDEX "VisitorPresence_status_lastSeenAt_idx" ON "VisitorPresence"("status", "lastSeenAt");

-- CreateIndex
CREATE INDEX "VisitorPresence_lastSeenAt_idx" ON "VisitorPresence"("lastSeenAt");
