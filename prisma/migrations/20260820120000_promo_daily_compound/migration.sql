-- Daily 0.5% compounding controls for July promo ($50k) accounts
ALTER TABLE "PortfolioAccount" ADD COLUMN IF NOT EXISTS "dailyCompoundActive" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "PortfolioAccount" ADD COLUMN IF NOT EXISTS "dailyCompoundStartDate" TIMESTAMP(3);
ALTER TABLE "PortfolioAccount" ADD COLUMN IF NOT EXISTS "dailyCompoundEndDate" TIMESTAMP(3);
ALTER TABLE "PortfolioAccount" ADD COLUMN IF NOT EXISTS "dailyCompoundRatePercent" DOUBLE PRECISION NOT NULL DEFAULT 0.5;
