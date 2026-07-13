import { pool, query } from './index';
import bcrypt from 'bcryptjs';

async function setup() {
  console.log('🔧 Setting up database schema...');

  // ─── Users ────────────────────────────────────────────────────────────────
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'manager')),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  // ─── Categories ───────────────────────────────────────────────────────────
  await query(`
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(100) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      image VARCHAR(500),
      color VARCHAR(20),
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  // ─── Products ─────────────────────────────────────────────────────────────
  await query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE,
      price NUMERIC(10,2) NOT NULL,
      original_price NUMERIC(10,2),
      category VARCHAR(100) NOT NULL,
      subcategory VARCHAR(100),
      image VARCHAR(500),
      hover_image VARCHAR(500),
      rating NUMERIC(3,1) DEFAULT 0,
      review_count INT DEFAULT 0,
      description TEXT,
      features JSONB DEFAULT '[]',
      in_stock BOOLEAN DEFAULT true,
      is_new BOOLEAN DEFAULT false,
      is_bestseller BOOLEAN DEFAULT false,
      variants JSONB DEFAULT '[]',
      sku VARCHAR(100) UNIQUE,
      cost NUMERIC(10,2),
      status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
      sales_count INT DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  // ─── Inventory ────────────────────────────────────────────────────────────
  await query(`
    CREATE TABLE IF NOT EXISTS inventory (
      id SERIAL PRIMARY KEY,
      product_id INT UNIQUE NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      stock_quantity INT NOT NULL DEFAULT 0,
      low_stock_threshold INT DEFAULT 10,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  // ─── Orders ───────────────────────────────────────────────────────────────
  await query(`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      order_number VARCHAR(50) UNIQUE NOT NULL,
      customer_name VARCHAR(255) NOT NULL,
      customer_email VARCHAR(255) NOT NULL,
      customer_phone VARCHAR(50),
      shipping_address JSONB NOT NULL,
      subtotal NUMERIC(10,2) NOT NULL,
      shipping_cost NUMERIC(10,2) DEFAULT 0,
      total NUMERIC(10,2) NOT NULL,
      status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending','processing','shipped','delivered','cancelled')),
      payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','failed')),
      tracking_number VARCHAR(100),
      admin_note TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  // ─── Order Items ──────────────────────────────────────────────────────────
  await query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id INT REFERENCES products(id) ON DELETE SET NULL,
      product_name VARCHAR(255) NOT NULL,
      product_image VARCHAR(500),
      quantity INT NOT NULL,
      price NUMERIC(10,2) NOT NULL,
      selected_variant JSONB DEFAULT '{}'
    )
  `);

  // ─── Indexes ──────────────────────────────────────────────────────────────
  await query(`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)`);
  await query(`CREATE INDEX IF NOT EXISTS idx_products_status ON products(status)`);
  await query(`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)`);
  await query(`CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email)`);
  await query(`CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory(product_id)`);

  // ─── Seed Categories ──────────────────────────────────────────────────────
  await query(`
    INSERT INTO categories (slug, name, description, image, color) VALUES
      ('beauty', 'K-Beauty', 'Discover the secrets of Korean skincare with our curated collection of serums, masks, and makeup.', '/images/collection-beauty.jpg', '#F8C8DC'),
      ('fashion', 'Seoul Fashion', 'Minimalist designs meets effortless elegance. Linen, silk, and sustainable fabrics for the modern wardrobe.', '/images/collection-fashion.jpg', '#A8DADC'),
      ('home', 'Home Living', 'Curated home essentials that bring calm and beauty to your everyday spaces.', '/images/collection-home.jpg', '#E9D5FF'),
      ('food', 'Spice Pantry', 'Authentic Korean flavors and spices to elevate your culinary adventures.', '/images/collection-food.jpg', '#F4A261')
    ON CONFLICT (slug) DO NOTHING
  `);

  // ─── Seed Products ────────────────────────────────────────────────────────
  const products = [
    { name: 'Glow Essence Serum', price: 48, originalPrice: 65, category: 'Beauty', subcategory: 'Skincare', image: '/images/product-1.jpg', rating: 4.8, reviewCount: 124, description: 'A lightweight, hydrating serum infused with Korean botanical extracts for a radiant glow. Perfect for daily use.', features: ['Hyaluronic Acid', 'Niacinamide', 'Vegan', 'Cruelty-free'], inStock: true, isBestseller: true, variants: [{ id: 'size', name: 'Size', options: ['30ml', '50ml'] }], stock: 42, sku: 'SKU-001', cost: 18, salesCount: 89, status: 'active' },
    { name: 'Perfect Cushion Foundation', price: 42, category: 'Beauty', subcategory: 'Makeup', image: '/images/product-2.jpg', rating: 4.6, reviewCount: 89, description: 'Buildable coverage with a natural dewy finish. SPF 50+ protection for all-day wear.', features: ['SPF 50+', 'Hydrating', 'Long-lasting'], inStock: true, isNew: true, variants: [{ id: 'shade', name: 'Shade', options: ['Fair', 'Light', 'Medium', 'Tan'] }], stock: 28, sku: 'SKU-002', cost: 14, salesCount: 56, status: 'active' },
    { name: 'Linen Breeze Blouse', price: 78, category: 'Fashion', subcategory: 'Tops', image: '/images/product-3.jpg', rating: 4.7, reviewCount: 56, description: 'Breathable linen blouse with a relaxed fit. Perfect for summer days and effortless style.', features: ['100% Linen', 'Breathable', 'Relaxed Fit'], inStock: true, variants: [{ id: 'size', name: 'Size', options: ['XS', 'S', 'M', 'L', 'XL'] }], stock: 15, sku: 'SKU-003', cost: 28, salesCount: 34, status: 'active' },
    { name: 'Zen Ceramic Tea Set', price: 95, category: 'Home', subcategory: 'Kitchen', image: '/images/product-4.jpg', rating: 4.9, reviewCount: 42, description: 'Handcrafted ceramic tea set with gradient glaze. Includes teapot, cups, and serving tray.', features: ['Handcrafted', 'Microwave Safe', 'Dishwasher Safe'], inStock: true, isBestseller: true, stock: 8, sku: 'SKU-004', cost: 38, salesCount: 29, status: 'active' },
    { name: 'Overnight Repair Mask', price: 38, category: 'Beauty', subcategory: 'Skincare', image: '/images/product-5.jpg', rating: 4.5, reviewCount: 203, description: 'Wake up to refreshed, hydrated skin. Rich formula repairs and nourishes while you sleep.', features: ['Ceramides', 'Peptides', 'Fragrance-free'], inStock: true, stock: 61, sku: 'SKU-005', cost: 12, salesCount: 118, status: 'active' },
    { name: 'Seoul Canvas Tote', price: 35, category: 'Fashion', subcategory: 'Accessories', image: '/images/product-6.jpg', rating: 4.4, reviewCount: 78, description: 'Minimalist canvas tote with Korean calligraphy detail. Spacious and durable for everyday use.', features: ['100% Cotton Canvas', 'Inner Pocket', 'Eco-friendly'], inStock: true, isNew: true, stock: 33, sku: 'SKU-006', cost: 10, salesCount: 47, status: 'active' },
    { name: 'Rice Water Essence', price: 32, category: 'Beauty', subcategory: 'Skincare', image: '/images/product-7.jpg', rating: 4.7, reviewCount: 156, description: 'Traditional Korean beauty secret. Brightens and smooths skin texture with fermented rice water.', features: ['Fermented Rice Extract', 'Brightening', 'Alcohol-free'], inStock: true, stock: 50, sku: 'SKU-007', cost: 10, salesCount: 92, status: 'active' },
    { name: 'Linen Wide Pants', price: 68, category: 'Fashion', subcategory: 'Bottoms', image: '/images/product-8.jpg', rating: 4.6, reviewCount: 92, description: 'Effortlessly chic wide-leg pants in premium linen. Elastic waist for all-day comfort.', features: ['100% Linen', 'Elastic Waist', 'Side Pockets'], inStock: true, variants: [{ id: 'size', name: 'Size', options: ['XS', 'S', 'M', 'L', 'XL'] }], stock: 22, sku: 'SKU-008', cost: 24, salesCount: 53, status: 'active' },
    { name: 'Botanical Soap Set', price: 24, category: 'Home', subcategory: 'Bath', image: '/images/product-9.jpg', rating: 4.8, reviewCount: 67, description: 'Handmade soaps with natural botanicals. Gentle cleansing with luxurious lather.', features: ['Natural Ingredients', 'SLS-free', 'Vegan'], inStock: true, stock: 5, sku: 'SKU-009', cost: 8, salesCount: 38, status: 'active' },
    { name: 'Cherry Blossom Lip Tint', price: 22, category: 'Beauty', subcategory: 'Makeup', image: '/images/product-10.jpg', rating: 4.5, reviewCount: 234, description: 'Long-lasting lip tint with cherry blossom extract. Gradient or full coverage application.', features: ['Transfer-proof', 'Hydrating', 'Buildable'], inStock: true, isBestseller: true, variants: [{ id: 'shade', name: 'Shade', options: ['Pink', 'Coral', 'Red', 'Plum'] }], stock: 74, sku: 'SKU-010', cost: 7, salesCount: 143, status: 'active' },
    { name: 'Cloud Knit Cardigan', price: 88, category: 'Fashion', subcategory: 'Tops', image: '/images/product-11.jpg', rating: 4.7, reviewCount: 45, description: 'Ultra-soft knit cardigan in mint. Perfect layering piece for any season.', features: ['Soft Knit', 'Open Front', 'Relaxed Fit'], inStock: true, isNew: true, variants: [{ id: 'size', name: 'Size', options: ['S', 'M', 'L'] }], stock: 18, sku: 'SKU-011', cost: 32, salesCount: 24, status: 'active' },
    { name: 'Pure Rice Cleanser', price: 28, category: 'Beauty', subcategory: 'Skincare', image: '/images/product-12.jpg', rating: 4.6, reviewCount: 112, description: 'Gentle foaming cleanser with rice water. Removes impurities without stripping moisture.', features: ['pH Balanced', 'Sulfate-free', 'Gentle'], inStock: true, stock: 46, sku: 'SKU-012', cost: 9, salesCount: 67, status: 'active' },
    { name: 'Meditation Incense Holder', price: 45, category: 'Home', subcategory: 'Decor', image: '/images/product-13.jpg', rating: 4.9, reviewCount: 38, description: 'Minimalist ceramic incense holder. Creates a calming atmosphere for meditation.', features: ['Handcrafted Ceramic', 'Ash Catcher', 'Minimalist Design'], inStock: true, stock: 12, sku: 'SKU-013', cost: 15, salesCount: 21, status: 'active' },
    { name: 'Silk Blossom Scarf', price: 65, category: 'Fashion', subcategory: 'Accessories', image: '/images/product-14.jpg', rating: 4.8, reviewCount: 52, description: 'Luxurious silk scarf with delicate cherry blossom print. Versatile styling options.', features: ['100% Silk', 'Hand-rolled Edges', 'Lightweight'], inStock: true, stock: 9, sku: 'SKU-014', cost: 22, salesCount: 31, status: 'active' },
    { name: 'Youth Eye Cream', price: 52, category: 'Beauty', subcategory: 'Skincare', image: '/images/product-15.jpg', rating: 4.4, reviewCount: 87, description: 'Targeted eye cream reduces fine lines and dark circles. Lightweight, non-greasy formula.', features: ['Peptides', 'Caffeine', 'Fragrance-free'], inStock: true, stock: 35, sku: 'SKU-015', cost: 18, salesCount: 49, status: 'active' },
    { name: 'Urban Minimal Backpack', price: 85, category: 'Fashion', subcategory: 'Accessories', image: '/images/product-16.jpg', rating: 4.6, reviewCount: 73, description: 'Sleek backpack with laptop compartment. Water-resistant and perfect for daily commute.', features: ['Water-resistant', 'Laptop Compartment', 'Ergonomic Straps'], inStock: true, isNew: true, stock: 14, sku: 'SKU-016', cost: 30, salesCount: 38, status: 'active' },
    { name: 'Hydra Glow Sheet Masks', price: 28, category: 'Beauty', subcategory: 'Skincare', image: '/images/product-17.jpg', rating: 4.7, reviewCount: 198, description: 'Set of 5 hydrating sheet masks. Instant glow boost for special occasions or weekly pampering.', features: ['Hyaluronic Acid', 'Vitamin C', 'Biodegradable'], inStock: true, isBestseller: true, stock: 89, sku: 'SKU-017', cost: 9, salesCount: 124, status: 'active' },
    { name: 'Tortoise Hair Claw', price: 18, category: 'Fashion', subcategory: 'Accessories', image: '/images/product-18.jpg', rating: 4.5, reviewCount: 124, description: 'Elegant tortoise shell hair claw. Secure hold for all hair types.', features: ['Acetate', 'Strong Hold', 'Gentle on Hair'], inStock: true, stock: 56, sku: 'SKU-018', cost: 5, salesCount: 79, status: 'active' },
    { name: 'Matcha Ceremony Set', price: 72, category: 'Home', subcategory: 'Kitchen', image: '/images/product-19.jpg', rating: 4.8, reviewCount: 41, description: 'Complete matcha set with bowl, whisk, and scoop. Experience authentic Japanese tea ceremony.', features: ['Bamboo Whisk', 'Ceramic Bowl', 'Traditional'], inStock: true, stock: 7, sku: 'SKU-019', cost: 26, salesCount: 22, status: 'active' },
    { name: 'Classic Crossbody Bag', price: 95, category: 'Fashion', subcategory: 'Accessories', image: '/images/product-20.jpg', rating: 4.7, reviewCount: 63, description: 'Timeless crossbody bag in premium vegan leather. Adjustable strap and multiple compartments.', features: ['Vegan Leather', 'Adjustable Strap', 'Multiple Pockets'], inStock: true, isNew: true, stock: 11, sku: 'SKU-020', cost: 35, salesCount: 41, status: 'active' },
  ];

  for (const p of products) {
    const result = await query(`
      INSERT INTO products (
        name, price, original_price, category, subcategory, image,
        rating, review_count, description, features, in_stock, is_new,
        is_bestseller, variants, sku, cost, sales_count, status
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
      ON CONFLICT (sku) DO NOTHING
      RETURNING id
    `, [
      p.name, p.price, p.originalPrice || null, p.category, p.subcategory || null,
      p.image, p.rating, p.reviewCount, p.description,
      JSON.stringify(p.features || []), p.inStock, p.isNew || false,
      p.isBestseller || false, JSON.stringify(p.variants || []),
      p.sku, p.cost, p.salesCount, p.status
    ]);

    if (result.rows.length > 0) {
      const productId = result.rows[0].id;
      await query(`
        INSERT INTO inventory (product_id, stock_quantity, low_stock_threshold)
        VALUES ($1, $2, 10)
        ON CONFLICT (product_id) DO NOTHING
      `, [productId, p.stock]);
    }
  }

  // ─── Seed Admin User ──────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('admin123', 12);
  await query(`
    INSERT INTO users (email, password_hash, name, role)
    VALUES ('admin@seoulspice.com', $1, 'Admin User', 'admin')
    ON CONFLICT (email) DO NOTHING
  `, [passwordHash]);

  // ─── Seed Sample Orders ───────────────────────────────────────────────────
  const sampleOrders = [
    { orderNumber: 'SS-10001', customerName: 'Emily Chen', customerEmail: 'emily@example.com', customerPhone: '+1 555-1234', address: { address: '123 Main St', city: 'New York', state: 'NY', zip: '10001', country: 'US' }, subtotal: 118, shipping: 0, total: 118, status: 'delivered', paymentStatus: 'paid', items: [{ productId: 1, productName: 'Glow Essence Serum', image: '/images/product-1.jpg', quantity: 2, price: 48 }, { productId: 10, productName: 'Cherry Blossom Lip Tint', image: '/images/product-10.jpg', quantity: 1, price: 22 }] },
    { orderNumber: 'SS-10002', customerName: 'Sarah Kim', customerEmail: 'sarah@example.com', customerPhone: '+1 555-5678', address: { address: '456 Oak Ave', city: 'Los Angeles', state: 'CA', zip: '90001', country: 'US' }, subtotal: 146, shipping: 0, total: 146, status: 'shipped', paymentStatus: 'paid', items: [{ productId: 3, productName: 'Linen Breeze Blouse', image: '/images/product-3.jpg', quantity: 1, price: 78 }] },
    { orderNumber: 'SS-10003', customerName: 'Jessica Park', customerEmail: 'jessica@example.com', customerPhone: '+1 555-9012', address: { address: '789 Pine Rd', city: 'Chicago', state: 'IL', zip: '60601', country: 'US' }, subtotal: 84, shipping: 0, total: 84, status: 'processing', paymentStatus: 'paid', items: [{ productId: 17, productName: 'Hydra Glow Sheet Masks', image: '/images/product-17.jpg', quantity: 3, price: 28 }] },
  ];

  for (const o of sampleOrders) {
    const orderResult = await query(`
      INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, shipping_address, subtotal, shipping_cost, total, status, payment_status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      ON CONFLICT (order_number) DO NOTHING
      RETURNING id
    `, [o.orderNumber, o.customerName, o.customerEmail, o.customerPhone, JSON.stringify(o.address), o.subtotal, o.shipping, o.total, o.status, o.paymentStatus]);

    if (orderResult.rows.length > 0) {
      const orderId = orderResult.rows[0].id;
      for (const item of o.items) {
        await query(`
          INSERT INTO order_items (order_id, product_id, product_name, product_image, quantity, price)
          VALUES ($1,$2,$3,$4,$5,$6)
        `, [orderId, item.productId, item.productName, item.image, item.quantity, item.price]);
      }
    }
  }

  console.log('✅ Database setup complete!');
  await pool.end();
}

setup().catch((err) => {
  console.error('❌ Setup failed:', err);
  process.exit(1);
});