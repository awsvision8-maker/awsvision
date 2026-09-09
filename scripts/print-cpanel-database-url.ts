import { readFileSync } from "fs";
import { join } from "path";

const password = readFileSync(join(process.cwd(), ".cpanel-db-pass.txt"), "utf8").trim();
const host = process.env.CPANEL_PG_HOST || "bore.pub";
const port = process.env.CPANEL_PG_PORT || "35542";

const databaseUrl = `postgresql://awsvision_webappuser:${password}@${host}:${port}/awsvision_webapp?sslmode=disable`;

console.log("Use this DATABASE_URL on Vercel (Production + Preview):");
console.log(databaseUrl);
console.log("");
console.log("Also set CRON_SECRET (same as existing cron routes).");
console.log("Tunnel keepalive: https://web.awsvision.com/bore-keepalive.php?token=awsv-bore-20260831");
