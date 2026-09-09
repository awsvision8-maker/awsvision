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
    `DELETE FROM "User" WHERE email LIKE '%@awsvision-test.invalid' RETURNING email`
  );
  console.log("Deleted:", res.rows.map((r) => r.email));
  const count = await client.query('SELECT COUNT(*)::int AS c FROM "User"');
  console.log("Total users:", count.rows[0].c);
  await client.end();
}

main();
