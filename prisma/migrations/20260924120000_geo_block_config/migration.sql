-- CreateTable
CREATE TABLE "GeoBlockConfig" (
    "id" TEXT NOT NULL,
    "blockedCodes" TEXT[],
    "updatedByAdminId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeoBlockConfig_pkey" PRIMARY KEY ("id")
);

-- Seed default blocked countries (Pakistan, India, Bangladesh)
INSERT INTO "GeoBlockConfig" ("id", "blockedCodes", "createdAt", "updatedAt")
VALUES ('default', ARRAY['PK','IN','BD']::TEXT[], CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
