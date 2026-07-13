import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { AdminAuthProvider, useAdminAuth } from '@/admin/context/AdminAuthContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import Products from '@/pages/Products';
import ProductDetail from '@/pages/ProductDetail';
import Collections from '@/pages/Collections';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import Login from '@/pages/Login';
import ScrollToTop from '@/components/ScrollToTop';

// Admin
import AdminLogin from '@/admin/pages/AdminLogin';
import AdminLayout from '@/admin/components/AdminLayout';
import AdminDashboard from '@/admin/pages/AdminDashboard';
import AdminProducts from '@/admin/pages/AdminProducts';
import AdminOrders from '@/admin/pages/AdminOrders';
import AdminCategories from '@/admin/pages/AdminCategories';
import AdminAnalytics from '@/admin/pages/AdminAnalytics';
import AdminSettings from '@/admin/pages/AdminSettings';
import { initializeStore } from '@/lib/store';

// Initialize localStorage store on app boot
initializeStore();

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { session } = useAdminAuth();
  if (!session) return <Navigate to="/admin/login" replace />;
  return <AdminLayout>{children}</AdminLayout>;
}

// Frontend layout — ScrollToTop is inside here so it fires on every nested route change
function StoreLayout() {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <ScrollToTop />
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail key={pathname} />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AdminAuthProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              {/* Admin routes - no nav/footer */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
              <Route path="/admin/products" element={<AdminGuard><AdminProducts /></AdminGuard>} />
              <Route path="/admin/orders" element={<AdminGuard><AdminOrders /></AdminGuard>} />
              <Route path="/admin/categories" element={<AdminGuard><AdminCategories /></AdminGuard>} />
              <Route path="/admin/analytics" element={<AdminGuard><AdminAnalytics /></AdminGuard>} />
              <Route path="/admin/settings" element={<AdminGuard><AdminSettings /></AdminGuard>} />

              {/* Frontend store routes */}
              <Route path="/*" element={<StoreLayout />} />
            </Routes>
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: { background: '#1D3557', color: '#fff', border: 'none' },
              }}
            />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </AdminAuthProvider>
  );
}

export default App;