import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { query } from '../db/index';
import { signToken, requireAdmin, requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// ─── Admin Login ───────────────────────────────────────────────────────────
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) { res.status(400).json({ error: 'Email and password required' }); return; }
  try {
    const result = await query(`SELECT * FROM users WHERE email = $1`, [email]);
    if (result.rows.length === 0) { res.status(401).json({ error: 'Invalid credentials' }); return; }
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) { res.status(401).json({ error: 'Invalid credentials' }); return; }
    if (user.role !== 'admin' && user.role !== 'manager') { res.status(403).json({ error: 'Admin access required' }); return; }
    const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Login failed' }); }
});

// ─── Customer Register ─────────────────────────────────────────────────────
router.post('/register', async (req: Request, res: Response) => {
  const { name, email, password, phone, address } = req.body;
  if (!name || !email || !password) { res.status(400).json({ error: 'Name, email and password are required' }); return; }
  if (password.length < 6) { res.status(400).json({ error: 'Password must be at least 6 characters' }); return; }
  try {
    const existing = await query(`SELECT id FROM users WHERE email = $1`, [email]);
    if (existing.rows.length > 0) { res.status(409).json({ error: 'Email already registered' }); return; }
    const passwordHash = await bcrypt.hash(password, 12);
    const result = await query(
      `INSERT INTO users (name, email, password_hash, phone, address, role)
       VALUES ($1, $2, $3, $4, $5, 'customer')
       RETURNING id, name, email, phone, address, role`,
      [name, email, passwordHash, phone || null, address ? JSON.stringify(address) : '{}']
    );
    const user = result.rows[0];
    const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });
    res.status(201).json({ token, user });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Registration failed' }); }
});

// ─── Customer Login ────────────────────────────────────────────────────────
router.post('/customer-login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) { res.status(400).json({ error: 'Email and password required' }); return; }
  try {
    const result = await query(`SELECT * FROM users WHERE email = $1`, [email]);
    if (result.rows.length === 0) { res.status(401).json({ error: 'Invalid credentials' }); return; }
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) { res.status(401).json({ error: 'Invalid credentials' }); return; }
    const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, address: user.address, role: user.role }
    });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Login failed' }); }
});

// ─── Get Current User ──────────────────────────────────────────────────────
router.get('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(
      `SELECT id, name, email, phone, address, role, created_at FROM users WHERE id = $1`,
      [req.user!.id]
    );
    if (result.rows.length === 0) { res.status(404).json({ error: 'User not found' }); return; }
    res.json({ user: result.rows[0] });
  } catch (err) { res.status(500).json({ error: 'Failed to fetch user' }); }
});

// ─── Update Profile ────────────────────────────────────────────────────────
router.put('/profile', requireAuth, async (req: AuthRequest, res: Response) => {
  const { name, phone, address } = req.body;
  try {
    const result = await query(
      `UPDATE users SET name=$1, phone=$2, address=$3, updated_at=NOW()
       WHERE id=$4 RETURNING id, name, email, phone, address, role`,
      [name, phone || null, address ? JSON.stringify(address) : '{}', req.user!.id]
    );
    res.json({ user: result.rows[0] });
  } catch (err) { res.status(500).json({ error: 'Profile update failed' }); }
});

// ─── Forgot Password ───────────────────────────────────────────────────────
router.post('/forgot-password', async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) { res.status(400).json({ error: 'Email required' }); return; }
  try {
    const result = await query(`SELECT id FROM users WHERE email = $1`, [email]);
    if (result.rows.length === 0) {
      res.json({ message: 'If that email exists, a reset link has been sent.' }); return;
    }
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
    await query(
      `UPDATE users SET reset_token=$1, reset_token_expires=$2 WHERE email=$3`,
      [token, expires, email]
    );
    // TODO: send real email in production. Dev: token logged to console.
    console.log(`\n🔑 Password reset token for ${email}: ${token}\n`);
    res.json({ message: 'If that email exists, a reset link has been sent.', _devToken: token });
  } catch (err) { res.status(500).json({ error: 'Request failed' }); }
});

// ─── Reset Password ────────────────────────────────────────────────────────
router.post('/reset-password', async (req: Request, res: Response) => {
  const { token, password } = req.body;
  if (!token || !password) { res.status(400).json({ error: 'Token and password required' }); return; }
  if (password.length < 6) { res.status(400).json({ error: 'Password must be at least 6 characters' }); return; }
  try {
    const result = await query(
      `SELECT id FROM users WHERE reset_token=$1 AND reset_token_expires > NOW()`,
      [token]
    );
    if (result.rows.length === 0) { res.status(400).json({ error: 'Invalid or expired reset token' }); return; }
    const passwordHash = await bcrypt.hash(password, 12);
    await query(
      `UPDATE users SET password_hash=$1, reset_token=NULL, reset_token_expires=NULL, updated_at=NOW() WHERE id=$2`,
      [passwordHash, result.rows[0].id]
    );
    res.json({ message: 'Password reset successful' });
  } catch (err) { res.status(500).json({ error: 'Reset failed' }); }
});

export default router;