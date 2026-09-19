import { pool, query } from './index';

async function migrate() {
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50)`);
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS address JSONB DEFAULT '{}'::jsonb`);
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token VARCHAR(255)`);
  await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_expires TIMESTAMPTZ`);
  await query(`CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_idx ON users (LOWER(email))`);
  const cols = await query(
    `SELECT column_name, data_type FROM information_schema.columns WHERE table_name='users' ORDER BY ordinal_position`
  );
  console.log('users columns:', cols.rows.map((c: any) => c.column_name).join(', '));
  await pool.end();
}

migrate().catch((e) => { console.error('Migration failed:', e); process.exit(1); });
