import { Client } from "pg";
import { readFileSync } from "fs";
import { join } from "path";

const password = readFileSync(join(process.cwd(), ".cpanel-db-pass.txt"), "utf8").trim();
const hosts = [
  "192.250.227.149",
  "s3473.usc1.stableserver.net",
];

async function main() {
  for (const host of hosts) {
    const client = new Client({
      host,
      port: 5432,
      user: "awsvision_webappuser",
      password,
      database: "awsvision_webapp",
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 8000,
    });
    try {
      await client.connect();
      const result = await client.query('SELECT COUNT(*)::int AS users FROM "User"');
      console.log(`OK ${host} users=${result.rows[0].users}`);
      await client.end();
      process.exit(0);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(`FAIL ${host}: ${message}`);
    }
  }
  process.exit(1);
}

main();
