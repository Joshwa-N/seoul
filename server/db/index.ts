import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load .env using absolute path — works regardless of __dirname
dotenv.config({ path: '/Users/joshwa/Downloads/ecommerce/.env' });

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
