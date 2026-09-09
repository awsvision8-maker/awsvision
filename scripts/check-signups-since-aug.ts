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
  connectionTimeoutMillis: 20000,
});

async function main() {
  await client.connect();
  const logs = await client.query(
    `SELECT email, status, "errorMessage", "errorCode", "createdAt", "ipAddress"
     FROM "SignupAttemptLog"
     WHERE "createdAt" >= '2026-08-01'
     ORDER BY "createdAt" DESC`
  );
  console.log(`Signup logs since Aug 1: ${logs.rows.length}`);
  for (const l of logs.rows) {
    console.log(
      `${l.createdAt.toISOString()} | ${l.status} | ${l.errorCode ?? "-"} | ${l.email ?? "-"} | ${l.errorMessage ?? "ok"} | ip=${l.ipAddress ?? "-"}`
    );
  }
  await client.end();
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
