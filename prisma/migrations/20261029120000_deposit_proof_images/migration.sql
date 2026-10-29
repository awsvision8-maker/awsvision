-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN IF NOT EXISTS "proofFront" TEXT;
ALTER TABLE "Transaction" ADD COLUMN IF NOT EXISTS "proofBack" TEXT;
