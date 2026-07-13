import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, Shield, Check, ChevronRight, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/context/CartContext';
import { createOrder } from '@/lib/store';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getCartTotal, clearCart } = useCart();
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  });

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 8;
  const total = subtotal + shipping;

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
    window.scrollTo(0, 0);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Save order to shared store (visible in admin panel)
    const order = createOrder({
      customerName: shippingData.firstName + ' ' + shippingData.lastName,
      customerEmail: shippingData.email,
      customerPhone: shippingData.phone,
      shippingAddress: {
        address: shippingData.address,
        city: shippingData.city,
        state: shippingData.state,
        zip: shippingData.zip,
        country: shippingData.country,
      },
      items: items.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        image: item.product.image,
        quantity: item.quantity,
        price: item.product.price,
        selectedVariant: item.selectedVariant,
      })),
      subtotal,
      shipping,
      total,
      status: 'pending',
      paymentStatus: 'paid',
    });
    clearCart();
    toast.success('Order ' + order.orderNumber + ' placed successfully!');
    navigate('/');
  };

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setShippingData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <main className="min-h-screen pt-20 lg:pt-24 pb-16 bg-[#F8F9FA]">
      <div className="section-padding">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1D3557] mb-4">Checkout</h1>
            
            {/* Progress */}
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 ${step === 'shipping' ? 'text-[#1D3557]' : 'text-[#6C757D]'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'shipping' ? 'bg-[#A8DADC] text-[#1D3557]' : 'bg-[#1D3557] text-white'}`}>
                  {step === 'payment' ? <Check className="w-4 h-4" /> : '1'}
                </div>
                <span className="font-medium">Shipping</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#6C757D]" />
              <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-[#1D3557]' : 'text-[#6C757D]'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'payment' ? 'bg-[#A8DADC] text-[#1D3557]' : 'bg-[#E9ECEF] text-[#6C757D]'}`}>
                  2
                </div>
                <span className="font-medium">Payment</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              {step === 'shipping' ? (
                <form onSubmit={handleShippingSubmit} className="bg-white rounded-2xl border border-[#E9ECEF] p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Truck className="w-5 h-5 text-[#A8DADC]" />
                    <h2 className="text-xl font-bold text-[#1D3557]">Shipping Information</h2>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#1D3557] mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={shippingData.firstName}
                        onChange={handleShippingChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] focus:outline-none focus:ring-2 focus:ring-[#A8DADC] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1D3557] mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={shippingData.lastName}
                        onChange={handleShippingChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] focus:outline-none focus:ring-2 focus:ring-[#A8DADC] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1D3557] mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={shippingData.email}
                        onChange={handleShippingChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] focus:outline-none focus:ring-2 focus:ring-[#A8DADC] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1D3557] mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={shippingData.phone}
                        onChange={handleShippingChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] focus:outline-none focus:ring-2 focus:ring-[#A8DADC] transition-all"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-[#1D3557] mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={shippingData.address}
                        onChange={handleShippingChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] focus:outline-none focus:ring-2 focus:ring-[#A8DADC] transition-all"
                        placeholder="Street address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1D3557] mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingData.city}
                        onChange={handleShippingChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] focus:outline-none focus:ring-2 focus:ring-[#A8DADC] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1D3557] mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={shippingData.state}
                        onChange={handleShippingChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] focus:outline-none focus:ring-2 focus:ring-[#A8DADC] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1D3557] mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        name="zip"
                        value={shippingData.zip}
                        onChange={handleShippingChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] focus:outline-none focus:ring-2 focus:ring-[#A8DADC] transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1D3557] mb-2">
                        Country *
                      </label>
                      <select
                        name="country"
                        value={shippingData.country}
                        onChange={handleShippingChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] focus:outline-none focus:ring-2 focus:ring-[#A8DADC] transition-all"
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="AU">Australia</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-8 btn-primary flex items-center justify-center gap-2"
                  >
                    Continue to Payment
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handlePaymentSubmit} className="bg-white rounded-2xl border border-[#E9ECEF] p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <CreditCard className="w-5 h-5 text-[#A8DADC]" />
                    <h2 className="text-xl font-bold text-[#1D3557]">Payment Information</h2>
                  </div>

                  {/* Payment Methods */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <button
                      type="button"
                      className="p-4 border-2 border-[#A8DADC] rounded-xl flex flex-col items-center gap-2"
                    >
                      <CreditCard className="w-6 h-6 text-[#A8DADC]" />
                      <span className="text-sm font-medium">Card</span>
                    </button>
                    <button
                      type="button"
                      className="p-4 border border-[#E9ECEF] rounded-xl flex flex-col items-center gap-2 opacity-50"
                      disabled
                    >
                      <span className="text-lg font-bold">Pay</span>
                      <span className="text-sm">Apple Pay</span>
                    </button>
                    <button
                      type="button"
                      className="p-4 border border-[#E9ECEF] rounded-xl flex flex-col items-center gap-2 opacity-50"
                      disabled
                    >
                      <span className="text-lg font-bold">GPay</span>
                      <span className="text-sm">Google Pay</span>
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-[#1D3557] mb-2">
                        Card Number *
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6C757D]" />
                        <input
                          type="text"
                          name="cardNumber"
                          value={paymentData.cardNumber}
                          onChange={handlePaymentChange}
                          required
                          placeholder="1234 5678 9012 3456"
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#E9ECEF] focus:outline-none focus:ring-2 focus:ring-[#A8DADC] transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1D3557] mb-2">
                        Cardholder Name *
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={paymentData.cardName}
                        onChange={handlePaymentChange}
                        required
                        placeholder="Name on card"
                        className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] focus:outline-none focus:ring-2 focus:ring-[#A8DADC] transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-[#1D3557] mb-2">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          name="expiry"
                          value={paymentData.expiry}
                          onChange={handlePaymentChange}
                          required
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] focus:outline-none focus:ring-2 focus:ring-[#A8DADC] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1D3557] mb-2">
                          CVV *
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6C757D]" />
                          <input
                            type="text"
                            name="cvv"
                            value={paymentData.cvv}
                            onChange={handlePaymentChange}
                            required
                            placeholder="123"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E9ECEF] focus:outline-none focus:ring-2 focus:ring-[#A8DADC] transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button
                      type="button"
                      onClick={() => setStep('shipping')}
                      className="px-6 py-3 border border-[#E9ECEF] rounded-full font-medium hover:bg-[#F8F9FA] transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isProcessing}
                      className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        'Processing...'
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          Complete Order - ₹{total.toFixed(2)}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-[#E9ECEF] p-6 sticky top-24">
                <h2 className="text-xl font-bold text-[#1D3557] mb-6">
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-4 mb-6 max-h-64 overflow-auto">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-4">
                      <div className="w-16 h-16 bg-[#F8F9FA] rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#1D3557] text-sm line-clamp-1">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-[#6C757D]">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium text-[#1D3557] text-sm">
                        ₹{(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 pt-6 border-t border-[#E9ECEF]">
                  <div className="flex justify-between text-[#6C757D]">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#6C757D]">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `₹{shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="pt-3 border-t border-[#E9ECEF] flex justify-between">
                    <span className="font-semibold text-[#1D3557]">Total</span>
                    <span className="font-bold text-xl text-[#1D3557]">
                      ₹{total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Security */}
                <div className="mt-6 pt-6 border-t border-[#E9ECEF]">
                  <div className="flex items-center justify-center gap-2 text-sm text-[#6C757D]">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Secure SSL Encryption</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
