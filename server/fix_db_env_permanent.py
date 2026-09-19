from pathlib import Path

f = Path("db/index.ts")
src = f.read_text(encoding="utf-8")

old = """import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load .env using absolute path — works regardless of __dirname
dotenv.config();

console.log('DB config:', {
  user: process.env.DB_USERNAME,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
});

export const pool = new Pool({
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD || undefined,
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: false,
});"""

new = """import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Always load server/.env by absolute path — independent of the
// directory this process happens to be started from (npm run dev,
// nodemon, ts-node, a deploy script, etc. can all have different CWDs).
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const required = ['DB_USERNAME', 'DB_DATABASE'] as const;
const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(
    `Missing required env var(s): ${missing.join(', ')}. ` +
    `Check that server/.env exists and is populated (see server/.env.example).`
  );
}

console.log('DB config:', {
  user: process.env.DB_USERNAME,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
});

export const pool = new Pool({
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD || undefined,
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT || '5432'),
  ssl: false,
});"""

count = src.count(old)
if count != 1:
    raise SystemExit(f"Anchor matched {count} times, expected 1 — db/index.ts doesn't match what I expect. Paste it back and I'll adjust.")

f.write_text(src.replace(old, new, 1), encoding="utf-8")
print("Patched db/index.ts: env path is now absolute and startup fails fast if DB vars are missing.")
