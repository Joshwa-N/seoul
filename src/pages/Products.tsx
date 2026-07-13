import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, Grid3X3, LayoutList } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/use-products';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const categories = ['All', 'Beauty', 'Fashion', 'Home'];
const subcategories: Record<string, string[]> = {
  Beauty: ['Skincare', 'Makeup'],
  Fashion: ['Tops', 'Bottoms', 'Accessories'],
  Home: ['Kitchen', 'Bath', 'Decor'],
};

export default function Products() {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(() => {
    const raw = searchParams.get('category') || 'All';
    return categories.find((c) => c.toLowerCase() === raw.toLowerCase()) || 'All';
  });
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'featured');

  // Sync category from URL on navigation
  useEffect(() => {
    const raw = searchParams.get('category') || 'All';
    const normalized = categories.find((c) => c.toLowerCase() === raw.toLowerCase()) || 'All';
    setSelectedCategory(normalized);
    setSelectedSubcategories([]);
  }, [searchParams]);

  // Update URL when filters change — preserve search param
  useEffect(() => {
    const params = new URLSearchParams();
    const currentSearch = searchParams.get('search');
    if (currentSearch) params.set('search', currentSearch);
    if (selectedCategory !== 'All') params.set('category', selectedCategory);
    if (sortBy !== 'featured') params.set('sort', sortBy);
    setSearchParams(params);
  }, [selectedCategory, sortBy, setSearchParams]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter from URL
    const searchQuery = searchParams.get('search')?.toLowerCase().trim();
    if (searchQuery) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchQuery) ||
        p.category.toLowerCase().includes(searchQuery) ||
        p.subcategory?.toLowerCase().includes(searchQuery) ||
        p.description?.toLowerCase().includes(searchQuery)
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Subcategory filter
    if (selectedSubcategories.length > 0) {
      result = result.filter((p) =>
        selectedSubcategories.includes(p.subcategory || '')
      );
    }

    // Price filter
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return result;
  }, [products, selectedCategory, selectedSubcategories, priceRange, sortBy, searchParams]);

  const toggleSubcategory = (sub: string) => {
    setSelectedSubcategories((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub]
    );
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedSubcategories([]);
    setPriceRange([0, 500]);
    setSortBy('featured');
    // Also clear search param
    const params = new URLSearchParams();
    setSearchParams(params);
  };

  const activeFiltersCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    selectedSubcategories.length +
    (priceRange[0] > 0 || priceRange[1] < 500 ? 1 : 0);

  const searchQuery = searchParams.get('search');

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Category Filter */}
      <div>
        <h4 className="font-semibold text-[#1D3557] mb-4">Category</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedSubcategories([]);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#A8DADC]/20 text-[#1D3557] font-medium'
                  : 'text-[#6C757D] hover:bg-[#F8F9FA]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Subcategory Filter */}
      {selectedCategory !== 'All' && subcategories[selectedCategory] && (
        <div>
          <h4 className="font-semibold text-[#1D3557] mb-4">Subcategory</h4>
          <div className="space-y-2">
            {subcategories[selectedCategory].map((sub) => (
              <label
                key={sub}
                className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[#F8F9FA] rounded-lg transition-colors"
              >
                <Checkbox
                  checked={selectedSubcategories.includes(sub)}
                  onCheckedChange={() => toggleSubcategory(sub)}
                />
                <span className="text-[#6C757D]">{sub}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Filter */}
      <div>
        <h4 className="font-semibold text-[#1D3557] mb-4">Price Range</h4>
        <Slider
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          max={500}
          step={5}
          className="mb-4"
        />
        <div className="flex items-center justify-between text-sm text-[#6C757D]">
          <span>₹{priceRange[0]}</span>
          <span>₹{priceRange[1]}</span>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen pt-20 lg:pt-24 pb-16">
      <div className="section-padding">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-[#1D3557] mb-2">
              {searchQuery ? `Search: "${searchQuery}"` : 'All Products'}
            </h1>
            <p className="text-[#6C757D]">{filteredProducts.length} products found</p>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#E9ECEF]">
            {/* Mobile Filter Button */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <button className="lg:hidden flex items-center gap-2 px-4 py-2 border border-[#E9ECEF] rounded-lg hover:bg-[#F8F9FA] transition-colors">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="w-5 h-5 bg-[#F4A261] text-white text-xs rounded-full flex items-center justify-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  {activeFiltersCount > 0 && (
                    <button onClick={clearFilters} className="text-sm text-[#F4A261] hover:underline">
                      Clear All
                    </button>
                  )}
                </div>
                <FilterContent />
              </SheetContent>
            </Sheet>

            {/* Desktop: Active Filters */}
            <div className="hidden lg:flex items-center gap-2 flex-wrap">
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#F4A261]/20 text-[#1D3557] text-sm rounded-full">
                  🔍 {searchQuery}
                  <button
                    onClick={() => {
                      const params = new URLSearchParams(searchParams);
                      params.delete('search');
                      setSearchParams(params);
                    }}
                    className="hover:text-[#F4A261]"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#A8DADC]/20 text-[#1D3557] text-sm rounded-full">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')} className="hover:text-[#F4A261]">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedSubcategories.map((sub) => (
                <span
                  key={sub}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-[#A8DADC]/20 text-[#1D3557] text-sm rounded-full"
                >
                  {sub}
                  <button onClick={() => toggleSubcategory(sub)} className="hover:text-[#F4A261]">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {(priceRange[0] > 0 || priceRange[1] < 500) && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#A8DADC]/20 text-[#1D3557] text-sm rounded-full">
                  ₹{priceRange[0]} - ₹{priceRange[1]}
                  <button onClick={() => setPriceRange([0, 500])} className="hover:text-[#F4A261]">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {(activeFiltersCount > 0 || searchQuery) && (
                <button onClick={clearFilters} className="text-sm text-[#F4A261] hover:underline ml-2">
                  Clear All
                </button>
              )}
            </div>

            {/* Sort and View */}
            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>

              <div className="hidden sm:flex items-center border border-[#E9ECEF] rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-l-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-[#A8DADC]/20 text-[#1D3557]'
                      : 'text-[#6C757D] hover:bg-[#F8F9FA]'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-r-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-[#A8DADC]/20 text-[#1D3557]'
                      : 'text-[#6C757D] hover:bg-[#F8F9FA]'
                  }`}
                >
                  <LayoutList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg">Filters</h3>
                  {activeFiltersCount > 0 && (
                    <button onClick={clearFilters} className="text-sm text-[#F4A261] hover:underline">
                      Clear
                    </button>
                  )}
                </div>
                <FilterContent />
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              {filteredProducts.length > 0 ? (
                <div
                  className={`grid gap-6 ${
                    viewMode === 'grid'
                      ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                      : 'grid-cols-1'
                  }`}
                >
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-lg text-[#6C757D] mb-4">
                    No products found matching your filters.
                  </p>
                  <button onClick={clearFilters} className="btn-primary">
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}