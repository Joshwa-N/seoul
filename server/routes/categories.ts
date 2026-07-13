import { Router, Request, Response } from 'express';
import { query } from '../db/index';
import { requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await query(`SELECT c.*, (SELECT COUNT(*) FROM products p WHERE LOWER(p.category) = LOWER(c.slug) AND p.status = 'active') as product_count FROM categories c ORDER BY c.name`);
    res.json({ categories: result.rows.map((r: Record<string, unknown>) => ({ id: r.slug, name: r.name, description: r.description, image: r.image, color: r.color, productCount: parseInt(r.product_count as string) })) });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to fetch categories' }); }
});

router.post('/', requireAdmin, async (req: AuthRequest, res: Response) => {
  const { slug, name, description, image, color } = req.body;
  try {
    await query(`INSERT INTO categories (slug, name, description, image, color) VALUES ($1,$2,$3,$4,$5) ON CONFLICT (slug) DO UPDATE SET name=$2, description=$3, image=$4, color=$5`, [slug, name, description, image, color]);
    res.status(201).json({ success: true });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to create category' }); }
});

export default router;
