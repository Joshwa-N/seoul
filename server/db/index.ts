import { Pool, type PoolConfig } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Load server/.env by absolute path (local dev). On a host, real env vars are used.
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  const required = ['DB_USERNAME', 'DB_DATABASE'] as const;
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required env var(s): ${missing.join(', ')}. ` +
      `Set DATABASE_URL, or DB_USERNAME/DB_DATABASE (see server/.env.example).`
    );
  }
}

// Hosted Postgres needs SSL. Local Postgres doesn't.
// DB_SSL=true/false overrides; a DATABASE_URL turns SSL on by default.
const useSsl = process.env.DB_SSL
  ? process.env.DB_SSL === 'true'
  : Boolean(databaseUrl);
const ssl = useSsl ? { rejectUnauthorized: false } : false;

console.log('DB config:', databaseUrl
  ? { mode: 'DATABASE_URL', ssl: useSsl }
  : { mode: 'discrete', host: process.env.DB_HOST || 'localhost', database: process.env.DB_DATABASE, ssl: useSsl });

const config: PoolConfig = databaseUrl
  ? { connectionString: databaseUrl, ssl }
  : {
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD || undefined,
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_DATABASE,
      port: parseInt(process.env.DB_PORT || '5432'),
      ssl,
    };

export const pool = new Pool(config);

export async function query(text: string, params?: unknown[]) {
  return pool.query(text, params);
}
