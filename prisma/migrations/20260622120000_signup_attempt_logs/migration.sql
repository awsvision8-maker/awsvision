-- CreateTable
CREATE TABLE "SignupAttemptLog" (
    "id" TEXT NOT NULL,
    "profileType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "email" TEXT,
    "onlineId" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "orgName" TEXT,
    "errorMessage" TEXT,
    "errorCode" TEXT,
    "source" TEXT NOT NULL DEFAULT 'server',
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "payloadKb" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SignupAttemptLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SignupAttemptLog_createdAt_idx" ON "SignupAttemptLog"("createdAt");

-- CreateIndex
CREATE INDEX "SignupAttemptLog_status_idx" ON "SignupAttemptLog"("status");

-- CreateIndex
CREATE INDEX "SignupAttemptLog_profileType_idx" ON "SignupAttemptLog"("profileType");
