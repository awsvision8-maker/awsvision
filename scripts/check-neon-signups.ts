import { Client } from "pg";

const neonUrl = process.env.NEON_URL;
if (!neonUrl) {
  console.log("No NEON_URL");
  process.exit(0);
}

const client = new Client({ connectionString: neonUrl, ssl: { rejectUnauthorized: false } });

async function main() {
  await client.connect();
  const count = await client.query('SELECT COUNT(*)::int AS c FROM "User"');
  console.log("Neon total users:", count.rows[0].c);
  const users = await client.query(
    'SELECT email, "createdAt" FROM "User" ORDER BY "createdAt" DESC LIMIT 10'
  );
  console.log("=== Neon latest users ===");
  for (const u of users.rows) {
    console.log(`${u.createdAt.toISOString()} | ${u.email}`);
  }
  const logs = await client.query(
    'SELECT email, status, "createdAt" FROM "SignupAttemptLog" ORDER BY "createdAt" DESC LIMIT 10'
  );
  console.log("\n=== Neon latest signup logs ===");
  for (const l of logs.rows) {
    console.log(`${l.createdAt.toISOString()} | ${l.status} | ${l.email ?? "-"}`);
  }
  await client.end();
}

main().catch((e) => {
  console.error("Neon:", e.message);
  process.exit(1);
});
