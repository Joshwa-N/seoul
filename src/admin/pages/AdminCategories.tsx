import { useState, useEffect } from 'react';
import { getProducts } from '@/lib/store';

const DEFAULT_CATEGORIES = [
  { id: 'beauty', name: 'K-Beauty', description: 'Skincare, makeup and beauty products', color: '#F8C8DC', visible: true },
  { id: 'fashion', name: 'Seoul Fashion', description: 'Clothing and accessories', color: '#A8DADC', visible: true },
  { id: 'home', name: 'Home Living', description: 'Home decor and essentials', color: '#E9D5FF', visible: true },
  { id: 'food', name: 'Spice Pantry', description: 'Korean food and spices', color: '#F4A261', visible: true },
];

export default function AdminCategories() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [products, setProducts] = useState<ReturnType<typeof getProducts>>([]);

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const getProductCount = (catId: string) => products.filter(p => p.category.toLowerCase() === catId).length;

  const toggleVisibility = (id: string) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, visible: !c.visible } : c));
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-0.5">{categories.length} categories</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4">
        {categories.map(cat => {
          const count = getProductCount(cat.id);
          return (
            <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: cat.color + '40' }}>
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: cat.color }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                    <p className="text-sm text-gray-500">{count} products</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleVisibility(cat.id)}
                  className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${cat.visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                >
                  {cat.visible ? 'Visible' : 'Hidden'}
                </button>
              </div>
              <p className="text-sm text-gray-500">{cat.description}</p>
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full"
                      style={{ width: `${Math.min(100, (count / Math.max(...categories.map(c => getProductCount(c.id)), 1)) * 100)}%`, backgroundColor: cat.color }}
                    />
                  </div>
                  <span className="text-xs text-gray-400">{count} items</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Products by Category</h2>
        <div className="space-y-3">
          {categories.map(cat => {
            const count = getProductCount(cat.id);
            const total = products.length;
            return (
              <div key={cat.id} className="flex items-center gap-4">
                <div className="w-24 text-sm text-gray-600 font-medium">{cat.name}</div>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ width: `${total > 0 ? (count / total) * 100 : 0}%`, backgroundColor: cat.color }}
                  />
                </div>
                <div className="w-16 text-right text-sm text-gray-500">{count} ({total > 0 ? Math.round((count / total) * 100) : 0}%)</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
