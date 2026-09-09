const { Client } = require("pg");
const fs = require("fs");

const password = fs.readFileSync(".cpanel-db-pass.txt", "utf8").trim();
const client = new Client({
  host: "bore.pub",
  port: 35542,
  user: "awsvision_webappuser",
  password,
  database: "awsvision_webapp",
  ssl: false,
});

async function main() {
  await client.connect();

  const failed = await client.query(
    `SELECT id, email, "firstName", "lastName", "onlineId", "errorMessage", "errorCode", "createdAt", "profileType"
     FROM "SignupAttemptLog"
     WHERE status = 'failed' AND email IS NOT NULL
     ORDER BY "createdAt" DESC`
  );
  console.log(`Failed logs with email: ${failed.rows.length}`);
  for (const r of failed.rows) {
    const exists = await client.query('SELECT id FROM "User" WHERE LOWER(email) = LOWER($1)', [r.email]);
    console.log(
      `${r.createdAt.toISOString()} | ${r.email} | ${r.firstName ?? "-"} ${r.lastName ?? "-"} | ${r.errorCode} | exists=${exists.rows.length > 0} | ${r.errorMessage?.slice(0, 80)}`
    );
  }

  const promo = await client.query('SELECT * FROM "FdPromoConfig"');
  console.log("\nCurrent promo:", promo.rows[0]);

  await client.end();
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
