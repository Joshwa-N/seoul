import { Link } from 'react-router';
import { Instagram, Facebook, Youtube, Mail, MapPin, Phone } from 'lucide-react';

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
  { icon: Youtube, href: 'https://youtube.com/@omnizentrix?si=h6tYcu-kehlON_R7', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="bg-[#1D3557] text-white">
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
            © 2026 SEOUL & SPICE. All rights reserved.
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
