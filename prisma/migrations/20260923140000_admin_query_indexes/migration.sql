-- Admin list / stats query speed
CREATE INDEX IF NOT EXISTS "User_kycStatus_idx" ON "User"("kycStatus");
CREATE INDEX IF NOT EXISTS "User_createdAt_idx" ON "User"("createdAt");
CREATE INDEX IF NOT EXISTS "User_profileType_idx" ON "User"("profileType");
CREATE INDEX IF NOT EXISTS "Transaction_type_status_idx" ON "Transaction"("type", "status");
CREATE INDEX IF NOT EXISTS "Transaction_accountId_type_status_idx" ON "Transaction"("accountId", "type", "status");
CREATE INDEX IF NOT EXISTS "WithdrawalRequest_status_idx" ON "WithdrawalRequest"("status");
CREATE INDEX IF NOT EXISTS "WithdrawalRequest_status_createdAt_idx" ON "WithdrawalRequest"("status", "createdAt");
