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
  const users = await client.query(
    'SELECT email, "firstName", "lastName", "createdAt" FROM "User" ORDER BY "createdAt" DESC LIMIT 10'
  );
  console.log("=== Latest Users ===");
  for (const u of users.rows) {
    console.log(`${u.createdAt.toISOString()} | ${u.email} | ${u.firstName} ${u.lastName}`);
  }
  const count = await client.query('SELECT COUNT(*)::int AS c FROM "User"');
  console.log("\nTotal users:", count.rows[0].c);

  const logs = await client.query(
    'SELECT email, status, "errorMessage", "createdAt" FROM "SignupAttemptLog" ORDER BY "createdAt" DESC LIMIT 15'
  );
  console.log("\n=== Latest Signup Logs ===");
  for (const l of logs.rows) {
    console.log(`${l.createdAt.toISOString()} | ${l.status} | ${l.email ?? "-"} | ${l.errorMessage ?? "ok"}`);
  }
  await client.end();
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
