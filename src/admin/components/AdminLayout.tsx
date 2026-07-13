import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag, BarChart3,
  Settings, LogOut, Menu, X, Bell, ChevronRight, Store
} from 'lucide-react';
import { useAdminAuth } from '@/admin/context/AdminAuthContext';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { label: 'Products', icon: Package, path: '/admin/products' },
  { label: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
  { label: 'Categories', icon: Tag, path: '/admin/categories' },
  { label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { session, logout } = useAdminAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#1D3557] flex flex-col transition-all duration-300 flex-shrink-0`}>
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-white/10">
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#A8DADC] rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-[#1D3557]" />
              </div>
              <span className="text-white font-bold text-lg">Seoul & Spice</span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-[#A8DADC] rounded-lg flex items-center justify-center mx-auto">
              <Store className="w-5 h-5 text-[#1D3557]" />
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-6 space-y-1 px-2 overflow-y-auto">
          {navItems.map(item => {
            const isActive = item.path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                  isActive ? 'bg-[#A8DADC] text-[#1D3557]' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
                {!sidebarOpen && (
                  <div className="absolute left-20 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Visit Store Link */}
        <div className="px-2 pb-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-all text-sm"
          >
            <Store className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Visit Store</span>}
          </a>
        </div>

        {/* User */}
        <div className="border-t border-white/10 p-4">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#A8DADC] rounded-full flex items-center justify-center text-[#1D3557] font-bold text-sm flex-shrink-0">
                {session?.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{session?.name}</p>
                <p className="text-white/50 text-xs capitalize">{session?.role}</p>
              </div>
              <button onClick={handleLogout} className="text-white/50 hover:text-white transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button onClick={handleLogout} className="w-full flex justify-center text-white/50 hover:text-white transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 gap-4 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Admin</span>
            {location.pathname !== '/admin' && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900 font-medium capitalize">
                  {location.pathname.split('/').pop()}
                </span>
              </>
            )}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-8 h-8 bg-[#A8DADC] rounded-full flex items-center justify-center text-[#1D3557] font-bold text-sm">
              {session?.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
