import type { Product } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
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
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  adminNote?: string;
}

export interface StoreProduct extends Product {
  stock: number;
  status: 'active' | 'draft' | 'archived';
  sku: string;
  cost?: number;
  createdAt: string;
  updatedAt: string;
  salesCount: number;
}

export interface AdminUser {
  id: string;
  email: string;
  password: string; // In a real app, this would be hashed
  name: string;
  role: 'admin' | 'manager';
}

// ─── Keys ─────────────────────────────────────────────────────────────────────

const KEYS = {
  products: 'ss_products',
  orders: 'ss_orders',
  admin: 'ss_admin_user',
  initialized: 'ss_initialized',
};

// ─── Default data ──────────────────────────────────────────────────────────────

const defaultProducts: StoreProduct[] = [
  { id: 1, name: "Glow Essence Serum", price: 48, originalPrice: 65, category: "Beauty", subcategory: "Skincare", image: "/images/product-1.jpg", rating: 4.8, reviewCount: 124, description: "A lightweight, hydrating serum infused with Korean botanical extracts for a radiant glow. Perfect for daily use.", features: ["Hyaluronic Acid", "Niacinamide", "Vegan", "Cruelty-free"], inStock: true, isBestseller: true, variants: [{ id: "size", name: "Size", options: ["30ml", "50ml"] }], stock: 42, status: 'active', sku: 'SKU-001', cost: 18, createdAt: '2024-01-10T10:00:00Z', updatedAt: '2024-01-10T10:00:00Z', salesCount: 89 },
  { id: 2, name: "Perfect Cushion Foundation", price: 42, category: "Beauty", subcategory: "Makeup", image: "/images/product-2.jpg", rating: 4.6, reviewCount: 89, description: "Buildable coverage with a natural dewy finish. SPF 50+ protection for all-day wear.", features: ["SPF 50+", "Hydrating", "Long-lasting"], inStock: true, isNew: true, variants: [{ id: "shade", name: "Shade", options: ["Fair", "Light", "Medium", "Tan"] }], stock: 28, status: 'active', sku: 'SKU-002', cost: 14, createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z', salesCount: 56 },
  { id: 3, name: "Linen Breeze Blouse", price: 78, category: "Fashion", subcategory: "Tops", image: "/images/product-3.jpg", rating: 4.7, reviewCount: 56, description: "Breathable linen blouse with a relaxed fit. Perfect for summer days and effortless style.", features: ["100% Linen", "Breathable", "Relaxed Fit"], inStock: true, variants: [{ id: "size", name: "Size", options: ["XS", "S", "M", "L", "XL"] }], stock: 15, status: 'active', sku: 'SKU-003', cost: 28, createdAt: '2024-02-01T10:00:00Z', updatedAt: '2024-02-01T10:00:00Z', salesCount: 34 },
  { id: 4, name: "Zen Ceramic Tea Set", price: 95, category: "Home", subcategory: "Kitchen", image: "/images/product-4.jpg", rating: 4.9, reviewCount: 42, description: "Handcrafted ceramic tea set with gradient glaze. Includes teapot, cups, and serving tray.", features: ["Handcrafted", "Microwave Safe", "Dishwasher Safe"], inStock: true, isBestseller: true, stock: 8, status: 'active', sku: 'SKU-004', cost: 38, createdAt: '2024-02-05T10:00:00Z', updatedAt: '2024-02-05T10:00:00Z', salesCount: 29 },
  { id: 5, name: "Overnight Repair Mask", price: 38, category: "Beauty", subcategory: "Skincare", image: "/images/product-5.jpg", rating: 4.5, reviewCount: 203, description: "Wake up to refreshed, hydrated skin. Rich formula repairs and nourishes while you sleep.", features: ["Ceramides", "Peptides", "Fragrance-free"], inStock: true, stock: 61, status: 'active', sku: 'SKU-005', cost: 12, createdAt: '2024-02-10T10:00:00Z', updatedAt: '2024-02-10T10:00:00Z', salesCount: 118 },
  { id: 6, name: "Seoul Canvas Tote", price: 35, category: "Fashion", subcategory: "Accessories", image: "/images/product-6.jpg", rating: 4.4, reviewCount: 78, description: "Minimalist canvas tote with Korean calligraphy detail. Spacious and durable for everyday use.", features: ["100% Cotton Canvas", "Inner Pocket", "Eco-friendly"], inStock: true, isNew: true, stock: 33, status: 'active', sku: 'SKU-006', cost: 10, createdAt: '2024-02-15T10:00:00Z', updatedAt: '2024-02-15T10:00:00Z', salesCount: 47 },
  { id: 7, name: "Rice Water Essence", price: 32, category: "Beauty", subcategory: "Skincare", image: "/images/product-7.jpg", rating: 4.7, reviewCount: 156, description: "Traditional Korean beauty secret. Brightens and smooths skin texture with fermented rice water.", features: ["Fermented Rice Extract", "Brightening", "Alcohol-free"], inStock: true, stock: 50, status: 'active', sku: 'SKU-007', cost: 10, createdAt: '2024-03-01T10:00:00Z', updatedAt: '2024-03-01T10:00:00Z', salesCount: 92 },
  { id: 8, name: "Linen Wide Pants", price: 68, category: "Fashion", subcategory: "Bottoms", image: "/images/product-8.jpg", rating: 4.6, reviewCount: 92, description: "Effortlessly chic wide-leg pants in premium linen. Elastic waist for all-day comfort.", features: ["100% Linen", "Elastic Waist", "Side Pockets"], inStock: true, variants: [{ id: "size", name: "Size", options: ["XS", "S", "M", "L", "XL"] }], stock: 22, status: 'active', sku: 'SKU-008', cost: 24, createdAt: '2024-03-05T10:00:00Z', updatedAt: '2024-03-05T10:00:00Z', salesCount: 53 },
  { id: 9, name: "Botanical Soap Set", price: 24, category: "Home", subcategory: "Bath", image: "/images/product-9.jpg", rating: 4.8, reviewCount: 67, description: "Handmade soaps with natural botanicals. Gentle cleansing with luxurious lather.", features: ["Natural Ingredients", "SLS-free", "Vegan"], inStock: true, stock: 5, status: 'active', sku: 'SKU-009', cost: 8, createdAt: '2024-03-10T10:00:00Z', updatedAt: '2024-03-10T10:00:00Z', salesCount: 38 },
  { id: 10, name: "Cherry Blossom Lip Tint", price: 22, category: "Beauty", subcategory: "Makeup", image: "/images/product-10.jpg", rating: 4.5, reviewCount: 234, description: "Long-lasting lip tint with cherry blossom extract. Gradient or full coverage application.", features: ["Transfer-proof", "Hydrating", "Buildable"], inStock: true, isBestseller: true, variants: [{ id: "shade", name: "Shade", options: ["Pink", "Coral", "Red", "Plum"] }], stock: 74, status: 'active', sku: 'SKU-010', cost: 7, createdAt: '2024-03-15T10:00:00Z', updatedAt: '2024-03-15T10:00:00Z', salesCount: 143 },
  { id: 11, name: "Cloud Knit Cardigan", price: 88, category: "Fashion", subcategory: "Tops", image: "/images/product-11.jpg", rating: 4.7, reviewCount: 45, description: "Ultra-soft knit cardigan in mint. Perfect layering piece for any season.", features: ["Soft Knit", "Open Front", "Relaxed Fit"], inStock: true, isNew: true, variants: [{ id: "size", name: "Size", options: ["S", "M", "L"] }], stock: 18, status: 'active', sku: 'SKU-011', cost: 32, createdAt: '2024-03-20T10:00:00Z', updatedAt: '2024-03-20T10:00:00Z', salesCount: 24 },
  { id: 12, name: "Pure Rice Cleanser", price: 28, category: "Beauty", subcategory: "Skincare", image: "/images/product-12.jpg", rating: 4.6, reviewCount: 112, description: "Gentle foaming cleanser with rice water. Removes impurities without stripping moisture.", features: ["pH Balanced", "Sulfate-free", "Gentle"], inStock: true, stock: 46, status: 'active', sku: 'SKU-012', cost: 9, createdAt: '2024-04-01T10:00:00Z', updatedAt: '2024-04-01T10:00:00Z', salesCount: 67 },
  { id: 13, name: "Meditation Incense Holder", price: 45, category: "Home", subcategory: "Decor", image: "/images/product-13.jpg", rating: 4.9, reviewCount: 38, description: "Minimalist ceramic incense holder. Creates a calming atmosphere for meditation.", features: ["Handcrafted Ceramic", "Ash Catcher", "Minimalist Design"], inStock: true, stock: 12, status: 'active', sku: 'SKU-013', cost: 15, createdAt: '2024-04-05T10:00:00Z', updatedAt: '2024-04-05T10:00:00Z', salesCount: 21 },
  { id: 14, name: "Silk Blossom Scarf", price: 65, category: "Fashion", subcategory: "Accessories", image: "/images/product-14.jpg", rating: 4.8, reviewCount: 52, description: "Luxurious silk scarf with delicate cherry blossom print. Versatile styling options.", features: ["100% Silk", "Hand-rolled Edges", "Lightweight"], inStock: true, stock: 9, status: 'active', sku: 'SKU-014', cost: 22, createdAt: '2024-04-10T10:00:00Z', updatedAt: '2024-04-10T10:00:00Z', salesCount: 31 },
  { id: 15, name: "Youth Eye Cream", price: 52, category: "Beauty", subcategory: "Skincare", image: "/images/product-15.jpg", rating: 4.4, reviewCount: 87, description: "Targeted eye cream reduces fine lines and dark circles. Lightweight, non-greasy formula.", features: ["Peptides", "Caffeine", "Fragrance-free"], inStock: true, stock: 35, status: 'active', sku: 'SKU-015', cost: 18, createdAt: '2024-04-15T10:00:00Z', updatedAt: '2024-04-15T10:00:00Z', salesCount: 49 },
  { id: 16, name: "Urban Minimal Backpack", price: 85, category: "Fashion", subcategory: "Accessories", image: "/images/product-16.jpg", rating: 4.6, reviewCount: 73, description: "Sleek backpack with laptop compartment. Water-resistant and perfect for daily commute.", features: ["Water-resistant", "Laptop Compartment", "Ergonomic Straps"], inStock: true, isNew: true, stock: 14, status: 'active', sku: 'SKU-016', cost: 30, createdAt: '2024-04-20T10:00:00Z', updatedAt: '2024-04-20T10:00:00Z', salesCount: 38 },
  { id: 17, name: "Hydra Glow Sheet Masks", price: 28, category: "Beauty", subcategory: "Skincare", image: "/images/product-17.jpg", rating: 4.7, reviewCount: 198, description: "Set of 5 hydrating sheet masks. Instant glow boost for special occasions or weekly pampering.", features: ["Hyaluronic Acid", "Vitamin C", "Biodegradable"], inStock: true, isBestseller: true, stock: 89, status: 'active', sku: 'SKU-017', cost: 9, createdAt: '2024-05-01T10:00:00Z', updatedAt: '2024-05-01T10:00:00Z', salesCount: 124 },
  { id: 18, name: "Tortoise Hair Claw", price: 18, category: "Fashion", subcategory: "Accessories", image: "/images/product-18.jpg", rating: 4.5, reviewCount: 124, description: "Elegant tortoise shell hair claw. Secure hold for all hair types.", features: ["Acetate", "Strong Hold", "Gentle on Hair"], inStock: true, stock: 56, status: 'active', sku: 'SKU-018', cost: 5, createdAt: '2024-05-05T10:00:00Z', updatedAt: '2024-05-05T10:00:00Z', salesCount: 79 },
  { id: 19, name: "Matcha Ceremony Set", price: 72, category: "Home", subcategory: "Kitchen", image: "/images/product-19.jpg", rating: 4.8, reviewCount: 41, description: "Complete matcha set with bowl, whisk, and scoop. Experience authentic Japanese tea ceremony.", features: ["Bamboo Whisk", "Ceramic Bowl", "Traditional"], inStock: true, stock: 7, status: 'active', sku: 'SKU-019', cost: 26, createdAt: '2024-05-10T10:00:00Z', updatedAt: '2024-05-10T10:00:00Z', salesCount: 22 },
  { id: 20, name: "Classic Crossbody Bag", price: 95, category: "Fashion", subcategory: "Accessories", image: "/images/product-20.jpg", rating: 4.7, reviewCount: 63, description: "Timeless crossbody bag in premium vegan leather. Adjustable strap and multiple compartments.", features: ["Vegan Leather", "Adjustable Strap", "Multiple Pockets"], inStock: true, isNew: true, stock: 11, status: 'active', sku: 'SKU-020', cost: 35, createdAt: '2024-05-15T10:00:00Z', updatedAt: '2024-05-15T10:00:00Z', salesCount: 41 },
];

const defaultOrders: Order[] = [
  { id: 'ord_001', orderNumber: 'SS-10001', customerName: 'Emily Chen', customerEmail: 'emily@example.com', customerPhone: '+1 555-1234', shippingAddress: { address: '123 Main St', city: 'New York', state: 'NY', zip: '10001', country: 'US' }, items: [{ productId: 1, productName: 'Glow Essence Serum', image: '/images/product-1.jpg', quantity: 2, price: 48 }, { productId: 10, productName: 'Cherry Blossom Lip Tint', image: '/images/product-10.jpg', quantity: 1, price: 22 }], subtotal: 118, shipping: 0, total: 118, status: 'delivered', paymentStatus: 'paid', createdAt: '2024-05-20T09:00:00Z', updatedAt: '2024-05-23T14:00:00Z', trackingNumber: 'TRK-88291' },
  { id: 'ord_002', orderNumber: 'SS-10002', customerName: 'Sarah Kim', customerEmail: 'sarah@example.com', customerPhone: '+1 555-5678', shippingAddress: { address: '456 Oak Ave', city: 'Los Angeles', state: 'CA', zip: '90001', country: 'US' }, items: [{ productId: 3, productName: 'Linen Breeze Blouse', image: '/images/product-3.jpg', quantity: 1, price: 78 }, { productId: 8, productName: 'Linen Wide Pants', image: '/images/product-8.jpg', quantity: 1, price: 68 }], subtotal: 146, shipping: 0, total: 146, status: 'shipped', paymentStatus: 'paid', createdAt: '2024-05-22T11:30:00Z', updatedAt: '2024-05-24T09:00:00Z', trackingNumber: 'TRK-88302' },
  { id: 'ord_003', orderNumber: 'SS-10003', customerName: 'Jessica Park', customerEmail: 'jessica@example.com', customerPhone: '+1 555-9012', shippingAddress: { address: '789 Pine Rd', city: 'Chicago', state: 'IL', zip: '60601', country: 'US' }, items: [{ productId: 17, productName: 'Hydra Glow Sheet Masks', image: '/images/product-17.jpg', quantity: 3, price: 28 }], subtotal: 84, shipping: 0, total: 84, status: 'processing', paymentStatus: 'paid', createdAt: '2024-05-25T14:00:00Z', updatedAt: '2024-05-25T14:00:00Z' },
  { id: 'ord_004', orderNumber: 'SS-10004', customerName: 'Mia Johnson', customerEmail: 'mia@example.com', customerPhone: '+1 555-3456', shippingAddress: { address: '321 Elm St', city: 'Seattle', state: 'WA', zip: '98101', country: 'US' }, items: [{ productId: 4, productName: 'Zen Ceramic Tea Set', image: '/images/product-4.jpg', quantity: 1, price: 95 }, { productId: 13, productName: 'Meditation Incense Holder', image: '/images/product-13.jpg', quantity: 1, price: 45 }], subtotal: 140, shipping: 0, total: 140, status: 'pending', paymentStatus: 'paid', createdAt: '2024-05-27T08:15:00Z', updatedAt: '2024-05-27T08:15:00Z' },
  { id: 'ord_005', orderNumber: 'SS-10005', customerName: 'Lily Wang', customerEmail: 'lily@example.com', customerPhone: '+1 555-7890', shippingAddress: { address: '654 Maple Dr', city: 'Houston', state: 'TX', zip: '77001', country: 'US' }, items: [{ productId: 11, productName: 'Cloud Knit Cardigan', image: '/images/product-11.jpg', quantity: 1, price: 88 }], subtotal: 88, shipping: 0, total: 88, status: 'pending', paymentStatus: 'pending', createdAt: '2024-05-28T16:45:00Z', updatedAt: '2024-05-28T16:45:00Z' },
];

const defaultAdmin: AdminUser = {
  id: 'admin_001',
  email: 'admin@seoulspice.com',
  password: 'admin123',
  name: 'Admin User',
  role: 'admin',
};

// ─── Initialize ────────────────────────────────────────────────────────────────

export function initializeStore() {
  if (!localStorage.getItem(KEYS.initialized)) {
    localStorage.setItem(KEYS.products, JSON.stringify(defaultProducts));
    localStorage.setItem(KEYS.orders, JSON.stringify(defaultOrders));
    localStorage.setItem(KEYS.admin, JSON.stringify(defaultAdmin));
    localStorage.setItem(KEYS.initialized, 'true');
  }
}

// ─── Products ─────────────────────────────────────────────────────────────────

export function getProducts(): StoreProduct[] {
  initializeStore();
  const raw = localStorage.getItem(KEYS.products);
  return raw ? JSON.parse(raw) : defaultProducts;
}

export function saveProducts(products: StoreProduct[]) {
  localStorage.setItem(KEYS.products, JSON.stringify(products));
  // Dispatch storage event so other tabs/components can react
  window.dispatchEvent(new Event('ss_products_updated'));
}

export function getProductById(id: number): StoreProduct | undefined {
  return getProducts().find(p => p.id === id);
}

export function saveProduct(product: StoreProduct) {
  const products = getProducts();
  const idx = products.findIndex(p => p.id === product.id);
  if (idx >= 0) {
    products[idx] = { ...product, updatedAt: new Date().toISOString() };
  } else {
    products.push({ ...product, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  saveProducts(products);
}

export function deleteProduct(id: number) {
  const products = getProducts().filter(p => p.id !== id);
  saveProducts(products);
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export function getOrders(): Order[] {
  initializeStore();
  const raw = localStorage.getItem(KEYS.orders);
  return raw ? JSON.parse(raw) : defaultOrders;
}

export function saveOrders(orders: Order[]) {
  localStorage.setItem(KEYS.orders, JSON.stringify(orders));
  window.dispatchEvent(new Event('ss_orders_updated'));
}

export function createOrder(order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Order {
  const orders = getOrders();
  const newOrder: Order = {
    ...order,
    id: `ord_${Date.now()}`,
    orderNumber: `SS-${10000 + orders.length + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  orders.unshift(newOrder);
  saveOrders(orders);
  return newOrder;
}

export function updateOrderStatus(orderId: string, status: Order['status']) {
  const orders = getOrders();
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx >= 0) {
    orders[idx] = { ...orders[idx], status, updatedAt: new Date().toISOString() };
    saveOrders(orders);
  }
}

export function updateOrder(order: Order) {
  const orders = getOrders();
  const idx = orders.findIndex(o => o.id === order.id);
  if (idx >= 0) {
    orders[idx] = { ...order, updatedAt: new Date().toISOString() };
    saveOrders(orders);
  }
}

// ─── Admin Auth ───────────────────────────────────────────────────────────────

export function getAdminUser(): AdminUser {
  initializeStore();
  const raw = localStorage.getItem(KEYS.admin);
  return raw ? JSON.parse(raw) : defaultAdmin;
}

export function adminLogin(email: string, password: string): AdminUser | null {
  const admin = getAdminUser();
  if (admin.email === email && admin.password === password) {
    sessionStorage.setItem('ss_admin_session', JSON.stringify({ id: admin.id, name: admin.name, role: admin.role }));
    return admin;
  }
  return null;
}

export function adminLogout() {
  sessionStorage.removeItem('ss_admin_session');
}

export function getAdminSession(): { id: string; name: string; role: string } | null {
  const raw = sessionStorage.getItem('ss_admin_session');
  return raw ? JSON.parse(raw) : null;
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export function getDashboardStats() {
  const orders = getOrders();
  const products = getProducts();

  const totalRevenue = orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const lowStockProducts = products.filter(p => p.stock <= 10 && p.status === 'active');

  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const topProducts = [...products].sort((a, b) => b.salesCount - a.salesCount).slice(0, 5);

  return { totalRevenue, totalOrders, pendingOrders, lowStockProducts, recentOrders, topProducts, totalProducts: products.length };
}
