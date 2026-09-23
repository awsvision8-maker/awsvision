-- CreateTable
CREATE TABLE "SiteVisitor" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "visitCount" INTEGER NOT NULL DEFAULT 0,
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastIp" TEXT,
    "lastCity" TEXT,
    "lastRegion" TEXT,
    "lastCountry" TEXT,
    "lastLatitude" DOUBLE PRECISION,
    "lastLongitude" DOUBLE PRECISION,
    "lastLocation" TEXT,
    "lastUserAgent" TEXT,
    "lastPath" TEXT,
    "userId" TEXT,

    CONSTRAINT "SiteVisitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteVisit" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "durationMs" INTEGER NOT NULL DEFAULT 0,
    "entryPath" TEXT NOT NULL DEFAULT '/',
    "exitPath" TEXT,
    "ipAddress" TEXT,
    "city" TEXT,
    "region" TEXT,
    "country" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "locationLabel" TEXT,
    "userAgent" TEXT,
    "referrer" TEXT,

    CONSTRAINT "SiteVisit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SitePageView" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "visitId" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "title" TEXT,
    "enteredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),
    "durationMs" INTEGER NOT NULL DEFAULT 0,
    "ipAddress" TEXT,
    "city" TEXT,
    "region" TEXT,
    "country" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,

    CONSTRAINT "SitePageView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SiteVisitor_sessionToken_key" ON "SiteVisitor"("sessionToken");

-- CreateIndex
CREATE INDEX "SiteVisitor_lastSeenAt_idx" ON "SiteVisitor"("lastSeenAt");

-- CreateIndex
CREATE INDEX "SiteVisitor_lastIp_idx" ON "SiteVisitor"("lastIp");

-- CreateIndex
CREATE INDEX "SiteVisitor_visitCount_idx" ON "SiteVisitor"("visitCount");

-- CreateIndex
CREATE INDEX "SiteVisit_visitorId_startedAt_idx" ON "SiteVisit"("visitorId", "startedAt");

-- CreateIndex
CREATE INDEX "SiteVisit_startedAt_idx" ON "SiteVisit"("startedAt");

-- CreateIndex
CREATE INDEX "SiteVisit_ipAddress_idx" ON "SiteVisit"("ipAddress");

-- CreateIndex
CREATE INDEX "SitePageView_visitorId_enteredAt_idx" ON "SitePageView"("visitorId", "enteredAt");

-- CreateIndex
CREATE INDEX "SitePageView_visitId_enteredAt_idx" ON "SitePageView"("visitId", "enteredAt");

-- CreateIndex
CREATE INDEX "SitePageView_path_enteredAt_idx" ON "SitePageView"("path", "enteredAt");

-- AddForeignKey
ALTER TABLE "SiteVisit" ADD CONSTRAINT "SiteVisit_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "SiteVisitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SitePageView" ADD CONSTRAINT "SitePageView_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "SiteVisitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SitePageView" ADD CONSTRAINT "SitePageView_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "SiteVisit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
