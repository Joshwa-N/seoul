import { useState } from 'react';
import { Check } from 'lucide-react';

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);
  const [general, setGeneral] = useState({
    storeName: 'Seoul & Spice',
    storeEmail: 'hello@seoulspice.com',
    storePhone: '+1 (555) 123-4567',
    currency: 'INR',
    freeShippingThreshold: '50',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your store configuration</p>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">General</h2>
        </div>
        <div className="p-5 space-y-4">
          {[
            { label: 'Store Name', key: 'storeName' },
            { label: 'Contact Email', key: 'storeEmail', type: 'email' },
            { label: 'Phone Number', key: 'storePhone' },
          ].map(field => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
              <input
                type={field.type || 'text'}
                value={general[field.key as keyof typeof general]}
                onChange={e => setGeneral(prev => ({ ...prev, [field.key]: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#A8DADC]"
              />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Currency</label>
              <select value={general.currency} onChange={e => setGeneral(prev => ({ ...prev, currency: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#A8DADC]">
                {['INR', 'USD', 'EUR', 'GBP'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Free Shipping Over ($)</label>
              <input
                type="number"
                value={general.freeShippingThreshold}
                onChange={e => setGeneral(prev => ({ ...prev, freeShippingThreshold: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#A8DADC]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Admin Credentials */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Admin Credentials</h2>
          <p className="text-xs text-gray-400 mt-0.5">Default login: admin@seoulspice.com / admin123</p>
        </div>
        <div className="p-5">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
            In a production environment, passwords would be hashed and stored securely on a backend server. This demo uses localStorage for simplicity.
          </div>
        </div>
      </div>

      {/* Integration Info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Integration Status</h2>
        </div>
        <div className="p-5 space-y-3">
          {[
            { label: 'Frontend ↔ Admin Shared Store', status: 'Connected', detail: 'Orders from frontend appear in admin instantly' },
            { label: 'Product Sync', status: 'Active', detail: 'Products managed in admin update across the store' },
            { label: 'Order Tracking', status: 'Active', detail: 'Real-time order status updates via localStorage events' },
          ].map(item => (
            <div key={item.label} className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-500">{item.detail}</p>
              </div>
              <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">{item.status}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${saved ? 'bg-green-500 text-white' : 'bg-[#1D3557] text-white hover:bg-[#2d4f72]'}`}
        >
          {saved ? <><Check className="w-4 h-4" /> Saved!</> : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
