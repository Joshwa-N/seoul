import { test, expect, request } from '@playwright/test';

const API = 'http://localhost:3001/api';

test.describe('🔌 Backend API Tests', () => {

  test('Health check endpoint responds', async ({ request }) => {
    const res = await request.get(`${API}/health`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('ok');
  });

  test('GET /api/products returns all products', async ({ request }) => {
    const res = await request.get(`${API}/products`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.products).toBeDefined();
    expect(Array.isArray(body.products)).toBe(true);
    expect(body.products.length).toBeGreaterThan(0);
    // Check product shape
    const p = body.products[0];
    expect(p).toHaveProperty('id');
    expect(p).toHaveProperty('name');
    expect(p).toHaveProperty('price');
    expect(p).toHaveProperty('stock');
    expect(p).toHaveProperty('category');
  });

  test('GET /api/products/:id returns single product', async ({ request }) => {
    const res = await request.get(`${API}/products/1`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.product).toBeDefined();
    expect(body.product.id).toBe(1);
  });

  test('GET /api/products/:id with invalid id returns 404', async ({ request }) => {
    const res = await request.get(`${API}/products/99999`);
    expect(res.status()).toBe(404);
  });

  test('GET /api/categories returns categories', async ({ request }) => {
    const res = await request.get(`${API}/categories`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.categories).toBeDefined();
    expect(Array.isArray(body.categories)).toBe(true);
  });

  test('POST /api/auth/login with valid credentials returns token', async ({ request }) => {
    const res = await request.post(`${API}/auth/login`, {
      data: { email: 'admin@seoulspice.com', password: 'admin123' }
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.token).toBeDefined();
    expect(body.user.role).toBe('admin');
  });

  test('POST /api/auth/login with invalid credentials returns 401', async ({ request }) => {
    const res = await request.post(`${API}/auth/login`, {
      data: { email: 'wrong@email.com', password: 'wrongpass' }
    });
    expect(res.status()).toBe(401);
  });

  test('PUT /api/products/:id without auth returns 401', async ({ request }) => {
    const res = await request.put(`${API}/products/1`, {
      data: { name: 'Test' }
    });
    expect(res.status()).toBe(401);
  });

  test('PUT /api/products/:id with auth updates product', async ({ request }) => {
    // Login first
    const loginRes = await request.post(`${API}/auth/login`, {
      data: { email: 'admin@seoulspice.com', password: 'admin123' }
    });
    const { token } = await loginRes.json();

    // Get original product
    const original = await request.get(`${API}/products/1`);
    const { product } = await original.json();
    const originalPrice = product.price;

    // Update price
    const updateRes = await request.put(`${API}/products/1`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { ...product, price: 999 }
    });
    expect(updateRes.status()).toBe(200);
    const updated = await updateRes.json();
    expect(updated.product.price).toBe(999);

    // Restore original price
    await request.put(`${API}/products/1`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { ...product, price: originalPrice }
    });
  });

  test('GET /api/analytics/dashboard without auth returns 401', async ({ request }) => {
    const res = await request.get(`${API}/analytics/dashboard`);
    expect(res.status()).toBe(401);
  });

  test('GET /api/analytics/dashboard with auth returns stats', async ({ request }) => {
    const loginRes = await request.post(`${API}/auth/login`, {
      data: { email: 'admin@seoulspice.com', password: 'admin123' }
    });
    const { token } = await loginRes.json();

    const res = await request.get(`${API}/analytics/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('totalRevenue');
    expect(body).toHaveProperty('totalOrders');
    expect(body).toHaveProperty('totalProducts');
  });

  test('POST /api/orders creates order and deducts stock', async ({ request }) => {
    // Get initial stock
    const prodRes = await request.get(`${API}/products/2`);
    const { product } = await prodRes.json();
    const initialStock = product.stock;

    // Place order
    const orderRes = await request.post(`${API}/orders`, {
      data: {
        customerName: 'Test User',
        customerEmail: 'test@test.com',
        customerPhone: '9999999999',
        shippingAddress: { street: '123 Test St', city: 'Chennai', state: 'TN', zipCode: '600001', country: 'India' },
        items: [{ productId: 2, productName: product.name, quantity: 1, price: product.price, productImage: product.image }],
        subtotal: product.price,
        shipping: 0,
        discount: 0,
        total: product.price,
        paymentMethod: 'card'
      }
    });
    expect(orderRes.status()).toBe(201);
    const order = await orderRes.json();
    expect(order.order).toBeDefined();
    expect(order.order.orderNumber).toMatch(/^SS-/);

    // Check stock was deducted
    const afterRes = await request.get(`${API}/products/2`);
    const { product: afterProduct } = await afterRes.json();
    expect(afterProduct.stock).toBe(initialStock - 1);
  });

  test('POST /api/orders fails when stock is insufficient', async ({ request }) => {
    const res = await request.post(`${API}/orders`, {
      data: {
        customerName: 'Test User',
        customerEmail: 'test@test.com',
        shippingAddress: { street: '123 Test St', city: 'Chennai', state: 'TN', zipCode: '600001', country: 'India' },
        items: [{ productId: 1, productName: 'Test', quantity: 99999, price: 40, productImage: '' }],
        subtotal: 40,
        shipping: 0,
        discount: 0,
        total: 40,
        paymentMethod: 'card'
      }
    });
    expect(res.status()).toBe(400);
  });
});