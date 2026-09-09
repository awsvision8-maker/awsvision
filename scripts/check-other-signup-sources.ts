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

  const waitlist = await client.query(
    'SELECT email, "createdAt" FROM "WaitlistEntry" ORDER BY "createdAt" DESC LIMIT 10'
  );
  console.log("=== Waitlist (latest) ===");
  for (const w of waitlist.rows) {
    console.log(`${w.createdAt.toISOString()} | ${w.email}`);
  }

  const contact = await client.query(
    'SELECT email, name, subject, "createdAt" FROM "ContactMessage" ORDER BY "createdAt" DESC LIMIT 10'
  );
  console.log("\n=== Contact messages (latest) ===");
  for (const c of contact.rows) {
    console.log(`${c.createdAt.toISOString()} | ${c.email} | ${c.subject ?? "-"}`);
  }

  const clientLogs = await client.query(
    `SELECT email, status, "errorMessage", "errorCode", source, "createdAt"
     FROM "SignupAttemptLog"
     WHERE source = 'client' OR "errorCode" = 'client_validation'
     ORDER BY "createdAt" DESC LIMIT 20`
  );
  console.log("\n=== Client-side signup failures ===");
  for (const l of clientLogs.rows) {
    console.log(`${l.createdAt.toISOString()} | ${l.email ?? "-"} | ${l.errorCode} | ${l.errorMessage}`);
  }

  await client.end();
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
