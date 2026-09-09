/**
 * Reset Michael baes ambassador password and print login + referral details.
 */
import bcrypt from "bcryptjs";
import { Client } from "pg";
import fs from "fs";

const DB_PASS = fs.readFileSync(".cpanel-db-pass.txt", "utf8").trim();

function randomSegment(length: number) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

async function main() {
  const client = new Client({
    host: "bore.pub",
    port: 35542,
    user: "awsvision_webappuser",
    password: DB_PASS,
    database: "awsvision_webapp",
    ssl: false,
  });
  await client.connect();

  const id = "cmqis4e53000dl204iqrxibjm";
  const plainPassword = `Av${randomSegment(4)}${randomSegment(4)}!`;
  const passwordHash = await bcrypt.hash(plainPassword, 12);

  const res = await client.query(
    `UPDATE "BrandAmbassador"
     SET "passwordHash" = $1, "updatedAt" = NOW()
     WHERE id = $2
     RETURNING username, email, "firstName", "lastName", "referralCode", "commissionRatePercent", status`,
    [passwordHash, id]
  );

  const row = res.rows[0];
  if (!row) throw new Error("Ambassador not found");

  console.log("=== Michael Ambassador Credentials (password reset) ===");
  console.log(`Name: ${row.firstName} ${row.lastName}`);
  console.log(`Email: ${row.email}`);
  console.log(`Username: ${row.username}`);
  console.log(`Password: ${plainPassword}`);
  console.log(`Referral code: ${row.referralCode}`);
  console.log(`Referral link: https://awsvision.com/signup?ref=${encodeURIComponent(row.referralCode)}`);
  console.log(`Manager login: https://awsvision.com/manager/login`);
  console.log(`Commission: ${row.commissionRatePercent}%`);
  console.log(`Status: ${row.status}`);

  await client.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
