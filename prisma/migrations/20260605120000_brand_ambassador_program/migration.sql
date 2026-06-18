-- AlterTable
ALTER TABLE "User" ADD COLUMN "ambassadorId" TEXT;

-- CreateIndex
CREATE INDEX "User_ambassadorId_idx" ON "User"("ambassadorId");

-- CreateTable
CREATE TABLE "BrandAmbassadorApplication" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "city" TEXT,
    "state" TEXT,
    "linkedin" TEXT,
    "experience" TEXT,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reviewNote" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BrandAmbassadorApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrandAmbassador" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "referralCode" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "approvedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BrandAmbassador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManagerSession" (
    "id" TEXT NOT NULL,
    "ambassadorId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ManagerSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BrandAmbassador_applicationId_key" ON "BrandAmbassador"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "BrandAmbassador_username_key" ON "BrandAmbassador"("username");

-- CreateIndex
CREATE UNIQUE INDEX "BrandAmbassador_email_key" ON "BrandAmbassador"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BrandAmbassador_referralCode_key" ON "BrandAmbassador"("referralCode");

-- CreateIndex
CREATE INDEX "BrandAmbassadorApplication_status_createdAt_idx" ON "BrandAmbassadorApplication"("status", "createdAt");

-- CreateIndex
CREATE INDEX "BrandAmbassadorApplication_email_idx" ON "BrandAmbassadorApplication"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ManagerSession_token_key" ON "ManagerSession"("token");

-- CreateIndex
CREATE INDEX "ManagerSession_ambassadorId_idx" ON "ManagerSession"("ambassadorId");

-- CreateIndex
CREATE INDEX "ManagerSession_token_idx" ON "ManagerSession"("token");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_ambassadorId_fkey" FOREIGN KEY ("ambassadorId") REFERENCES "BrandAmbassador"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandAmbassador" ADD CONSTRAINT "BrandAmbassador_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "BrandAmbassadorApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManagerSession" ADD CONSTRAINT "ManagerSession_ambassadorId_fkey" FOREIGN KEY ("ambassadorId") REFERENCES "BrandAmbassador"("id") ON DELETE CASCADE ON UPDATE CASCADE;
