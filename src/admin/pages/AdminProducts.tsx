import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Pencil, Trash2, AlertTriangle, Package, RefreshCw } from 'lucide-react';
import { productsApi, type ApiProduct } from '@/lib/api';
import { toast } from 'sonner';

type StoreProduct = ApiProduct & { stock: number; sku: string; status: 'active' | 'draft' | 'archived'; salesCount: number; createdAt: string; updatedAt: string; };

const STATUS_COLORS = {
  active: 'bg-green-100 text-green-700',
  draft: 'bg-gray-100 text-gray-600',
  archived: 'bg-red-100 text-red-600',
};

export default function AdminProducts() {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const [showEditModal, setShowEditModal] = useState<StoreProduct | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const { products: active } = await productsApi.getAll({});
      const { products: draft } = await productsApi.getAll({ status: 'draft' }).catch(() => ({ products: [] }));
      const { products: archived } = await productsApi.getAll({ status: 'archived' }).catch(() => ({ products: [] }));
      const combined = [...active, ...draft, ...archived];
      const unique = Array.from(new Map(combined.map(p => [p.id, p])).values());
      setProducts(unique as StoreProduct[]);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || (p.sku || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === 'All' || p.category === filterCategory;
    const matchStatus = filterStatus === 'All' || p.status === filterStatus;
    return matchSearch && matchCat && matchStatus;
  });

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const handleDelete = async (id: number) => {
    try {
      await productsApi.delete(id);
      toast.success('Product deleted');
      setShowDeleteModal(null);
      refresh();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const handleSave = async (p: Partial<StoreProduct>) => {
    setSaving(true);
    try {
      if (p.id && p.id > 0) {
        await productsApi.update(p.id, p);
        toast.success('Product updated');
      } else {
        await productsApi.create(p);
        toast.success('Product created');
      }
      setShowEditModal(null);
      setShowAddModal(false);
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} of {products.length} products</p>
        </div>
        <div className="flex gap-2">
          <button onClick={refresh} className="p-2 border border-gray-200 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-[#1D3557] text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-[#2d4f72] transition-colors">
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#A8DADC]" />
        </div>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#A8DADC]">
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#A8DADC]">
          {['All', 'active', 'draft', 'archived'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-[#A8DADC] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Product', 'SKU', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        <div>
                          <p className="font-medium text-sm text-gray-900">{p.name}</p>
                          <p className="text-xs text-gray-400">{p.subcategory}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 font-mono">{p.sku}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{p.category}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-sm">₹{p.price}</span>
                      {p.cost && <span className="text-xs text-gray-400 block">Cost: ₹{p.cost}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${(p.stock ?? 0) <= 5 ? 'text-red-600' : (p.stock ?? 0) <= 10 ? 'text-amber-600' : 'text-gray-900'}`}>
                        {p.stock ?? 0}
                        {(p.stock ?? 0) <= 5 && <AlertTriangle className="w-3 h-3 inline ml-1" />}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[p.status ?? 'active']}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setShowEditModal(p)} className="p-1.5 text-gray-400 hover:text-[#1D3557] hover:bg-blue-50 rounded-lg transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setShowDeleteModal(p.id!)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                No products found
              </div>
            )}
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Delete Product</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteModal(null)} className="flex-1 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(showDeleteModal)} className="flex-1 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {(showEditModal || showAddModal) && (
        <ProductModal
          product={showEditModal}
          saving={saving}
          onSave={handleSave}
          onClose={() => { setShowEditModal(null); setShowAddModal(false); }}
        />
      )}
    </div>
  );
}

function ProductModal({ product, onSave, onClose, saving }: {
  product: StoreProduct | null;
  onSave: (p: Partial<StoreProduct>) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const isNew = !product;
  const [form, setForm] = useState<Partial<StoreProduct>>(product || {
    name: '', price: 0, category: 'Beauty', subcategory: '', image: '/images/product-1.jpg',
    rating: 4.5, reviewCount: 0, description: '', inStock: true, stock: 0,
    status: 'active', sku: `SKU-${Date.now()}`, cost: 0, salesCount: 0,
  });

  const set = (field: string, value: string | number | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl my-4">
        <h3 className="font-bold text-lg text-gray-900 mb-4">{isNew ? 'Add Product' : 'Edit Product'}</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Product Name *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A8DADC]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Price (₹) *</label>
              <input type="number" value={form.price} onChange={e => set('price', Number(e.target.value))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A8DADC]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Cost (₹)</label>
              <input type="number" value={form.cost || ''} onChange={e => set('cost', Number(e.target.value))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A8DADC]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Stock *</label>
              <input type="number" min="0" value={form.stock ?? 0} onChange={e => set('stock', Number(e.target.value))} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A8DADC]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">SKU</label>
              <input value={form.sku} onChange={e => set('sku', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A8DADC]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A8DADC]">
                {['Beauty', 'Fashion', 'Home', 'Food'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value as 'active' | 'draft' | 'archived')} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A8DADC]">
                {['active', 'draft', 'archived'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="col-span-2 flex items-center gap-4 flex-wrap">
              {[['inStock', 'In Stock'], ['isBestseller', 'Bestseller'], ['isNew', 'New']].map(([field, label]) => (
                <label key={field} className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={!!(form as Record<string, unknown>)[field]} onChange={e => set(field, e.target.checked)} className="w-4 h-4 accent-[#1D3557]" />
                  {label}
                </label>
              ))}
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
              <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A8DADC] resize-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Image Path</label>
              <input value={form.image} onChange={e => set('image', e.target.value)} placeholder="/images/product-1.jpg" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#A8DADC]" />
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={() => onSave(form)} disabled={saving} className="flex-1 py-2.5 bg-[#1D3557] text-white rounded-xl text-sm font-medium hover:bg-[#2d4f72] transition-colors disabled:opacity-50">
            {saving ? 'Saving...' : isNew ? 'Add Product' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
