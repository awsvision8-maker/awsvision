-- CreateTable
CREATE TABLE "KycDocumentRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "documentKey" TEXT NOT NULL,
    "adminNote" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "adminId" TEXT,
    "notificationId" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fulfilledAt" TIMESTAMP(3),

    CONSTRAINT "KycDocumentRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "KycDocumentRequest_userId_status_idx" ON "KycDocumentRequest"("userId", "status");

-- CreateIndex
CREATE INDEX "KycDocumentRequest_status_requestedAt_idx" ON "KycDocumentRequest"("status", "requestedAt");

-- AddForeignKey
ALTER TABLE "KycDocumentRequest" ADD CONSTRAINT "KycDocumentRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
