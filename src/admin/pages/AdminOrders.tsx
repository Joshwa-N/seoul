import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, ShoppingCart } from 'lucide-react';
import { getOrders, updateOrderStatus } from '@/lib/store';
import type { Order } from '@/lib/store';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const PAYMENT_COLORS: Record<string, string> = {
  paid: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const refresh = () => setOrders(getOrders());

  useEffect(() => {
    refresh();
    window.addEventListener('ss_orders_updated', refresh);
    return () => window.removeEventListener('ss_orders_updated', refresh);
  }, []);

  const filtered = orders.filter(o => {
    const matchSearch = o.orderNumber.includes(search) || o.customerName.toLowerCase().includes(search.toLowerCase()) || o.customerEmail.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleStatusChange = (orderId: string, status: Order['status']) => {
    updateOrderStatus(orderId, status);
    refresh();
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status } : null);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} of {orders.length} orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order #, name, email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#A8DADC]"
          />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#A8DADC]">
          {['All', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => {
          const count = orders.filter(o => o.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setFilterStatus(filterStatus === status ? 'All' : status)}
              className={`p-3 rounded-xl border text-center transition-all ${filterStatus === status ? 'border-[#1D3557] bg-[#1D3557]/5' : 'border-gray-200 bg-white hover:border-gray-300'}`}
            >
              <p className="text-xl font-bold text-gray-900">{count}</p>
              <p className="text-xs text-gray-500 capitalize">{status}</p>
            </button>
          );
        })}
      </div>

      <div className="flex gap-4">
        {/* Orders Table */}
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${selectedOrder ? 'flex-1' : 'w-full'}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Order</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Customer</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Items</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Total</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Payment</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Date</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(order => (
                  <tr key={order.id} className={`hover:bg-gray-50 transition-colors cursor-pointer ${selectedOrder?.id === order.id ? 'bg-blue-50' : ''}`} onClick={() => setSelectedOrder(order)}>
                    <td className="px-4 py-3 font-mono text-sm font-medium text-[#1D3557]">{order.orderNumber}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                      <p className="text-xs text-gray-400">{order.customerEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{order.items.reduce((s, i) => s + i.quantity, 0)} items</td>
                    <td className="px-4 py-3 font-semibold text-sm">₹{order.total.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${PAYMENT_COLORS[order.paymentStatus]}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={e => { e.stopPropagation(); setSelectedOrder(order); }} className="p-1.5 text-gray-400 hover:text-[#1D3557] hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-50" />
                No orders found
              </div>
            )}
          </div>
        </div>

        {/* Order Detail Panel */}
        {selectedOrder && (
          <div className="w-80 flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">{selectedOrder.orderNumber}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600 text-lg leading-none">&times;</button>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
              {/* Status Update */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-2">Update Status</label>
                <select
                  value={selectedOrder.status}
                  onChange={e => handleStatusChange(selectedOrder.id, e.target.value as Order['status'])}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A8DADC]"
                >
                  {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              {/* Customer */}
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Customer</p>
                <p className="font-medium text-sm">{selectedOrder.customerName}</p>
                <p className="text-xs text-gray-500">{selectedOrder.customerEmail}</p>
                <p className="text-xs text-gray-500">{selectedOrder.customerPhone}</p>
              </div>

              {/* Shipping Address */}
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Shipping To</p>
                <p className="text-sm">{selectedOrder.shippingAddress.address}</p>
                <p className="text-sm">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zip}</p>
                <p className="text-sm">{selectedOrder.shippingAddress.country}</p>
              </div>

              {/* Items */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Items</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <img src={item.image} alt={item.productName} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{item.productName}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-xs font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t border-gray-100 pt-3 space-y-1">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span><span>₹{selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping</span><span>{selectedOrder.shipping === 0 ? 'Free' : `₹{selectedOrder.shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between font-bold text-sm pt-1">
                  <span>Total</span><span>₹{selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {selectedOrder.trackingNumber && (
                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-xs font-semibold text-blue-600 uppercase mb-1">Tracking</p>
                  <p className="text-sm font-mono">{selectedOrder.trackingNumber}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
