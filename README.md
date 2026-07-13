# Seoul & Spice — Unified E-commerce + Admin Panel

## Quick Start

```bash
npm install
npm run dev
```

Open:
- **Store**: http://localhost:5173
- **Admin**: http://localhost:5173/admin

## Admin Login
- Email: `admin@seoulspice.com`  
- Password: `admin123`

## How Frontend ↔ Admin Are Connected

`src/lib/store.ts` is the shared data layer:
- Products live in localStorage — admin edits show on the frontend
- Checkout saves orders to localStorage — they appear in admin Orders
- Real-time sync via window events between tabs

## Admin Features
- Dashboard: Revenue, pending orders, low stock alerts
- Products: Add/edit/delete, manage stock & status
- Orders: View all orders including from checkout, update status
- Categories: Category breakdown with visibility toggle
- Analytics: Revenue by category, top products, order distribution
- Settings: Store config

The ⚙️ gear icon in the store navigation takes you to the admin panel.
