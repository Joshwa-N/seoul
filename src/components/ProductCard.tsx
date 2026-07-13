import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { getStockLabel } from '@/hooks/use-products';
import type { ApiProduct } from '@/lib/api';

type AnyProduct = Product | ApiProduct;

interface ProductCardProps {
  product: AnyProduct;
  showQuickAdd?: boolean;
}

export default function ProductCard({ product, showQuickAdd = true }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { addToCart } = useCart();

  const stock = (product as { stock?: number }).stock;
  const stockLabel = getStockLabel(stock);
  const isOutOfStock = stock !== undefined ? stock === 0 : !product.inStock;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) { toast.error('Out of stock'); return; }
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] bg-[#F8F9FA] rounded-2xl overflow-hidden mb-4">
        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="px-3 py-1 bg-[#A8DADC] text-[#1D3557] text-xs font-medium rounded-full">
              New
            </span>
          )}
          {product.isBestseller && (
            <span className="px-3 py-1 bg-[#F4A261] text-white text-xs font-medium rounded-full">
              Bestseller
            </span>
          )}
          {product.originalPrice && (
            <span className="px-3 py-1 bg-[#1D3557] text-white text-xs font-medium rounded-full">
              Sale
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div
          className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
          }`}
        >
          <button
            onClick={handleLike}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              isLiked
                ? 'bg-red-500 text-white'
                : 'bg-white text-[#1D3557] hover:bg-[#F8F9FA]'
            }`}
            aria-label="Add to wishlist"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Quick Add Button */}
        {showQuickAdd && (
          <div
            className={`absolute bottom-4 left-4 right-4 transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <button
              onClick={handleQuickAdd}
              disabled={isOutOfStock}
              className="w-full py-3 bg-white text-[#1D3557] font-medium rounded-full
                       flex items-center justify-center gap-2 hover:bg-[#1D3557] 
                       hover:text-white transition-colors shadow-lg disabled:opacity-50 
                       disabled:cursor-not-allowed"
            >
              <ShoppingBag className="w-4 h-4" />
              {isOutOfStock ? 'Out of Stock' : 'Quick Add'}
            </button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-[#1D3557] group-hover:text-[#F4A261] transition-colors line-clamp-1">
            {product.name}
          </h3>
        </div>
        
        <p className="text-sm text-[#6C757D] capitalize">
          {product.category} • {product.subcategory}
        </p>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-[#F4A261] text-[#F4A261]" />
            <span className="text-sm font-medium text-[#1D3557]">{product.rating}</span>
          </div>
          <span className="text-sm text-[#6C757D]">({product.reviewCount})</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#1D3557]">₹{product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-[#6C757D] line-through">
              ₹{product.originalPrice}
            </span>
          )}
        </div>

        {/* Low Stock Indicator */}
        {stockLabel && (
          <p className={`text-xs font-medium ${stock === 0 ? 'text-red-500' : 'text-orange-500'}`}>
            {stockLabel}
          </p>
        )}
      </div>
    </Link>
  );
}