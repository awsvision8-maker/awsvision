import { Client } from "pg";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";

function loadEnvFile() {
  const envPath = join(process.cwd(), ".env");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvFile();

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is not set in .env");
  process.exit(1);
}

function sqlLiteral(value: unknown): string {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (value instanceof Date) return `'${value.toISOString().replace("T", " ").replace("Z", "+00")}'`;
  if (Buffer.isBuffer(value)) return `'\\x${value.toString("hex")}'`;
  if (typeof value === "object") {
    return `'${JSON.stringify(value).replace(/'/g, "''")}'::jsonb`;
  }
  return `'${String(value).replace(/'/g, "''")}'`;
}

async function main() {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const outDir = join(process.cwd(), "backups");
  mkdirSync(outDir, { recursive: true });

  const sqlPath = join(outDir, `neondb-full-${stamp}.sql`);
  const jsonPath = join(outDir, `neondb-full-${stamp}.json`);

  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log("Connected to Neon PostgreSQL");

  const tablesResult = await client.query<{ tablename: string }>(`
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY tablename
  `);

  const tables = tablesResult.rows.map((r) => r.tablename);
  const jsonExport: Record<string, unknown[]> = {};
  const sqlParts: string[] = [
    "-- AWS Vision Neon database full export",
    `-- Generated: ${new Date().toISOString()}`,
    "BEGIN;",
    "SET session_replication_role = replica;",
    "",
  ];

  let totalRows = 0;

  for (const table of tables) {
    const quoted = `"${table.replace(/"/g, '""')}"`;
    const data = await client.query(`SELECT * FROM ${quoted}`);
    const rows = data.rows as Record<string, unknown>[];
    jsonExport[table] = rows;
    totalRows += rows.length;

    sqlParts.push(`-- Table: ${table} (${rows.length} rows)`);
    sqlParts.push(`DELETE FROM ${quoted};`);

    if (rows.length === 0) {
      sqlParts.push("");
      continue;
    }

    const columns = Object.keys(rows[0]);
    const quotedCols = columns.map((c) => `"${c.replace(/"/g, '""')}"`).join(", ");

    for (const row of rows) {
      const values = columns.map((col) => sqlLiteral(row[col])).join(", ");
      sqlParts.push(`INSERT INTO ${quoted} (${quotedCols}) VALUES (${values});`);
    }

    sqlParts.push("");
  }

  sqlParts.push("SET session_replication_role = DEFAULT;");
  sqlParts.push("COMMIT;");

  writeFileSync(sqlPath, sqlParts.join("\n"), "utf8");
  writeFileSync(
    jsonPath,
    JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        tableCount: tables.length,
        totalRows,
        tables: jsonExport,
      },
      null,
      2,
    ),
    "utf8",
  );

  await client.end();

  console.log(`Tables: ${tables.length}`);
  console.log(`Total rows: ${totalRows}`);
  console.log(`SQL backup: ${sqlPath}`);
  console.log(`JSON backup: ${jsonPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
