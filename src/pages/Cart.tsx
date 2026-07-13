import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Tag, X } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/context/CartContext';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 8;
  const total = subtotal + shipping - discount;

  const suggestedProducts = products
    .filter((p) => !items.some((item) => item.product.id === p.id))
    .slice(0, 4);

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === 'welcome20') {
      setPromoApplied(true);
      setDiscount(subtotal * 0.2);
      toast.success('Promo code applied! 20% off');
    } else {
      toast.error('Invalid promo code');
    }
  };

  const removePromo = () => {
    setPromoApplied(false);
    setDiscount(0);
    setPromoCode('');
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen pt-20 lg:pt-24 pb-16">
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-[#1D3557] mb-8">Shopping Cart</h1>
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-[#F8F9FA] rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-[#A8DADC]" />
              </div>
              <h2 className="text-2xl font-semibold text-[#1D3557] mb-2">Your cart is empty</h2>
              <p className="text-[#6C757D] mb-8">Looks like you haven't added anything to your cart yet.</p>
              <Link to="/products" className="btn-primary inline-flex items-center gap-2">
                Continue Shopping
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {suggestedProducts.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-bold text-[#1D3557] mb-8">You Might Like</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {suggestedProducts.map((product) => (
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

  return (
    <main className="min-h-screen pt-20 lg:pt-24 pb-16">
      <div className="section-padding">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-[#1D3557] mb-8">Shopping Cart</h1>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-[#E9ECEF] overflow-hidden">
                <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-[#F8F9FA] text-sm font-medium text-[#6C757D]">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-3 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Price</div>
                  <div className="col-span-1"></div>
                </div>

                <div className="divide-y divide-[#E9ECEF]">
                  {items.map((item) => (
                    <div key={item.product.id} className="p-4 sm:grid sm:grid-cols-12 sm:gap-4 items-center">
                      {/* Product */}
                      <div className="sm:col-span-6 flex gap-4 mb-4 sm:mb-0">
                        <Link
                          to={`/product/${item.product.id}`}
                          className="w-20 h-20 bg-[#F8F9FA] rounded-xl overflow-hidden flex-shrink-0"
                        >
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </Link>
                        <div>
                          <Link
                            to={`/product/${item.product.id}`}
                            className="font-medium text-[#1D3557] hover:text-[#F4A261] transition-colors line-clamp-1"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-[#6C757D] capitalize mt-1">{item.product.category}</p>
                          {item.selectedVariant &&
                            Object.entries(item.selectedVariant).map(([key, value]) => (
                              <p key={key} className="text-sm text-[#6C757D]">
                                {key}: {value}
                              </p>
                            ))}
                          {/* Mobile price */}
                          <p className="sm:hidden font-medium text-[#1D3557] mt-2">
                            ₹{item.product.price}
                          </p>
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="sm:col-span-3 flex items-center justify-between sm:justify-center gap-4 mb-4 sm:mb-0">
                        <span className="sm:hidden text-sm text-[#6C757D]">Quantity:</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-lg border border-[#E9ECEF] flex items-center justify-center hover:bg-[#F8F9FA] transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-lg border border-[#E9ECEF] flex items-center justify-center hover:bg-[#F8F9FA] transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="sm:col-span-2 text-right hidden sm:block">
                        <p className="font-medium text-[#1D3557]">
                          ₹{(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      {/* Remove */}
                      <div className="sm:col-span-1 text-right">
                        <button
                          onClick={() => {
                            removeFromCart(item.product.id);
                            toast.success('Item removed from cart');
                          }}
                          className="p-2 text-[#6C757D] hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => { clearCart(); toast.success('Cart cleared'); }}
                className="mt-4 text-sm text-[#6C757D] hover:text-red-500 transition-colors"
              >
                Clear Cart
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-[#E9ECEF] p-6 sticky top-24">
                <h2 className="text-xl font-bold text-[#1D3557] mb-6">Order Summary</h2>

                {/* Promo Code */}
                <div className="mb-6">
                  {!promoApplied ? (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6C757D]" />
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Promo code"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E9ECEF] focus:outline-none focus:ring-2 focus:ring-[#A8DADC] transition-all text-sm"
                        />
                      </div>
                      <button
                        onClick={handleApplyPromo}
                        disabled={!promoCode}
                        className="px-4 py-3 bg-[#F8F9FA] text-[#1D3557] font-medium rounded-xl hover:bg-[#E9ECEF] transition-colors disabled:opacity-50 text-sm"
                      >
                        Apply
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-[#A8DADC]/20 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-[#A8DADC]" />
                        <span className="text-sm font-medium text-[#1D3557]">WELCOME20 (-20%)</span>
                      </div>
                      <button onClick={removePromo} className="text-[#6C757D] hover:text-red-500">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-[#6C757D] mt-2">
                    Try code: <span className="font-medium">WELCOME20</span>
                  </p>
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-[#6C757D]">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#6C757D]">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-[#A8DADC]">
                      <span>Discount</span>
                      <span>-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-[#E9ECEF] flex justify-between">
                    <span className="font-semibold text-[#1D3557]">Total</span>
                    <span className="font-bold text-xl text-[#1D3557]">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>

                <Link
                  to="/products"
                  className="block text-center mt-4 text-sm text-[#6C757D] hover:text-[#1D3557] transition-colors"
                >
                  Continue Shopping
                </Link>

                <div className="mt-6 pt-6 border-t border-[#E9ECEF]">
                  <div className="flex items-center justify-center gap-4 text-xs text-[#6C757D]">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                      Secure Checkout
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                      Free Returns
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {suggestedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-[#1D3557] mb-8">You Might Also Like</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {suggestedProducts.map((product) => (
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