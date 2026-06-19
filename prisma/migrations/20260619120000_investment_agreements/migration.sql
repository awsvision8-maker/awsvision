-- CreateTable
CREATE TABLE "InvestmentAgreement" (
    "id" TEXT NOT NULL,
    "agreementNumber" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "planName" TEXT NOT NULL,
    "monthlyRatePercent" DOUBLE PRECISION NOT NULL,
    "termMonths" INTEGER NOT NULL,
    "totalRoiPercent" DOUBLE PRECISION NOT NULL,
    "depositAmount" DOUBLE PRECISION NOT NULL,
    "totalPrincipal" DOUBLE PRECISION NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "maturityDate" TIMESTAMP(3) NOT NULL,
    "clientFirstName" TEXT NOT NULL,
    "clientLastName" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,

    CONSTRAINT "InvestmentAgreement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InvestmentAgreement_agreementNumber_key" ON "InvestmentAgreement"("agreementNumber");

-- CreateIndex
CREATE UNIQUE INDEX "InvestmentAgreement_transactionId_key" ON "InvestmentAgreement"("transactionId");

-- CreateIndex
CREATE INDEX "InvestmentAgreement_userId_idx" ON "InvestmentAgreement"("userId");

-- CreateIndex
CREATE INDEX "InvestmentAgreement_accountId_idx" ON "InvestmentAgreement"("accountId");

-- AddForeignKey
ALTER TABLE "InvestmentAgreement" ADD CONSTRAINT "InvestmentAgreement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
