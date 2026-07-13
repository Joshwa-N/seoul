import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { collections, products } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Collections() {
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
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

  // Get featured products from each collection
  const getCollectionProducts = (collectionId: string) => {
    return products
      .filter((p) => p.category.toLowerCase() === collectionId.toLowerCase())
      .slice(0, 4);
  };

  return (
    <main className="min-h-screen pt-20 lg:pt-24 pb-16">
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-[#A8DADC]/20 via-[#F8F9FA] to-[#F4A261]/10">
        <div className="section-padding">
          <div className="max-w-7xl mx-auto text-center">
            <span className="text-sm font-medium text-[#F4A261] uppercase tracking-wider">
              Curated for You
            </span>
            <h1 className="text-4xl lg:text-6xl font-bold text-[#1D3557] mt-4 mb-6">
              Our Collections
            </h1>
            <p className="text-lg text-[#6C757D] max-w-2xl mx-auto">
              Discover carefully curated collections that blend Korean minimalism 
              with Indian warmth. Each collection tells a unique story.
            </p>
          </div>
        </div>
      </section>

      {/* Collection Banners */}
      <section 
        ref={(el) => { sectionsRef.current[0] = el; }}
        className="py-16 lg:py-24"
      >
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {collections.slice(0, 2).map((collection, index) => (
                <Link
                  key={collection.id}
                  to={`/products?category=${collection.id}`}
                  className={`animate-item group relative aspect-[4/3] lg:aspect-[16/10] rounded-3xl overflow-hidden ${
                    index === 0 ? 'lg:row-span-2' : ''
                  }`}
                >
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                    <span 
                      className="inline-block px-3 py-1 text-xs font-medium rounded-full mb-3"
                      style={{ backgroundColor: collection.color, color: '#1D3557' }}
                    >
                      {collection.productCount} Products
                    </span>
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                      {collection.name}
                    </h2>
                    <p className="text-white/80 text-sm lg:text-base mb-4 max-w-md">
                      {collection.description}
                    </p>
                    <span className="inline-flex items-center gap-2 text-white font-medium group-hover:gap-3 transition-all">
                      Explore Collection
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-8 mt-8">
              {collections.slice(2).map((collection) => (
                <Link
                  key={collection.id}
                  to={`/products?category=${collection.id}`}
                  className="animate-item group relative aspect-[16/10] rounded-3xl overflow-hidden"
                >
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                    <span 
                      className="inline-block px-3 py-1 text-xs font-medium rounded-full mb-3"
                      style={{ backgroundColor: collection.color, color: '#1D3557' }}
                    >
                      {collection.productCount} Products
                    </span>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {collection.name}
                    </h2>
                    <p className="text-white/80 text-sm mb-4">
                      {collection.description}
                    </p>
                    <span className="inline-flex items-center gap-2 text-white font-medium group-hover:gap-3 transition-all">
                      Explore Collection
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Collection Products */}
      {collections.map((collection, idx) => {
        const collectionProducts = getCollectionProducts(collection.id);
        if (collectionProducts.length === 0) return null;

        return (
          <section
            key={collection.id}
            ref={(el) => { sectionsRef.current[idx + 1] = el; }}
            className={`py-16 lg:py-24 ${idx % 2 === 0 ? 'bg-[#F8F9FA]' : ''}`}
          >
            <div className="section-padding">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-end justify-between mb-8 animate-item">
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-[#1D3557]">
                      {collection.name}
                    </h2>
                    <p className="text-[#6C757D] mt-1">
                      {collection.description}
                    </p>
                  </div>
                  <Link
                    to={`/products?category=${collection.id}`}
                    className="hidden sm:flex items-center gap-2 text-[#1D3557] font-medium hover:text-[#F4A261] transition-colors"
                  >
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {collectionProducts.map((product) => (
                    <div key={product.id} className="animate-item">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>

                <div className="mt-8 text-center sm:hidden">
                  <Link
                    to={`/products?category=${collection.id}`}
                    className="btn-secondary inline-flex items-center gap-2"
                  >
                    View All {collection.name}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="relative bg-[#1D3557] rounded-3xl overflow-hidden p-8 lg:p-16 text-center">
              <div className="absolute inset-0 bg-gradient-to-r from-[#A8DADC]/20 to-[#F4A261]/20" />
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                  Can't Decide?
                </h2>
                <p className="text-white/70 text-lg mb-8">
                  Browse our complete catalog and find exactly what you're looking for.
                </p>
                <Link to="/products" className="btn-primary inline-flex items-center gap-2 bg-[#A8DADC] text-[#1D3557] hover:bg-[#F4A261] hover:text-white">
                  Shop All Products
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
