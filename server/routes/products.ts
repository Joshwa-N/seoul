import { Router, Request, Response } from 'express';
import { query } from '../db';
import { requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

// Helper: transform DB row → frontend shape
function rowToProduct(row: Record<string, unknown>) {
  return {
    id: row.id,
    name: row.name,
    price: parseFloat(row.price as string),
    originalPrice: row.original_price ? parseFloat(row.original_price as string) : undefined,
    category: row.category,
    subcategory: row.subcategory,
    image: row.image,
    hoverImage: row.hover_image,
    rating: parseFloat(row.rating as string),
    reviewCount: row.review_count,
    description: row.description,
    features: row.features || [],
    inStock: row.in_stock,
    isNew: row.is_new,
    isBestseller: row.is_bestseller,
    variants: row.variants || [],
    // Admin / inventory fields
    stock: row.stock_quantity !== undefined ? parseInt(row.stock_quantity as string) : undefined,
    lowStockThreshold: row.low_stock_threshold !== undefined ? parseInt(row.low_stock_threshold as string) : undefined,
    sku: row.sku,
    cost: row.cost ? parseFloat(row.cost as string) : undefined,
    status: row.status,
    salesCount: row.sales_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ─── GET /api/products ────────────────────────────────────────────────────────
// Public: fetch all active products with stock info
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, status, search, limit, offset } = req.query;

    let sql = `
      SELECT p.*, i.stock_quantity, i.low_stock_threshold
      FROM products p
      LEFT JOIN inventory i ON i.product_id = p.id
      WHERE 1=1
    `;
    const params: unknown[] = [];
    let idx = 1;

    // Public route only shows active products unless status specified (admin only)
    if (status) {
      sql += ` AND p.status = $${idx++}`;
      params.push(status);
    } else {
      sql += ` AND p.status = 'active'`;
    }

    if (category) {
      sql += ` AND LOWER(p.category) = LOWER($${idx++})`;
      params.push(category);
    }

    if (search) {
      sql += ` AND (LOWER(p.name) LIKE LOWER($${idx++}) OR LOWER(p.sku) LIKE LOWER($${idx++}))`;
      params.push(`%${search}%`, `%${search}%`);
      idx++;
    }

    sql += ` ORDER BY p.id ASC`;

    if (limit) {
      sql += ` LIMIT $${idx++}`;
      params.push(parseInt(limit as string));
    }
    if (offset) {
      sql += ` OFFSET $${idx++}`;
      params.push(parseInt(offset as string));
    }

    const result = await query(sql, params);
    res.json({ products: result.rows.map(rowToProduct) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// ─── GET /api/products/:id ────────────────────────────────────────────────────
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const result = await query(`
      SELECT p.*, i.stock_quantity, i.low_stock_threshold
      FROM products p
      LEFT JOIN inventory i ON i.product_id = p.id
      WHERE p.id = $1
    `, [req.params.id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json({ product: rowToProduct(result.rows[0]) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// ─── POST /api/products  (Admin) ──────────────────────────────────────────────
router.post('/', requireAdmin, async (req: AuthRequest, res: Response) => {
  const {
    name, price, originalPrice, category, subcategory, image, hoverImage,
    rating, reviewCount, description, features, inStock, isNew, isBestseller,
    variants, sku, cost, status, stock, lowStockThreshold
  } = req.body;

  try {
    const result = await query(`
      INSERT INTO products (
        name, price, original_price, category, subcategory, image, hover_image,
        rating, review_count, description, features, in_stock, is_new, is_bestseller,
        variants, sku, cost, status, sales_count
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,0)
      RETURNING *
    `, [
      name, price, originalPrice || null, category, subcategory || null,
      image || null, hoverImage || null, rating || 0, reviewCount || 0,
      description, JSON.stringify(features || []), inStock !== false,
      isNew || false, isBestseller || false, JSON.stringify(variants || []),
      sku, cost || null, status || 'active'
    ]);

    const productId = result.rows[0].id;

    // Insert inventory record
    await query(`
      INSERT INTO inventory (product_id, stock_quantity, low_stock_threshold)
      VALUES ($1, $2, $3)
    `, [productId, stock || 0, lowStockThreshold || 10]);

    const fullResult = await query(`
      SELECT p.*, i.stock_quantity, i.low_stock_threshold
      FROM products p
      LEFT JOIN inventory i ON i.product_id = p.id
      WHERE p.id = $1
    `, [productId]);

    res.status(201).json({ product: rowToProduct(fullResult.rows[0]) });
  } catch (err: unknown) {
    console.error(err);
    if ((err as NodeJS.ErrnoException & { code?: string }).code === '23505') {
      res.status(409).json({ error: 'SKU already exists' });
      return;
    }
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// ─── PUT /api/products/:id  (Admin) ──────────────────────────────────────────
router.put('/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  const {
    name, price, originalPrice, category, subcategory, image, hoverImage,
    rating, reviewCount, description, features, inStock, isNew, isBestseller,
    variants, sku, cost, status, stock, lowStockThreshold
  } = req.body;

  try {
    await query(`
      UPDATE products SET
        name=$1, price=$2, original_price=$3, category=$4, subcategory=$5,
        image=$6, hover_image=$7, rating=$8, review_count=$9, description=$10,
        features=$11, in_stock=$12, is_new=$13, is_bestseller=$14, variants=$15,
        sku=$16, cost=$17, status=$18, updated_at=NOW()
      WHERE id=$19
    `, [
      name, price, originalPrice || null, category, subcategory || null,
      image || null, hoverImage || null, rating || 0, reviewCount || 0,
      description, JSON.stringify(features || []), inStock !== false,
      isNew || false, isBestseller || false, JSON.stringify(variants || []),
      sku, cost || null, status || 'active', req.params.id
    ]);

    // Update inventory
    if (stock !== undefined) {
      await query(`
        INSERT INTO inventory (product_id, stock_quantity, low_stock_threshold)
        VALUES ($1, $2, $3)
        ON CONFLICT (product_id) DO UPDATE
        SET stock_quantity = $2, low_stock_threshold = $3, updated_at = NOW()
      `, [req.params.id, stock, lowStockThreshold || 10]);
    }

    const result = await query(`
      SELECT p.*, i.stock_quantity, i.low_stock_threshold
      FROM products p
      LEFT JOIN inventory i ON i.product_id = p.id
      WHERE p.id = $1
    `, [req.params.id]);

    res.json({ product: rowToProduct(result.rows[0]) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// ─── PATCH /api/products/:id/stock  (Admin) ───────────────────────────────────
router.patch('/:id/stock', requireAdmin, async (req: AuthRequest, res: Response) => {
  const { stock, lowStockThreshold } = req.body;
  try {
    await query(`
      INSERT INTO inventory (product_id, stock_quantity, low_stock_threshold)
      VALUES ($1, $2, $3)
      ON CONFLICT (product_id) DO UPDATE
      SET stock_quantity = $2, low_stock_threshold = COALESCE($3, inventory.low_stock_threshold), updated_at = NOW()
    `, [req.params.id, stock, lowStockThreshold || null]);

    // Update in_stock flag on product
    await query(`
      UPDATE products SET in_stock = ($1 > 0), updated_at = NOW() WHERE id = $2
    `, [stock, req.params.id]);

    res.json({ success: true, stock });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update stock' });
  }
});

// ─── DELETE /api/products/:id  (Admin) ───────────────────────────────────────
router.delete('/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    await query(`DELETE FROM products WHERE id = $1`, [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;