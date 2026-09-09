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
  const res = await client.query(
    `SELECT id, username, email, "firstName", "lastName", phone, "referralCode", status, "commissionRatePercent", "approvedAt"
     FROM "BrandAmbassador"
     WHERE email ILIKE '%henry.james%' OR ("firstName" ILIKE '%michael%' AND "lastName" ILIKE '%baes%')
        OR username ILIKE '%michael%'
     ORDER BY "createdAt" DESC`
  );
  console.log(JSON.stringify(res.rows, null, 2));
  await client.end();
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
