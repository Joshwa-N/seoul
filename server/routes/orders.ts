import { Router, Request, Response } from 'express';
import { query, pool } from '../db';
import { requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

function rowToOrder(row: Record<string, unknown>, items: Record<string, unknown>[]) {
  return {
    id: row.id,
    orderNumber: row.order_number,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    shippingAddress: row.shipping_address,
    subtotal: parseFloat(row.subtotal as string),
    shipping: parseFloat(row.shipping_cost as string),
    total: parseFloat(row.total as string),
    status: row.status,
    paymentStatus: row.payment_status,
    trackingNumber: row.tracking_number,
    adminNote: row.admin_note,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    items: items.map(i => ({
      productId: i.product_id,
      productName: i.product_name,
      image: i.product_image,
      quantity: i.quantity,
      price: parseFloat(i.price as string),
      selectedVariant: i.selected_variant || {},
    })),
  };
}

// ─── GET /api/orders (Admin) ──────────────────────────────────────────────────
router.get('/', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    let sql = `SELECT * FROM orders WHERE 1=1`;
    const params: unknown[] = [];
    let idx = 1;

    if (status) {
      sql += ` AND status = $${idx++}`;
      params.push(status);
    }
    sql += ` ORDER BY created_at DESC LIMIT $${idx++} OFFSET $${idx++}`;
    params.push(limit, offset);

    const ordersResult = await query(sql, params);

    // Fetch items for all orders in one query
    if (ordersResult.rows.length === 0) {
      res.json({ orders: [] });
      return;
    }

    const orderIds = ordersResult.rows.map(o => o.id);
    const itemsResult = await query(`
      SELECT * FROM order_items WHERE order_id = ANY($1)
    `, [orderIds]);

    const itemsByOrder: Record<number, Record<string, unknown>[]> = {};
    for (const item of itemsResult.rows) {
      if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = [];
      itemsByOrder[item.order_id].push(item);
    }

    const orders = ordersResult.rows.map(o => rowToOrder(o, itemsByOrder[o.id] || []));
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// ─── GET /api/orders/:id (Admin) ─────────────────────────────────────────────
router.get('/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const orderResult = await query(`SELECT * FROM orders WHERE id = $1`, [req.params.id]);
    if (orderResult.rows.length === 0) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }
    const itemsResult = await query(`SELECT * FROM order_items WHERE order_id = $1`, [req.params.id]);
    res.json({ order: rowToOrder(orderResult.rows[0], itemsResult.rows) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// ─── POST /api/orders (Public - checkout) ────────────────────────────────────
router.post('/', async (req: Request, res: Response) => {
  const { customerName, customerEmail, customerPhone, shippingAddress, items, subtotal, shipping, total } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: 'Order must contain items' });
    return;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // ── 1. Validate & reserve stock ──────────────────────────────────────────
    for (const item of items) {
      const inv = await client.query(`
        SELECT stock_quantity FROM inventory WHERE product_id = $1 FOR UPDATE
      `, [item.productId]);

      if (inv.rows.length === 0) {
        throw new Error(`Product ${item.productId} not found in inventory`);
      }

      const available = inv.rows[0].stock_quantity;
      if (available < item.quantity) {
        throw new Error(`Insufficient stock for product ${item.productName}. Available: ${available}, requested: ${item.quantity}`);
      }
    }

    // ── 2. Generate order number ──────────────────────────────────────────────
    const countResult = await client.query(`SELECT COUNT(*) FROM orders`);
    const orderNumber = `SS-${10001 + parseInt(countResult.rows[0].count)}`;

    // ── 3. Insert order ───────────────────────────────────────────────────────
    const orderResult = await client.query(`
      INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, shipping_address, subtotal, shipping_cost, total, status, payment_status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'pending','paid')
      RETURNING *
    `, [orderNumber, customerName, customerEmail, customerPhone || '', JSON.stringify(shippingAddress), subtotal, shipping || 0, total]);

    const orderId = orderResult.rows[0].id;

    // ── 4. Insert items & deduct stock ────────────────────────────────────────
    for (const item of items) {
      await client.query(`
        INSERT INTO order_items (order_id, product_id, product_name, product_image, quantity, price, selected_variant)
        VALUES ($1,$2,$3,$4,$5,$6,$7)
      `, [orderId, item.productId, item.productName, item.image || '', item.quantity, item.price, JSON.stringify(item.selectedVariant || {})]);

      // Deduct stock
      await client.query(`
        UPDATE inventory
        SET stock_quantity = stock_quantity - $1, updated_at = NOW()
        WHERE product_id = $2
      `, [item.quantity, item.productId]);

      // Update in_stock flag and salesCount
      await client.query(`
        UPDATE products
        SET in_stock = (SELECT stock_quantity > 0 FROM inventory WHERE product_id = $1),
            sales_count = sales_count + $2,
            updated_at = NOW()
        WHERE id = $1
      `, [item.productId, item.quantity]);
    }

    await client.query('COMMIT');

    // Return full order
    const itemsResult = await query(`SELECT * FROM order_items WHERE order_id = $1`, [orderId]);
    res.status(201).json({ order: rowToOrder(orderResult.rows[0], itemsResult.rows) });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    const message = err instanceof Error ? err.message : 'Failed to create order';
    res.status(400).json({ error: message });
  } finally {
    client.release();
  }
});

// ─── PATCH /api/orders/:id (Admin) ───────────────────────────────────────────
router.patch('/:id', requireAdmin, async (req: AuthRequest, res: Response) => {
  const { status, trackingNumber, adminNote, paymentStatus } = req.body;
  try {
    await query(`
      UPDATE orders SET
        status = COALESCE($1, status),
        tracking_number = COALESCE($2, tracking_number),
        admin_note = COALESCE($3, admin_note),
        payment_status = COALESCE($4, payment_status),
        updated_at = NOW()
      WHERE id = $5
    `, [status || null, trackingNumber || null, adminNote || null, paymentStatus || null, req.params.id]);

    const orderResult = await query(`SELECT * FROM orders WHERE id = $1`, [req.params.id]);
    const itemsResult = await query(`SELECT * FROM order_items WHERE order_id = $1`, [req.params.id]);
    res.json({ order: rowToOrder(orderResult.rows[0], itemsResult.rows) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

export default router;