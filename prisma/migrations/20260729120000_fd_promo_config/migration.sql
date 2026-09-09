-- Admin-managed Wealth Accelerator FD promotion (singleton)
CREATE TABLE IF NOT EXISTS "FdPromoConfig" (
    "id" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "displayMonth" INTEGER NOT NULL,
    "displayYear" INTEGER NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "minDeposit" DOUBLE PRECISION NOT NULL DEFAULT 50000,
    "returnPercent" DOUBLE PRECISION NOT NULL DEFAULT 90,
    "termMonths" INTEGER NOT NULL DEFAULT 6,
    "planId" TEXT NOT NULL DEFAULT 'july-promo-fd',
    "packageName" TEXT,
    "headline" TEXT,
    "subheadline" TEXT,
    "updatedByAdminId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FdPromoConfig_pkey" PRIMARY KEY ("id")
);
