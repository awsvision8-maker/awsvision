const { Client } = require("pg");
const fs = require("fs");

const password = fs.readFileSync(".cpanel-db-pass.txt", "utf8").trim();
const host = process.argv[2] || "bore.pub";
const port = Number(process.argv[3] || "5432");

const client = new Client({
  host,
  port,
  user: "awsvision_webappuser",
  password,
  database: "awsvision_webapp",
  ssl: false,
  connectionTimeoutMillis: 25000,
});

client
  .connect()
  .then(() => client.query('SELECT COUNT(*)::int AS users FROM "User"'))
  .then((result) => {
    console.log("CONNECTED to", host);
    console.log("Users:", result.rows[0].users);
    return client.end();
  })
  .catch((error) => {
    console.error("FAIL:", error.message);
    process.exit(1);
  });
