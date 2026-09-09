/**
 * 1. Extend FD promo through December 2026
 * 2. Create User records for failed signup logs where the account was never created
 *    (e.g. promo was closed at submit time). Skips test emails and duplicates.
 */
import bcrypt from "bcryptjs";
import { Client } from "pg";
import fs from "fs";
import { randomBytes } from "crypto";

const password = fs.readFileSync(".cpanel-db-pass.txt", "utf8").trim();

const client = new Client({
  host: "bore.pub",
  port: 35542,
  user: "awsvision_webappuser",
  password,
  database: "awsvision_webapp",
  ssl: false,
});

const PROMO_PLAN_ID = "july-promo-fd";
const PROMO_RETURN = 90;
const PROMO_TERM_MONTHS = 6;

function generateAccountNumber() {
  return `AV${Math.floor(1000000000 + Math.random() * 9000000000)}`;
}

function addMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function isRecoverable(row: {
  email: string | null;
  errorMessage: string | null;
  errorCode: string | null;
}) {
  if (!row.email) return false;
  if (row.email.includes("@awsvision-test.invalid")) return false;
  const msg = (row.errorMessage ?? "").toLowerCase();
  if (msg.includes("promotion is not open")) return true;
  if (row.errorCode === "server_error" && msg.includes("wealth accelerator")) return true;
  return false;
}

async function extendPromo() {
  const endsAt = new Date(2026, 11, 31, 23, 59, 59, 999); // Dec 31, 2026
  await client.query(
    `UPDATE "FdPromoConfig"
     SET "isActive" = TRUE,
         "displayMonth" = 12,
         "displayYear" = 2026,
         "endsAt" = $1,
         "updatedAt" = NOW()
     WHERE id = 'default'`,
    [endsAt]
  );
  console.log("Promo extended to:", endsAt.toISOString());
}

async function recoverFailedSignups() {
  const failed = await client.query(
    `SELECT DISTINCT ON (LOWER(email))
       id, email, "firstName", "lastName", "onlineId", "errorMessage", "errorCode", "profileType", "createdAt"
     FROM "SignupAttemptLog"
     WHERE status = 'failed' AND email IS NOT NULL
     ORDER BY LOWER(email), "createdAt" DESC`
  );

  let created = 0;
  let skipped = 0;

  for (const row of failed.rows) {
    const email = row.email.toLowerCase().trim();

    const existing = await client.query('SELECT id FROM "User" WHERE LOWER(email) = $1', [email]);
    if (existing.rows.length > 0) {
      console.log(`SKIP (already user): ${email}`);
      skipped++;
      continue;
    }

    if (!isRecoverable(row)) {
      console.log(`SKIP (not recoverable): ${email} — ${row.errorCode}: ${row.errorMessage?.slice(0, 60)}`);
      skipped++;
      continue;
    }

    let onlineId = row.onlineId?.trim() || null;
    if (onlineId) {
      const idTaken = await client.query(
        'SELECT id FROM "User" WHERE LOWER("onlineId") = LOWER($1)',
        [onlineId]
      );
      if (idTaken.rows.length > 0) {
        console.log(`SKIP (onlineId taken): ${email} / ${onlineId}`);
        skipped++;
        continue;
      }
    } else {
      const base = `${(row.firstName ?? "User").replace(/\W/g, "")}${(row.lastName ?? "").replace(/\W/g, "")}`.slice(0, 20) || "Client";
      onlineId = `${base}${Date.now().toString().slice(-4)}`;
    }

    const tempPassword = randomBytes(12).toString("base64url");
    const passwordHash = await bcrypt.hash(tempPassword, 12);
    const userId = `rec_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const accountId = `acc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const createdAt = new Date(row.createdAt);
    const maturityDate = addMonths(createdAt, PROMO_TERM_MONTHS);
    const monthlyRate = PROMO_RETURN / PROMO_TERM_MONTHS;

    const kycData = JSON.stringify({
      recoveredFromSignupLog: row.id,
      recoveredAt: new Date().toISOString(),
      originalError: row.errorMessage,
      note: "Account recovered from failed signup after promo extension. User must reset password via support.",
    });

    await client.query("BEGIN");
    try {
      await client.query(
        `INSERT INTO "User" (
          id, email, "passwordHash", "firstName", "lastName", phone, "onlineId",
          "kycStatus", "profileType", "kycData", "createdAt", "updatedAt"
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,NOW())`,
        [
          userId,
          email,
          passwordHash,
          row.firstName ?? "Unknown",
          row.lastName ?? "User",
          "Pending",
          onlineId,
          "pending",
          row.profileType === "nonprofit" ? "nonprofit" : "individual",
          kycData,
          createdAt,
        ]
      );

      await client.query(
        `INSERT INTO "PortfolioAccount" (
          id, "userId", "accountNumber", type, principal, "monthlyRatePercent",
          "investmentPlanId", "maturityDate", status, "createdAt"
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [
          accountId,
          userId,
          generateAccountNumber(),
          "fixed_deposit",
          0,
          monthlyRate,
          PROMO_PLAN_ID,
          maturityDate,
          "active",
          createdAt,
        ]
      );

      await client.query(
        `UPDATE "SignupAttemptLog" SET status = 'success', "errorMessage" = $1 WHERE id = $2`,
        [`Recovered into user ${userId} on promo extension`, row.id]
      );

      await client.query("COMMIT");
      console.log(`CREATED: ${email} (${row.firstName} ${row.lastName}) onlineId=${onlineId}`);
      created++;
    } catch (err) {
      await client.query("ROLLBACK");
      console.error(`FAILED ${email}:`, err instanceof Error ? err.message : err);
    }
  }

  console.log(`\nRecovery done: ${created} created, ${skipped} skipped`);
}

async function cleanupTestUsers() {
  const res = await client.query(
    `DELETE FROM "User" WHERE email LIKE '%@awsvision-test.invalid' RETURNING email`
  );
  if (res.rows.length) {
    console.log("Removed test users:", res.rows.map((r) => r.email).join(", "));
  }
}

async function main() {
  await client.connect();
  await extendPromo();
  await recoverFailedSignups();
  await cleanupTestUsers();

  const promo = await client.query('SELECT "displayMonth", "displayYear", "endsAt", "isActive" FROM "FdPromoConfig"');
  console.log("\nPromo now:", promo.rows[0]);

  const count = await client.query('SELECT COUNT(*)::int AS c FROM "User"');
  console.log("Total users:", count.rows[0].c);

  await client.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
