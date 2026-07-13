import { useState, useEffect, useCallback } from 'react';
import { productsApi, type ApiProduct } from '@/lib/api';

// ─── useProducts ──────────────────────────────────────────────────────────────
// Fetches a list of products from the backend.
// category: filter by category string (optional)
// adminMode: include all statuses, requires auth token
export function useProducts(options?: { category?: string; status?: string; search?: string }) {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { products } = await productsApi.getAll(options);
      setProducts(products);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [options?.category, options?.status, options?.search]);

  useEffect(() => { fetch(); }, [fetch]);

  return { products, loading, error, refetch: fetch };
}

// ─── useProduct ───────────────────────────────────────────────────────────────
export function useProduct(id: number | string | undefined) {
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    productsApi.getById(Number(id))
      .then(({ product }) => setProduct(product))
      .catch(err => setError(err.message || 'Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  return { product, loading, error };
}

// ─── Stock helpers ────────────────────────────────────────────────────────────

/**
 * Returns a stock status label for display in the UI.
 * - stock > threshold (default 10) → null (no label needed)
 * - stock 1–threshold → "Only X left in stock"
 * - stock === 0 → "Out of stock"
 */
export function getStockLabel(stock: number | undefined, threshold = 10): string | null {
  if (stock === undefined) return null;
  if (stock === 0) return 'Out of stock';
  if (stock <= threshold) return `Only ${stock} left in stock`;
  return null;
}

/**
 * Returns the maximum quantity a user can add to cart.
 * Respects available stock.
 */
export function getMaxCartQty(stock: number | undefined): number {
  if (stock === undefined) return 99;
  return Math.max(0, stock);
}