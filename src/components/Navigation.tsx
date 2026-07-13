import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, Search, User, X, LogOut, Package, Heart, Bell, MapPin } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/hooks/use-products';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/products' },
  { label: 'Collections', href: '/collections' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const accountLinks = [
  { label: 'Orders', href: '/account/orders', icon: Package },
  { label: 'Wishlist', href: '/account/wishlist', icon: Heart },
  { label: 'Notifications', href: '/account/notifications', icon: Bell },
  { label: 'Saved Addresses', href: '/account/addresses', icon: MapPin },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { getCartCount } = useCart();
  const { user, logout } = useAuth();
  const { products } = useProducts();
  const location = useLocation();
  const navigate = useNavigate();
  const cartCount = getCartCount();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen) setTimeout(() => searchInputRef.current?.focus(), 100);
    else setSearchQuery('');
  }, [isSearchOpen]);

  useEffect(() => { setIsSearchOpen(false); setIsUserMenuOpen(false); }, [location]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setIsSearchOpen(false); setIsUserMenuOpen(false); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node))
        setIsUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const isActive = (href: string) => href === '/' ? location.pathname === '/' : location.pathname.startsWith(href);

  const searchResults = searchQuery.trim().length > 1
    ? products.filter((p) => {
        const q = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) || p.subcategory?.toLowerCase().includes(q);
      }).slice(0, 6)
    : [];

  const handleResultClick = (productId: string | number) => { setIsSearchOpen(false); navigate(`/product/${productId}`); };
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) { setIsSearchOpen(false); navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`); }
  };
  const handleLogout = () => { logout(); setIsUserMenuOpen(false); navigate('/'); };
  const handleAccountLink = (href: string) => {
    setIsUserMenuOpen(false); setIsMobileMenuOpen(false);
    navigate(user ? href : '/login');
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
        <nav className="section-padding">
          <div className="max-w-7xl mx-auto flex items-center justify-between h-16 lg:h-20">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl lg:text-2xl font-bold tracking-tight text-[#1D3557]">
                SEOUL <span className="text-[#F4A261]">&</span> SPICE
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link key={link.href} to={link.href}
                  className={`relative text-sm font-medium transition-colors ${isActive(link.href) ? 'text-[#1D3557]' : 'text-[#6C757D] hover:text-[#1D3557]'}`}>
                  {link.label}
                  {isActive(link.href) && <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#A8DADC] rounded-full" />}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3 lg:gap-4">
              <button onClick={() => setIsSearchOpen(true)} className="p-2 hover:bg-[#F8F9FA] rounded-full transition-colors" aria-label="Search">
                <Search className="w-5 h-5 text-[#1D3557]" />
              </button>

              <div className="hidden sm:block relative" ref={userMenuRef}>
                <button onClick={() => user ? setIsUserMenuOpen(!isUserMenuOpen) : navigate('/login')}
                  className="flex items-center gap-2 p-2 hover:bg-[#F8F9FA] rounded-full transition-colors" aria-label="Account">
                  {user ? (
                    <div className="w-7 h-7 rounded-full bg-[#A8DADC]/40 flex items-center justify-center">
                      <span className="text-xs font-bold text-[#1D3557]">{user.name.charAt(0).toUpperCase()}</span>
                    </div>
                  ) : (
                    <User className="w-5 h-5 text-[#1D3557]" />
                  )}
                  {user && <span className="hidden lg:block text-sm font-medium text-[#1D3557]">{user.name.split(' ')[0]}</span>}
                </button>

                {isUserMenuOpen && user && (
                  <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-lg border border-[#E9ECEF] overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-[#E9ECEF]">
                      <p className="font-semibold text-[#1D3557] text-sm">{user.name}</p>
                      <p className="text-xs text-[#6C757D] truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      {accountLinks.map(({ label, href, icon: Icon }) => (
                        <button key={href} onClick={() => handleAccountLink(href)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#1D3557] hover:bg-[#F8F9FA] transition-colors">
                          <Icon className="w-4 h-4 text-[#6C757D]" />
                          {label}
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-[#E9ECEF] py-1">
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <Link to="/cart" className="relative p-2 hover:bg-[#F8F9FA] rounded-full transition-colors" aria-label="Cart">
                <ShoppingBag className="w-5 h-5 text-[#1D3557]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#F4A261] text-white text-xs font-medium rounded-full flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>

              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <button className="lg:hidden p-2 hover:bg-[#F8F9FA] rounded-full transition-colors" aria-label="Menu">
                    <Menu className="w-5 h-5 text-[#1D3557]" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-80 bg-white">
                  <div className="flex flex-col h-full pt-8">
                    <div className="flex items-center justify-between mb-8">
                      <span className="text-xl font-bold text-[#1D3557]">Menu</span>
                    </div>
                    {user ? (
                      <div className="flex items-center gap-3 px-4 py-3 mb-4 bg-[#A8DADC]/10 rounded-xl">
                        <div className="w-9 h-9 rounded-full bg-[#A8DADC]/40 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-[#1D3557]">{user.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-[#1D3557] text-sm truncate">{user.name}</p>
                          <p className="text-xs text-[#6C757D] truncate">{user.email}</p>
                        </div>
                      </div>
                    ) : (
                      <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 mb-4 bg-[#1D3557] text-white rounded-xl font-medium text-sm justify-center">
                        <User className="w-4 h-4" />
                        Sign In / Sign Up
                      </Link>
                    )}
                    <div className="flex flex-col gap-2">
                      {navLinks.map((link) => (
                        <Link key={link.href} to={link.href} onClick={() => setIsMobileMenuOpen(false)}
                          className={`py-3 px-4 rounded-lg text-lg font-medium transition-colors ${isActive(link.href) ? 'bg-[#A8DADC]/20 text-[#1D3557]' : 'text-[#6C757D] hover:bg-[#F8F9FA]'}`}>
                          {link.label}
                        </Link>
                      ))}
                    </div>
                    <div className="mt-4 border-t border-[#E9ECEF] pt-4">
                      <p className="text-xs text-[#ADB5BD] uppercase tracking-wider px-4 mb-2">Account</p>
                      {accountLinks.map(({ label, href, icon: Icon }) => (
                        <button key={href} onClick={() => handleAccountLink(href)}
                          className="w-full flex items-center gap-3 py-2.5 px-4 rounded-lg text-sm text-[#1D3557] hover:bg-[#F8F9FA] transition-colors">
                          <Icon className="w-4 h-4 text-[#6C757D]" />
                          {label}
                        </button>
                      ))}
                    </div>
                    <div className="mt-auto pb-8 space-y-2">
                      <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-[#F8F9FA] transition-colors">
                        <ShoppingBag className="w-5 h-5" />
                        <span className="font-medium">Shopping Cart</span>
                        {cartCount > 0 && (
                          <span className="ml-auto w-6 h-6 bg-[#F4A261] text-white text-sm font-medium rounded-full flex items-center justify-center">{cartCount}</span>
                        )}
                      </Link>
                      {user && (
                        <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                          className="w-full flex items-center gap-3 py-3 px-4 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                          <LogOut className="w-5 h-5" />
                          <span className="font-medium">Sign Out</span>
                        </button>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>
      </header>

      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsSearchOpen(false)} />
          <div className="relative bg-white w-full shadow-2xl">
            <div className="max-w-3xl mx-auto px-4 py-4">
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
                <Search className="w-5 h-5 text-[#6C757D] flex-shrink-0" />
                <input ref={searchInputRef} type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, categories..."
                  className="flex-1 text-lg outline-none text-[#1D3557] placeholder:text-[#ADB5BD] bg-transparent py-2" />
                <button type="button" onClick={() => setIsSearchOpen(false)} className="p-2 hover:bg-[#F8F9FA] rounded-full transition-colors flex-shrink-0">
                  <X className="w-5 h-5 text-[#6C757D]" />
                </button>
              </form>
              {searchQuery.trim().length > 1 && (
                <div className="border-t border-[#E9ECEF] mt-2 pb-2">
                  {searchResults.length > 0 ? (
                    <>
                      <p className="text-xs text-[#ADB5BD] uppercase tracking-wider px-1 py-3">
                        {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                      </p>
                      <div className="space-y-1">
                        {searchResults.map((product) => (
                          <button key={product.id} onClick={() => handleResultClick(product.id)}
                            className="w-full flex items-center gap-4 px-2 py-2 rounded-xl hover:bg-[#F8F9FA] transition-colors text-left">
                            <img src={product.images?.[0] || product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-[#1D3557] truncate">{product.name}</p>
                              <p className="text-sm text-[#6C757D]">{product.category}</p>
                            </div>
                            <p className="font-semibold text-[#1D3557] flex-shrink-0">₹{product.price}</p>
                          </button>
                        ))}
                      </div>
                      {searchResults.length === 6 && (
                        <button onClick={handleSearchSubmit as any} className="w-full mt-2 py-2 text-sm text-[#F4A261] hover:underline text-center">
                          View all results for "{searchQuery}"
                        </button>
                      )}
                    </>
                  ) : (
                    <p className="text-center text-[#6C757D] py-8">No products found for "{searchQuery}"</p>
                  )}
                </div>
              )}
              {searchQuery.trim().length === 0 && (
                <p className="text-sm text-[#ADB5BD] px-1 py-3">Start typing to search across all {products.length} products...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
