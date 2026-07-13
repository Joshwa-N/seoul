// ─── API Client ───────────────────────────────────────────────────────────────
// Central HTTP client for all backend communication.
// Replaces localStorage-based store.ts for production use.

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001') + '/api';

// ─── Token management ─────────────────────────────────────────────────────────
export function getToken(): string | null {
  return sessionStorage.getItem('ss_admin_token');
}

export function setToken(token: string) {
  sessionStorage.setItem('ss_admin_token', token);
}

export function clearToken() {
  sessionStorage.removeItem('ss_admin_token');
  sessionStorage.removeItem('ss_admin_session');
}

// ─── Base fetch wrapper ───────────────────────────────────────────────────────
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  authenticated = false
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (authenticated) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(body.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// ─── Types (mirroring backend shapes) ────────────────────────────────────────
export interface ApiProduct {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  image: string;
  hoverImage?: string;
  rating: number;
  reviewCount: number;
  description: string;
  features: string[];
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  variants?: { id: string; name: string; options: string[] }[];
  // Inventory
  stock?: number;
  lowStockThreshold?: number;
  // Admin fields
  sku?: string;
  cost?: number;
  status?: 'active' | 'draft' | 'archived';
  salesCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  items: {
    productId: number;
    productName: string;
    image: string;
    quantity: number;
    price: number;
    selectedVariant?: Record<string, string>;
  }[];
  subtotal: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  trackingNumber?: string;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  lowStockProducts: { id: number; name: string; sku?: string; stock: number; threshold: number }[];
  recentOrders: ApiOrder[];
  topProducts: { id: number; name: string; image: string; price: number; salesCount: number; stock: number }[];
}

// ─── Products API ─────────────────────────────────────────────────────────────
export const productsApi = {
  getAll: (params?: { category?: string; status?: string; search?: string }) => {
    const qs = new URLSearchParams(params as Record<string, string> || {}).toString();
    return apiFetch<{ products: ApiProduct[] }>(`/products${qs ? `?${qs}` : ''}`);
  },

  getById: (id: number) =>
    apiFetch<{ product: ApiProduct }>(`/products/${id}`),

  create: (data: Partial<ApiProduct>) =>
    apiFetch<{ product: ApiProduct }>('/products', {
      method: 'POST', body: JSON.stringify(data),
    }, true),

  update: (id: number, data: Partial<ApiProduct>) =>
    apiFetch<{ product: ApiProduct }>(`/products/${id}`, {
      method: 'PUT', body: JSON.stringify(data),
    }, true),

  updateStock: (id: number, stock: number, lowStockThreshold?: number) =>
    apiFetch<{ success: boolean; stock: number }>(`/products/${id}/stock`, {
      method: 'PATCH', body: JSON.stringify({ stock, lowStockThreshold }),
    }, true),

  delete: (id: number) =>
    apiFetch<{ success: boolean }>(`/products/${id}`, { method: 'DELETE' }, true),
};

// ─── Orders API ───────────────────────────────────────────────────────────────
export const ordersApi = {
  getAll: (params?: { status?: string }) => {
    const qs = new URLSearchParams(params as Record<string, string> || {}).toString();
    return apiFetch<{ orders: ApiOrder[] }>(`/orders${qs ? `?${qs}` : ''}`, {}, true);
  },

  getById: (id: number) =>
    apiFetch<{ order: ApiOrder }>(`/orders/${id}`, {}, true),

  create: (data: {
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    shippingAddress: ApiOrder['shippingAddress'];
    items: ApiOrder['items'];
    subtotal: number;
    shipping: number;
    total: number;
  }) =>
    apiFetch<{ order: ApiOrder }>('/orders', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: number, data: { status?: string; trackingNumber?: string; adminNote?: string; paymentStatus?: string }) =>
    apiFetch<{ order: ApiOrder }>(`/orders/${id}`, {
      method: 'PATCH', body: JSON.stringify(data),
    }, true),
};

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authApi = {
  login: async (email: string, password: string) => {
    const data = await apiFetch<{ token: string; user: { id: number; email: string; name: string; role: string } }>(
      '/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }
    );
    setToken(data.token);
    sessionStorage.setItem('ss_admin_session', JSON.stringify({ id: data.user.id, name: data.user.name, role: data.user.role }));
    return data;
  },

  logout: () => {
    clearToken();
  },

  getSession: () => {
    const raw = sessionStorage.getItem('ss_admin_session');
    return raw ? JSON.parse(raw) as { id: string; name: string; role: string } : null;
  },
};

// ─── Analytics API ────────────────────────────────────────────────────────────
export const analyticsApi = {
  getDashboard: () =>
    apiFetch<DashboardStats>('/analytics/dashboard', {}, true),

  getInventory: () =>
    apiFetch<{ inventory: { id: number; name: string; sku?: string; category: string; status: string; price: number; stock: number; threshold: number }[] }>(
      '/analytics/inventory', {}, true
    ),
};

// ─── Categories API ───────────────────────────────────────────────────────────
export const categoriesApi = {
  getAll: () =>
    apiFetch<{ categories: { id: string; name: string; description: string; image: string; color: string; productCount: number }[] }>(
      '/categories'
    ),
};