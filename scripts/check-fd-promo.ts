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
  const promo = await client.query('SELECT * FROM "FdPromoConfig"');
  console.log(JSON.stringify(promo.rows[0], null, 2));
  const now = new Date();
  const endsAt = new Date(promo.rows[0].endsAt);
  console.log("\nNow:", now.toISOString());
  console.log("EndsAt:", endsAt.toISOString());
  console.log("isActive:", promo.rows[0].isActive);
  console.log("Promo open?", promo.rows[0].isActive && now <= endsAt);
  await client.end();
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
