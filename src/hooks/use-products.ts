import { useState, useEffect } from 'react';
import { productsApi, type ApiProduct } from '@/lib/api';

export function useProducts(category?: string) {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    productsApi.getAll(category ? { category } : undefined)
      .then(({ products }) => setProducts(products))
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load products'))
      .finally(() => setLoading(false));
  }, [category]);

  return { products, loading, error };
}

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

export function getStockLabel(stock: number | undefined, threshold = 10): string | null {
  if (stock === undefined) return null;
  if (stock === 0) return 'Out of stock';
  if (stock <= threshold) return `Only ${stock} left in stock`;
  return null;
}

export function getMaxCartQty(stock: number | undefined): number {
  if (stock === undefined) return 99;
  return Math.max(0, stock);
}
