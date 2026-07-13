import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Truck, Shield, ArrowLeft, ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useProduct, useProducts, getStockLabel, getMaxCartQty } from '@/hooks/use-products';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const { product, loading: productLoading } = useProduct(id);
  const { products: allProducts } = useProducts();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [isLiked, setIsLiked] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Get related products (same category, exclude current)
  const relatedProducts = allProducts
    .filter((p) => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);

  // Stock info
  const stockQty = (product as { stock?: number })?.stock;
  const maxQty = getMaxCartQty(stockQty);
  const stockLabel = getStockLabel(stockQty);

  useEffect(() => {
    if (!productLoading && !product) {
      navigate('/products');
    }
    window.scrollTo(0, 0);
  }, [product, productLoading, navigate]);

  if (productLoading) return (
    <main className="min-h-screen pt-20 lg:pt-24 pb-16 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#A8DADC] border-t-transparent rounded-full animate-spin" />
    </main>
  );

  if (!product) return null;

  const handleAddToCart = () => {
    if (maxQty === 0) { toast.error('This product is out of stock'); return; }
    if (quantity > maxQty) { toast.error(`Only ${maxQty} available`); return; }
    setIsAddingToCart(true);
    setTimeout(() => {
      addToCart(product, quantity, selectedVariants);
      toast.success(`${product.name} added to cart!`);
      setIsAddingToCart(false);
    }, 300);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  const handleVariantSelect = (variantId: string, option: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantId]: option,
    }));
  };

  const images = [product.image, product.image, product.image];

  return (
    <main className="min-h-screen pt-20 lg:pt-24 pb-16">
      <div className="section-padding">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-[#6C757D] hover:text-[#1D3557] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-[#F8F9FA] rounded-2xl overflow-hidden">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation Arrows */}
                <button
                  onClick={() => setSelectedImage((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setSelectedImage((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
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
                </div>
              </div>

              {/* Thumbnail Strip */}
              <div className="flex gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                      selectedImage === idx
                        ? 'border-[#A8DADC]'
                        : 'border-transparent hover:border-[#E9ECEF]'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <p className="text-sm text-[#6C757D] capitalize mb-1">
                      {product.category} • {product.subcategory}
                    </p>
                    <h1 className="text-2xl lg:text-3xl font-bold text-[#1D3557]">
                      {product.name}
                    </h1>
                  </div>
                  <button
                    onClick={handleLike}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isLiked
                        ? 'bg-red-500 text-white'
                        : 'bg-[#F8F9FA] text-[#1D3557] hover:bg-[#E9ECEF]'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'fill-[#F4A261] text-[#F4A261]'
                            : 'text-[#E9ECEF]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-[#6C757D]">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-[#1D3557]">
                  ₹{product.price}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-[#6C757D] line-through">
                      ₹{product.originalPrice}
                    </span>
                    <span className="px-2 py-1 bg-[#F4A261]/20 text-[#F4A261] text-sm font-medium rounded-full">
                      Save ₹{product.originalPrice - product.price}
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-[#6C757D]">{product.description}</p>

              {/* Variants */}
              {product.variants && product.variants.map((variant) => (
                <div key={variant.id}>
                  <p className="font-medium text-[#1D3557] mb-3">
                    {variant.name}: {selectedVariants[variant.id] || 'Select'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {variant.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleVariantSelect(variant.id, option)}
                        className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                          selectedVariants[variant.id] === option
                            ? 'border-[#A8DADC] bg-[#A8DADC]/10 text-[#1D3557]'
                            : 'border-[#E9ECEF] text-[#6C757D] hover:border-[#A8DADC]'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Quantity */}
              <div>
                <p className="font-medium text-[#1D3557] mb-3">Quantity</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="w-10 h-10 rounded-lg border border-[#E9ECEF] flex items-center justify-center hover:bg-[#F8F9FA] transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity((prev) => Math.min(maxQty, prev + 1))}
                    className="w-10 h-10 rounded-lg border border-[#E9ECEF] flex items-center justify-center hover:bg-[#F8F9FA] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stock Label */}
              {stockLabel && (
                <div className={`flex items-center gap-2 text-sm font-medium py-2 px-3 rounded-xl ${
                  maxQty === 0
                    ? 'bg-red-50 text-red-600'
                    : 'bg-orange-50 text-orange-600'
                }`}>
                  <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                  {stockLabel}
                </div>
              )}

              {/* Add to Cart */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={maxQty === 0 || isAddingToCart}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {isAddingToCart
                    ? 'Adding...'
                    : maxQty === 0
                    ? 'Out of Stock'
                    : 'Add to Cart'}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[#E9ECEF]">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-[#A8DADC]" />
                  <div>
                    <p className="font-medium text-sm text-[#1D3557]">Free Shipping</p>
                    <p className="text-xs text-[#6C757D]">On orders over ₹50</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[#A8DADC]" />
                  <div>
                    <p className="font-medium text-sm text-[#1D3557]">Secure Payment</p>
                    <p className="text-xs text-[#6C757D]">100% secure checkout</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start border-b border-[#E9ECEF] rounded-none bg-transparent h-auto p-0">
                <TabsTrigger
                  value="description"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#A8DADC] data-[state=active]:bg-transparent py-4 px-6"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="features"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#A8DADC] data-[state=active]:bg-transparent py-4 px-6"
                >
                  Features
                </TabsTrigger>
                <TabsTrigger
                  value="shipping"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#A8DADC] data-[state=active]:bg-transparent py-4 px-6"
                >
                  Shipping & Returns
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="pt-6">
                <div className="max-w-3xl">
                  <p className="text-[#6C757D] leading-relaxed">{product.description}</p>
                  <p className="text-[#6C757D] leading-relaxed mt-4">
                    Experience the perfect blend of Korean innovation and timeless elegance. 
                    This product is carefully crafted to deliver exceptional results while 
                    being gentle on your skin and the environment.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="features" className="pt-6">
                <div className="max-w-3xl">
                  {product.features ? (
                    <ul className="grid sm:grid-cols-2 gap-3">
                      {product.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-3 text-[#6C757D]"
                        >
                          <span className="w-2 h-2 bg-[#A8DADC] rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[#6C757D]">No specific features listed.</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="shipping" className="pt-6">
                <div className="max-w-3xl space-y-4 text-[#6C757D]">
                  <div>
                    <h4 className="font-medium text-[#1D3557] mb-2">Shipping</h4>
                    <p>We offer free standard shipping on all orders over ₹50. Standard delivery takes 5-7 business days. Express shipping (2-3 business days) is available for ₹15.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#1D3557] mb-2">Returns</h4>
                    <p>We accept returns within 30 days of purchase. Items must be unused and in original packaging. Beauty products must be unopened for hygiene reasons.</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-[#1D3557] mb-8">
                You May Also Like
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}