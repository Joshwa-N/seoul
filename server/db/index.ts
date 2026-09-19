import { Pool } from 'pg';
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
});

export async function query(text: string, params?: unknown[]) {
  return pool.query(text, params);
}
