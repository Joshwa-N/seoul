import { useState, useEffect } from 'react';
import { getOrders, getProducts } from '@/lib/store';
import { TrendingUp, IndianRupee, ShoppingCart, Package } from 'lucide-react';

export default function AdminAnalytics() {
  const [orders, setOrders] = useState(getOrders());
  const [products, setProducts] = useState(getProducts());

  useEffect(() => {
    const refresh = () => { setOrders(getOrders()); setProducts(getProducts()); };
    window.addEventListener('ss_orders_updated', refresh);
    window.addEventListener('ss_products_updated', refresh);
    return () => { window.removeEventListener('ss_orders_updated', refresh); window.removeEventListener('ss_products_updated', refresh); };
  }, []);

  const paidOrders = orders.filter(o => o.paymentStatus === 'paid');
  const totalRevenue = paidOrders.reduce((s, o) => s + o.total, 0);
  const avgOrderValue = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;

  // Revenue by category
  const revenueByCategory: Record<string, number> = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        revenueByCategory[product.category] = (revenueByCategory[product.category] || 0) + item.price * item.quantity;
      }
    });
  });

  // Order status breakdown
  const statusCounts: Record<string, number> = {};
  orders.forEach(o => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1; });

  const STATUS_COLORS: Record<string, string> = {
    pending: '#F59E0B',
    processing: '#3B82F6',
    shipped: '#8B5CF6',
    delivered: '#10B981',
    cancelled: '#EF4444',
  };

  const topProducts = [...products].sort((a, b) => b.salesCount - a.salesCount).slice(0, 10);
  const totalSales = topProducts.reduce((s, p) => s + p.salesCount, 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-0.5">Store performance overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `₹${totalRevenue.toFixed(2)}`, icon: IndianRupee, color: 'text-green-600 bg-green-50' },
          { label: 'Total Orders', value: orders.length, icon: ShoppingCart, color: 'text-blue-600 bg-blue-50' },
          { label: 'Avg. Order Value', value: `₹${avgOrderValue.toFixed(2)}`, icon: TrendingUp, color: 'text-purple-600 bg-purple-50' },
          { label: 'Active Products', value: products.filter(p => p.status === 'active').length, icon: Package, color: 'text-orange-600 bg-orange-50' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">{kpi.label}</span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${kpi.color}`}>
                <kpi.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue by Category */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Revenue by Category</h2>
          {Object.keys(revenueByCategory).length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No revenue data yet</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(revenueByCategory)
                .sort((a, b) => b[1] - a[1])
                .map(([cat, rev]) => {
                  const max = Math.max(...Object.values(revenueByCategory));
                  return (
                    <div key={cat} className="flex items-center gap-3">
                      <div className="w-20 text-sm text-gray-600 font-medium">{cat}</div>
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div className="bg-[#A8DADC] h-2 rounded-full" style={{ width: `${(rev / max) * 100}%` }} />
                      </div>
                      <div className="w-20 text-right text-sm font-semibold text-gray-900">₹{rev.toFixed(0)}</div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Order Status Distribution</h2>
          {Object.keys(statusCounts).length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: STATUS_COLORS[status] || '#ccc' }} />
                  <div className="w-20 text-sm text-gray-600 font-medium capitalize">{status}</div>
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{ width: `${(count / orders.length) * 100}%`, backgroundColor: STATUS_COLORS[status] || '#ccc' }}
                    />
                  </div>
                  <div className="w-16 text-right text-sm font-semibold">{count} ({Math.round((count / orders.length) * 100)}%)</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Top Products by Sales</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 pb-3">Product</th>
                <th className="text-left text-xs font-semibold text-gray-500 pb-3">Category</th>
                <th className="text-left text-xs font-semibold text-gray-500 pb-3">Price</th>
                <th className="text-left text-xs font-semibold text-gray-500 pb-3">Units Sold</th>
                <th className="text-left text-xs font-semibold text-gray-500 pb-3">Revenue</th>
                <th className="text-left text-xs font-semibold text-gray-500 pb-3">Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {topProducts.map((p, idx) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-300 w-5">#{idx + 1}</span>
                      <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                      <span className="text-sm font-medium text-gray-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-sm text-gray-500">{p.category}</td>
                  <td className="py-3 text-sm font-semibold">₹{p.price}</td>
                  <td className="py-3 text-sm text-gray-600">{p.salesCount}</td>
                  <td className="py-3 text-sm font-semibold text-green-600">₹{(p.salesCount * p.price).toFixed(0)}</td>
                  <td className="py-3">
                    <div className="w-16 bg-gray-100 rounded-full h-1.5">
                      <div className="bg-[#A8DADC] h-1.5 rounded-full" style={{ width: `${totalSales > 0 ? (p.salesCount / totalSales) * 100 : 0}%` }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
