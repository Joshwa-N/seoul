import { useEffect, useRef } from 'react';
import { Leaf, Heart, Sparkles, Users, Globe, Award } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const values = [
  {
    icon: Leaf,
    title: 'Sustainability',
    description: 'We prioritize eco-friendly materials and packaging, ensuring our products are kind to both you and the planet.',
  },
  {
    icon: Heart,
    title: 'Quality First',
    description: 'Every product is carefully curated and tested to meet our high standards of excellence.',
  },
  {
    icon: Sparkles,
    title: 'Innovation',
    description: 'We bring you the latest trends and innovations from Korea, blended with timeless Indian craftsmanship.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'We believe in building a community of like-minded individuals who appreciate beauty and quality.',
  },
  {
    icon: Globe,
    title: 'Cultural Bridge',
    description: 'Our mission is to connect cultures through thoughtfully curated lifestyle products.',
  },
  {
    icon: Award,
    title: 'Authenticity',
    description: 'We work directly with brands and artisans to ensure genuine, high-quality products.',
  },
];

const stats = [
  { value: '20K+', label: 'Happy Customers' },
  { value: '500+', label: 'Products' },
  { value: '50+', label: 'Brand Partners' },
  { value: '4.9', label: 'Average Rating' },
];

export default function About() {
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

  return (
    <main className="min-h-screen pt-20 lg:pt-24 pb-16">
      {/* Hero */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-[#A8DADC]/20 via-[#F8F9FA] to-[#F4A261]/10">
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-sm font-medium text-[#F4A261] uppercase tracking-wider">
                  Our Story
                </span>
                <h1 className="text-4xl lg:text-6xl font-bold text-[#1D3557] mt-4 mb-6">
                  East Meets West
                </h1>
                <p className="text-lg text-[#6C757D] mb-6">
                  SEOUL & SPICE was born from a passion for bringing together the best of two vibrant cultures. We believe that beauty knows no borders.
                </p>
                <p className="text-[#6C757D]">
                  Our journey began with a simple idea: to share the innovative spirit of Korean beauty and design with the rich heritage of Indian craftsmanship. Today, we're proud to curate a collection that celebrates this beautiful fusion.
                </p>
              </div>
              <div className="relative">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden">
                  <img
                    src="/images/about-lifestyle.jpg"
                    alt="SEOUL & SPICE Story"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section 
        ref={(el) => { sectionsRef.current[0] = el; }}
        className="py-16 lg:py-20 bg-[#1D3557]"
      >
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="animate-item text-center">
                  <p className="text-4xl lg:text-5xl font-bold text-[#A8DADC] mb-2">
                    {stat.value}
                  </p>
                  <p className="text-white/70">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section 
        ref={(el) => { sectionsRef.current[1] = el; }}
        className="py-16 lg:py-24"
      >
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              <div className="animate-item">
                <div className="w-16 h-16 bg-[#A8DADC]/20 rounded-2xl flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8 text-[#A8DADC]" />
                </div>
                <h2 className="text-3xl font-bold text-[#1D3557] mb-4">
                  Our Mission
                </h2>
                <p className="text-[#6C757D] leading-relaxed">
                  To bridge cultures through thoughtfully curated lifestyle products that bring joy, beauty, and meaning to everyday life. We strive to make Korean innovation accessible while celebrating Indian craftsmanship.
                </p>
              </div>
              
              <div className="animate-item">
                <div className="w-16 h-16 bg-[#F4A261]/20 rounded-2xl flex items-center justify-center mb-6">
                  <Globe className="w-8 h-8 text-[#F4A261]" />
                </div>
                <h2 className="text-3xl font-bold text-[#1D3557] mb-4">
                  Our Vision
                </h2>
                <p className="text-[#6C757D] leading-relaxed">
                  To become the premier destination for those seeking a harmonious blend of Eastern aesthetics and modern lifestyle. We envision a world where cultural exchange happens naturally through the products we love.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section 
        ref={(el) => { sectionsRef.current[2] = el; }}
        className="py-16 lg:py-24 bg-[#F8F9FA]"
      >
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 animate-item">
              <span className="text-sm font-medium text-[#F4A261] uppercase tracking-wider">
                What We Stand For
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#1D3557] mt-2">
                Our Values
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="animate-item bg-white p-8 rounded-2xl hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-[#A8DADC]/20 rounded-xl flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-[#A8DADC]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1D3557] mb-2">
                    {value.title}
                  </h3>
                  <p className="text-[#6C757D]">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Story Image */}
      <section 
        ref={(el) => { sectionsRef.current[3] = el; }}
        className="py-16 lg:py-24"
      >
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="animate-item order-2 lg:order-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                    <img
                      src="/images/collection-beauty.jpg"
                      alt="K-Beauty Collection"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden mt-8">
                    <img
                      src="/images/collection-fashion.jpg"
                      alt="Fashion Collection"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
              
              <div className="animate-item order-1 lg:order-2">
                <span className="text-sm font-medium text-[#F4A261] uppercase tracking-wider">
                  The Experience
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold text-[#1D3557] mt-2 mb-6">
                  More Than Just Products
                </h2>
                <div className="space-y-4 text-[#6C757D]">
                  <p>
                    Every item in our store tells a story. From the innovative labs of Seoul to the artisan workshops of India, we bring you products that carry the soul of their creators.
                  </p>
                  <p>
                    We believe in slow commerce – taking the time to understand where our products come from, who makes them, and how they can enrich your life.
                  </p>
                  <p>
                    When you shop with SEOUL & SPICE, you're not just buying a product; you're becoming part of a community that values quality, authenticity, and cultural appreciation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 lg:py-24 bg-[#1D3557]">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 bg-[#A8DADC]/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <Heart className="w-8 h-8 text-[#A8DADC]" />
            </div>
            <blockquote className="text-2xl lg:text-3xl text-white font-light leading-relaxed mb-8">
              "SEOUL & SPICE has completely transformed my skincare routine. The quality of their K-beauty products is unmatched, and I love knowing that I'm supporting a brand that values both innovation and tradition."
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-[#A8DADC] rounded-full flex items-center justify-center">
                <span className="text-[#1D3557] font-semibold">SK</span>
              </div>
              <div className="text-left">
                <p className="text-white font-medium">Sarah Kim</p>
                <p className="text-white/60 text-sm">Loyal Customer since 2023</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24">
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="relative bg-gradient-to-r from-[#A8DADC]/20 to-[#F4A261]/20 rounded-3xl overflow-hidden p-8 lg:p-16 text-center">
              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold text-[#1D3557] mb-4">
                  Join Our Journey
                </h2>
                <p className="text-[#6C757D] text-lg mb-8">
                  Discover the perfect blend of Korean innovation and Indian warmth. Start exploring our curated collections today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="/products" className="btn-primary">
                    Shop Now
                  </a>
                  <a href="/contact" className="btn-secondary">
                    Get in Touch
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
