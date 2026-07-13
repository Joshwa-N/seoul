import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, Shield, Leaf, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/hooks/use-products';
import { collections } from '@/data/products';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  { icon: Truck, title: 'Free Shipping', description: 'On orders over ₹50' },
  { icon: Shield, title: 'Secure Payment', description: '100% secure checkout' },
  { icon: Leaf, title: 'Sustainable', description: 'Eco-friendly packaging' },
  { icon: Sparkles, title: 'Premium Quality', description: 'Curated with care' },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      gsap.fromTo(
        '.hero-content',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.3 }
      );

      // Section animations
      sectionsRef.current.forEach((section) => {
        if (section) {
          gsap.fromTo(
            section.querySelectorAll('.animate-item'),
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none none',
              },
            }
          );
        }
      });
    });

    return () => ctx.revert();
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Thank you for subscribing!');
  };

  const { products } = useProducts();
  const bestsellers = products.filter(p => p.isBestseller);
  const newArrivals = products.filter(p => p.isNew);
  const trendingProducts = products.slice(0, 8);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#A8DADC]/30 via-[#F8F9FA] to-[#F4A261]/20" />
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#A8DADC]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#F4A261]/20 rounded-full blur-3xl" />
        
        <div className="hero-content relative z-10 section-padding w-full">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <span className="inline-block px-4 py-2 bg-[#A8DADC]/30 text-[#1D3557] text-sm font-medium rounded-full mb-6">
                New Collection 2024
              </span>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#1D3557] leading-tight mb-6">
                SEOUL
                <span className="text-[#F4A261]"> & </span>
                SPICE
              </h1>
              <p className="text-lg text-[#6C757D] mb-8 max-w-md mx-auto lg:mx-0">
                Where Korean minimalism meets Indian warmth. Discover curated lifestyle products for the modern soul.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/products" className="btn-primary inline-flex items-center justify-center gap-2">
                  Shop Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/collections" className="btn-secondary inline-flex items-center justify-center">
                  Explore Collections
                </Link>
              </div>
            </div>
            
            <div className="relative hidden lg:block">
              <div className="relative aspect-[3/4] max-w-md mx-auto">
                <img
                  src="/images/hero-model.jpg"
                  alt="SEOUL & SPICE Lifestyle"
                  className="w-full h-full object-cover rounded-3xl shadow-2xl"
                />
                {/* Floating Card */}
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#A8DADC]/30 rounded-full flex items-center justify-center">
                      <Star className="w-6 h-6 text-[#F4A261] fill-[#F4A261]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1D3557]">4.9 Rating</p>
                      <p className="text-sm text-[#6C757D]">From 2,000+ reviews</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-[#1D3557]/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-[#1D3557]/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section 
        ref={(el) => { sectionsRef.current[0] = el; }}
        className="py-12 bg-white border-y border-[#E9ECEF]"
      >
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {features.map((feature) => (
                <div key={feature.title} className="animate-item flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#F8F9FA] rounded-xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-[#A8DADC]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#1D3557]">{feature.title}</p>
                    <p className="text-sm text-[#6C757D]">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section 
        ref={(el) => { sectionsRef.current[1] = el; }}
        className="py-20 lg:py-28"
      >
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 animate-item">
              <span className="text-sm font-medium text-[#F4A261] uppercase tracking-wider">
                Browse by Category
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#1D3557] mt-2">
                Our Collections
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {collections.map((collection) => (
                <Link
                  key={collection.id}
                  to={`/products?category=${collection.id}`}
                  className="animate-item group relative aspect-[4/5] rounded-2xl overflow-hidden"
                >
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {collection.name}
                    </h3>
                    <p className="text-white/70 text-sm">
                      {collection.productCount} Products
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section 
        ref={(el) => { sectionsRef.current[2] = el; }}
        className="py-20 lg:py-28 bg-[#F8F9FA]"
      >
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-12 animate-item">
              <div>
                <span className="text-sm font-medium text-[#F4A261] uppercase tracking-wider">
                  Most Popular
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold text-[#1D3557] mt-2">
                  Trending Now
                </h2>
              </div>
              <Link
                to="/products"
                className="hidden sm:flex items-center gap-2 text-[#1D3557] font-medium hover:text-[#F4A261] transition-colors"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingProducts.map((product) => (
                <div key={product.id} className="animate-item">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link to="/products" className="btn-secondary inline-flex items-center gap-2">
                View All Products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section 
        ref={(el) => { sectionsRef.current[3] = el; }}
        className="py-20 lg:py-28"
      >
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="relative bg-[#1D3557] rounded-3xl overflow-hidden animate-item">
              <div className="absolute inset-0 bg-gradient-to-r from-[#1D3557] via-[#1D3557]/95 to-transparent" />
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-30">
                <div className="absolute inset-0 bg-gradient-to-br from-[#A8DADC]/40 to-[#F4A261]/40" />
              </div>
              
              <div className="relative z-10 grid lg:grid-cols-2 gap-8 p-8 lg:p-16">
                <div>
                  <span className="inline-block px-4 py-2 bg-[#F4A261] text-white text-sm font-medium rounded-full mb-6">
                    Limited Time Offer
                  </span>
                  <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
                    Get 20% Off Your First Order
                  </h2>
                  <p className="text-white/70 text-lg mb-8 max-w-md">
                    Subscribe to our newsletter and receive exclusive discounts, early access to new arrivals, and beauty tips.
                  </p>
                  <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 px-5 py-3 rounded-full bg-white/10 border border-white/20 
                               text-white placeholder:text-white/50 focus:outline-none focus:ring-2 
                               focus:ring-[#A8DADC] transition-all"
                      required
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#A8DADC] text-[#1D3557] font-medium rounded-full
                               hover:bg-[#F4A261] hover:text-white transition-colors"
                    >
                      Subscribe
                    </button>
                  </form>
                </div>
                
                <div className="hidden lg:flex items-center justify-center">
                  <div className="relative">
                    <div className="w-48 h-48 bg-[#A8DADC]/30 rounded-full absolute -top-8 -left-8 blur-2xl" />
                    <div className="w-48 h-48 bg-[#F4A261]/30 rounded-full absolute -bottom-8 -right-8 blur-2xl" />
                    <img
                      src="/images/collection-beauty.jpg"
                      alt="Special Offer"
                      className="relative w-64 h-64 object-cover rounded-2xl shadow-2xl rotate-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section 
        ref={(el) => { sectionsRef.current[4] = el; }}
        className="py-20 lg:py-28 bg-[#F8F9FA]"
      >
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-12 animate-item">
              <div>
                <span className="text-sm font-medium text-[#F4A261] uppercase tracking-wider">
                  Just Landed
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold text-[#1D3557] mt-2">
                  New Arrivals
                </h2>
              </div>
              <Link
                to="/products?sort=newest"
                className="hidden sm:flex items-center gap-2 text-[#1D3557] font-medium hover:text-[#F4A261] transition-colors"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <div key={product.id} className="animate-item">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section 
        ref={(el) => { sectionsRef.current[5] = el; }}
        className="py-20 lg:py-28"
      >
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="animate-item">
                <span className="text-sm font-medium text-[#F4A261] uppercase tracking-wider">
                  Our Story
                </span>
                <h2 className="text-3xl lg:text-5xl font-bold text-[#1D3557] mt-2 mb-6">
                  East Meets West
                </h2>
                <div className="space-y-4 text-[#6C757D]">
                  <p>
                    SEOUL & SPICE was born from a simple idea: to bridge the gap between Korean minimalism and Indian warmth. We believe that the best of both worlds can create something truly special.
                  </p>
                  <p>
                    Our curated collection brings together the precision and innovation of Korean beauty and design with the rich colors, textures, and traditions of Indian craftsmanship.
                  </p>
                  <p>
                    Every product in our store is handpicked with care, ensuring it meets our standards of quality, sustainability, and aesthetic beauty.
                  </p>
                </div>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 mt-8 text-[#1D3557] font-medium hover:text-[#F4A261] transition-colors"
                >
                  Learn More About Us
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="animate-item relative">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden">
                  <img
                    src="/images/about-lifestyle.jpg"
                    alt="SEOUL & SPICE Story"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Stats */}
                <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-3xl font-bold text-[#1D3557]">20K+</p>
                      <p className="text-sm text-[#6C757D]">Happy Customers</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-[#1D3557]">500+</p>
                      <p className="text-sm text-[#6C757D]">Products</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section 
        ref={(el) => { sectionsRef.current[6] = el; }}
        className="py-20 lg:py-28 bg-[#F8F9FA]"
      >
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 animate-item">
              <span className="text-sm font-medium text-[#F4A261] uppercase tracking-wider">
                Customer Favorites
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#1D3557] mt-2">
                Bestsellers
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestsellers.map((product) => (
                <div key={product.id} className="animate-item">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
