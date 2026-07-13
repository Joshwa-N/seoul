import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  IndianRupee, ShoppingCart, Package, AlertTriangle, 
  TrendingUp, ArrowUpRight, Eye, Clock
} from 'lucide-react';
import { getDashboardStats } from '@/lib/store';
import type { Order } from '@/lib/store';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(() => getDashboardStats());

  useEffect(() => {
    const refresh = () => setStats(getDashboardStats());
    window.addEventListener('ss_orders_updated', refresh);
    window.addEventListener('ss_products_updated', refresh);
    return () => {
      window.removeEventListener('ss_orders_updated', refresh);
      window.removeEventListener('ss_products_updated', refresh);
    };
  }, []);

  const { totalRevenue, totalOrders, pendingOrders, lowStockProducts, recentOrders, topProducts, totalProducts } = stats;

  const statCards = [
    { label: 'Total Revenue', value: `₹${totalRevenue.toFixed(2)}`, icon: IndianRupee, color: 'bg-green-50 text-green-600', change: '+12.5%' },
    { label: 'Total Orders', value: totalOrders.toString(), icon: ShoppingCart, color: 'bg-blue-50 text-blue-600', change: '+8.3%' },
    { label: 'Pending Orders', value: pendingOrders.toString(), icon: Clock, color: 'bg-yellow-50 text-yellow-600', change: 'Needs action' },
    { label: 'Total Products', value: totalProducts.toString(), icon: Package, color: 'bg-purple-50 text-purple-600', change: `${lowStockProducts.length} low stock` },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Welcome back! Here's what's happening.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-xl px-3 py-2">
          <TrendingUp className="w-4 h-4 text-green-500" />
          Live data
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(card => (
          <div key={card.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">{card.label}</span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3 text-green-500" />
              {card.change}
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-[#1D3557] font-medium hover:underline flex items-center gap-1">
              View all <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-gray-400">No orders yet</div>
            ) : (
              recentOrders.map((order: Order) => (
                <div key={order.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 bg-[#A8DADC]/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <ShoppingCart className="w-4 h-4 text-[#1D3557]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900">{order.customerName}</p>
                    <p className="text-xs text-gray-400">{order.orderNumber} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">₹{order.total.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <Link to={`/admin/orders/${order.id}`} className="text-gray-400 hover:text-gray-600">
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Low Stock
            </h2>
            <Link to="/admin/products" className="text-sm text-[#1D3557] font-medium hover:underline">
              Manage
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {lowStockProducts.length === 0 ? (
              <div className="p-8 text-center text-gray-400">All products are well stocked!</div>
            ) : (
              lowStockProducts.map(p => (
                <div key={p.id} className="flex items-center gap-3 p-4">
                  <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.category}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${p.stock === 0 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                    {p.stock === 0 ? 'Out' : `${p.stock} left`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Top Selling Products</h2>
          <Link to="/admin/analytics" className="text-sm text-[#1D3557] font-medium hover:underline flex items-center gap-1">
            Full Report <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {topProducts.map((p, idx) => (
              <div key={p.id} className="flex items-center gap-4">
                <span className="w-6 text-center text-sm font-bold text-gray-300">#{idx + 1}</span>
                <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                      <div
                        className="bg-[#A8DADC] h-1.5 rounded-full"
                        style={{ width: `${Math.min(100, (p.salesCount / (topProducts[0]?.salesCount || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">₹{p.price}</p>
                  <p className="text-xs text-gray-400">{p.salesCount} sold</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
