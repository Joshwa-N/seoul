import { Router, Response } from 'express';
import { query } from '../db/index';
import { requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/dashboard', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const [rev, ord, pend, prods, lowStock, recentOrders, topProds] = await Promise.all([
      query(`SELECT COALESCE(SUM(total), 0) AS total_revenue FROM orders WHERE payment_status = 'paid'`),
      query(`SELECT COUNT(*) AS total_orders FROM orders`),
      query(`SELECT COUNT(*) AS pending_orders FROM orders WHERE status = 'pending'`),
      query(`SELECT COUNT(*) AS total_products FROM products WHERE status = 'active'`),
      query(`SELECT p.id, p.name, p.sku, p.status, i.stock_quantity, i.low_stock_threshold FROM products p JOIN inventory i ON i.product_id = p.id WHERE i.stock_quantity <= i.low_stock_threshold AND p.status = 'active' ORDER BY i.stock_quantity ASC LIMIT 10`),
      query(`SELECT o.*, (SELECT json_agg(oi.*) FROM order_items oi WHERE oi.order_id = o.id) AS items FROM orders o ORDER BY o.created_at DESC LIMIT 5`),
      query(`SELECT p.id, p.name, p.image, p.price, p.sales_count, i.stock_quantity FROM products p LEFT JOIN inventory i ON i.product_id = p.id WHERE p.status = 'active' ORDER BY p.sales_count DESC LIMIT 5`),
    ]);

    res.json({
      totalRevenue: parseFloat(rev.rows[0].total_revenue),
      totalOrders: parseInt(ord.rows[0].total_orders),
      pendingOrders: parseInt(pend.rows[0].pending_orders),
      totalProducts: parseInt(prods.rows[0].total_products),
      lowStockProducts: lowStock.rows.map((r: Record<string, unknown>) => ({ id: r.id, name: r.name, sku: r.sku, status: r.status, stock: parseInt(r.stock_quantity as string), threshold: parseInt(r.low_stock_threshold as string) })),
      recentOrders: recentOrders.rows.map((o: Record<string, unknown>) => ({ id: o.id, orderNumber: o.order_number, customerName: o.customer_name, customerEmail: o.customer_email, total: parseFloat(o.total as string), status: o.status, paymentStatus: o.payment_status, createdAt: o.created_at, items: ((o.items as Record<string, unknown>[]) || []).map((i: Record<string, unknown>) => ({ productId: i.product_id, productName: i.product_name, quantity: i.quantity, price: parseFloat(i.price as string), image: i.product_image, selectedVariant: i.selected_variant })) })),
      topProducts: topProds.rows.map((r: Record<string, unknown>) => ({ id: r.id, name: r.name, image: r.image, price: parseFloat(r.price as string), salesCount: r.sales_count, stock: r.stock_quantity ? parseInt(r.stock_quantity as string) : 0 })),
    });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to fetch dashboard stats' }); }
});

router.get('/inventory', requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const result = await query(`SELECT p.id, p.name, p.sku, p.category, p.status, p.price, i.stock_quantity, i.low_stock_threshold, i.updated_at as inventory_updated FROM products p LEFT JOIN inventory i ON i.product_id = p.id ORDER BY i.stock_quantity ASC NULLS FIRST`);
    res.json({ inventory: result.rows.map((r: Record<string, unknown>) => ({ id: r.id, name: r.name, sku: r.sku, category: r.category, status: r.status, price: parseFloat(r.price as string), stock: r.stock_quantity ? parseInt(r.stock_quantity as string) : 0, threshold: r.low_stock_threshold ? parseInt(r.low_stock_threshold as string) : 10, inventoryUpdated: r.inventory_updated })) });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Failed to fetch inventory' }); }
});

export default router;
