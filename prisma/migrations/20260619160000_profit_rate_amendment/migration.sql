-- AlterTable
ALTER TABLE "PortfolioAccount" ADD COLUMN "profitRateAmended" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "amendmentNote" TEXT;
