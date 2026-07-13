import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Youtube, Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const footerLinks = {
  shop: [
    { label: 'All Products', href: '/products' },
    { label: 'K-Beauty', href: '/products?category=beauty' },
    { label: 'Fashion', href: '/products?category=fashion' },
    { label: 'Home', href: '/products?category=home' },
    { label: 'New Arrivals', href: '/products?sort=newest' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  support: [
    { label: 'FAQ', href: '/contact#faq' },
    { label: 'Shipping', href: '#' },
    { label: 'Returns', href: '#' },
    { label: 'Track Order', href: '#' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ],
};

const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success('Thank you for subscribing!');
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#1D3557] text-white">
      {/* Newsletter Section */}
      <div className="section-padding py-12 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-semibold mb-2">Join the Community</h3>
              <p className="text-white/70">
                Subscribe for exclusive offers, new arrivals, and beauty tips.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full max-w-md gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
        </div>
      </div>

      {/* Main Footer */}
      <div className="section-padding py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-3 lg:col-span-2">
              <Link to="/" className="inline-block mb-4">
                <span className="text-2xl font-bold">
                  SEOUL <span className="text-[#F4A261]">&</span> SPICE
                </span>
              </Link>
              <p className="text-white/70 mb-6 max-w-sm">
                Bridging Korean minimalism with Indian warmth. Curated lifestyle products for the modern soul.
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center
                             hover:bg-[#A8DADC] hover:text-[#1D3557] transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Shop Links */}
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-3">
                {footerLinks.shop.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-white/70 hover:text-[#A8DADC] transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-white/70 hover:text-[#A8DADC] transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-white/70 hover:text-[#A8DADC] transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-white/70 text-sm">
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>hello@seoulspice.com</span>
                </li>
                <li className="flex items-start gap-2 text-white/70 text-sm">
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-start gap-2 text-white/70 text-sm">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>123 Seoul Street,<br />New York, NY 10001</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="section-padding py-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm">
            © 2024 SEOUL & SPICE. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-white/50 hover:text-white/70 transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
