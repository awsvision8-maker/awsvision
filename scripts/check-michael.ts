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
  const m = await client.query(
    `SELECT id, email, "onlineId", "firstName", "lastName" FROM "User"
     WHERE email ILIKE '%michael%' OR "firstName" ILIKE '%michael%' OR "lastName" ILIKE '%reis%'`
  );
  console.log(m.rows);
  await client.end();
}

main();
