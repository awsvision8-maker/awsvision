-- AlterTable
ALTER TABLE "User" ADD COLUMN "dateOfBirth" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "User_dateOfBirth_idx" ON "User"("dateOfBirth");

-- CreateTable
CREATE TABLE "BirthdayWish" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    "notificationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BirthdayWish_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BirthdayWish_year_idx" ON "BirthdayWish"("year");

-- CreateIndex
CREATE UNIQUE INDEX "BirthdayWish_userId_year_key" ON "BirthdayWish"("userId", "year");

-- AddForeignKey
ALTER TABLE "BirthdayWish" ADD CONSTRAINT "BirthdayWish_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
