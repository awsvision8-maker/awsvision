-- Reset all client balances: accounts start at $0 until admin-approved deposits.
-- Legacy auto-credited opening deposits are marked failed so they no longer count.

UPDATE "PortfolioAccount"
SET "principal" = 0,
    "profitEligibleAt" = NULL;

UPDATE "Transaction"
SET
  "status" = 'failed',
  "description" = CASE
    WHEN "description" LIKE '%[legacy reset]%' THEN "description"
    ELSE "description" || ' [legacy reset — new deposit required]'
  END
WHERE "type" = 'deposit'
  AND "status" IN ('completed', 'pending');
