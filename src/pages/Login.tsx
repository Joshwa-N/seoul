import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Eye, EyeOff, Mail, Lock, User, Phone, MapPin, ArrowRight, LogIn,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

type Mode = 'signin' | 'signup' | 'forgot';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const from = (location.state as any)?.from || '/';

  const [mode, setMode] = useState<Mode>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({
    name: '', email: '', password: '', phone: '',
    street: '', city: '', state: '', zip: '', country: 'India',
  });
  const [forgotEmail, setForgotEmail] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(signInData.email, signInData.password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err: any) {
      toast.error(err.message || 'Sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signUpData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setIsLoading(true);
    try {
      await register({
        name: signUpData.name,
        email: signUpData.email,
        password: signUpData.password,
        phone: signUpData.phone,
        address: {
          street: signUpData.street,
          city: signUpData.city,
          state: signUpData.state,
          zip: signUpData.zip,
          country: signUpData.country,
        },
      });
      toast.success('Account created! Welcome to Seoul & Spice 🎉');
      navigate(from, { replace: true });
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/auth/forgot-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: forgotEmail }),
        }
      );
      await res.json();
      setForgotSent(true);
      toast.success('Reset link sent if email exists!');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-[#E9ECEF] focus:outline-none focus:ring-2 focus:ring-[#A8DADC] transition-all text-[#1D3557] placeholder:text-[#ADB5BD] bg-white';
  const labelClass = 'block text-sm font-medium text-[#1D3557] mb-2';

  return (
    <main className="min-h-screen pt-20 lg:pt-24 pb-16">
      {/* Hero Banner */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-[#A8DADC]/20 via-[#F8F9FA] to-[#F4A261]/10">
        <div className="section-padding">
          <div className="max-w-7xl mx-auto text-center">
            <span className="text-sm font-medium text-[#F4A261] uppercase tracking-wider">
              {mode === 'signin' ? 'Welcome Back' : mode === 'signup' ? 'Join Us' : 'Account Recovery'}
            </span>
            <h1 className="text-3xl lg:text-5xl font-bold text-[#1D3557] mt-4 mb-4">
              {mode === 'signin'
                ? 'Sign In to Your Account'
                : mode === 'signup'
                ? 'Create Your Account'
                : 'Forgot Password'}
            </h1>
            <p className="text-[#6C757D] max-w-xl mx-auto">
              {mode === 'signin'
                ? 'Access your orders, wishlist, and more.'
                : mode === 'signup'
                ? 'Join Seoul & Spice and enjoy a personalised shopping experience.'
                : "Enter your email and we'll send you a reset link."}
            </p>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 lg:py-16">
        <div className="section-padding">
          <div className="max-w-lg mx-auto">

            {/* Mode Tabs */}
            {mode !== 'forgot' && (
              <div className="flex bg-[#F8F9FA] rounded-2xl p-1 mb-8">
                <button
                  onClick={() => setMode('signin')}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                    mode === 'signin'
                      ? 'bg-white text-[#1D3557] shadow-sm'
                      : 'text-[#6C757D] hover:text-[#1D3557]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setMode('signup')}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                    mode === 'signup'
                      ? 'bg-white text-[#1D3557] shadow-sm'
                      : 'text-[#6C757D] hover:text-[#1D3557]'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            )}

            <div className="bg-white rounded-3xl border border-[#E9ECEF] p-8 shadow-sm">

              {/* ── Sign In Form ── */}
              {mode === 'signin' && (
                <form onSubmit={handleSignIn} className="space-y-5">
                  <div>
                    <label className={labelClass}>Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ADB5BD]" />
                      <input
                        type="email"
                        required
                        value={signInData.email}
                        onChange={(e) => setSignInData((p) => ({ ...p, email: e.target.value }))}
                        className={`${inputClass} pl-11`}
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ADB5BD]" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={signInData.password}
                        onChange={(e) => setSignInData((p) => ({ ...p, password: e.target.value }))}
                        className={`${inputClass} pl-11 pr-11`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ADB5BD] hover:text-[#1D3557] transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-sm text-[#F4A261] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? 'Signing in...' : (<>Sign In <LogIn className="w-4 h-4" /></>)}
                  </button>

                  <p className="text-center text-sm text-[#6C757D]">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signup')}
                      className="text-[#F4A261] font-medium hover:underline"
                    >
                      Sign up
                    </button>
                  </p>
                </form>
              )}

              {/* ── Sign Up Form ── */}
              {mode === 'signup' && (
                <form onSubmit={handleSignUp} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ADB5BD]" />
                      <input
                        type="text"
                        required
                        value={signUpData.name}
                        onChange={(e) => setSignUpData((p) => ({ ...p, name: e.target.value }))}
                        className={`${inputClass} pl-11`}
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className={labelClass}>Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ADB5BD]" />
                      <input
                        type="email"
                        required
                        value={signUpData.email}
                        onChange={(e) => setSignUpData((p) => ({ ...p, email: e.target.value }))}
                        className={`${inputClass} pl-11`}
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className={labelClass}>Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ADB5BD]" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={signUpData.password}
                        onChange={(e) => setSignUpData((p) => ({ ...p, password: e.target.value }))}
                        className={`${inputClass} pl-11 pr-11`}
                        placeholder="Min. 6 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#ADB5BD] hover:text-[#1D3557] transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className={labelClass}>Phone Number <span className="text-[#ADB5BD] font-normal">(optional)</span></label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ADB5BD]" />
                      <input
                        type="tel"
                        value={signUpData.phone}
                        onChange={(e) => setSignUpData((p) => ({ ...p, phone: e.target.value }))}
                        className={`${inputClass} pl-11`}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className={labelClass}>
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Delivery Address <span className="text-[#ADB5BD] font-normal">(optional)</span>
                      </span>
                    </label>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={signUpData.street}
                        onChange={(e) => setSignUpData((p) => ({ ...p, street: e.target.value }))}
                        className={inputClass}
                        placeholder="Street address"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={signUpData.city}
                          onChange={(e) => setSignUpData((p) => ({ ...p, city: e.target.value }))}
                          className={inputClass}
                          placeholder="City"
                        />
                        <input
                          type="text"
                          value={signUpData.state}
                          onChange={(e) => setSignUpData((p) => ({ ...p, state: e.target.value }))}
                          className={inputClass}
                          placeholder="State"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={signUpData.zip}
                          onChange={(e) => setSignUpData((p) => ({ ...p, zip: e.target.value }))}
                          className={inputClass}
                          placeholder="PIN code"
                        />
                        <input
                          type="text"
                          value={signUpData.country}
                          onChange={(e) => setSignUpData((p) => ({ ...p, country: e.target.value }))}
                          className={inputClass}
                          placeholder="Country"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? 'Creating Account...' : (<>Create Account <ArrowRight className="w-4 h-4" /></>)}
                  </button>

                  <p className="text-center text-sm text-[#6C757D]">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signin')}
                      className="text-[#F4A261] font-medium hover:underline"
                    >
                      Sign in
                    </button>
                  </p>
                </form>
              )}

              {/* ── Forgot Password ── */}
              {mode === 'forgot' && (
                <div>
                  {forgotSent ? (
                    <div className="text-center py-6">
                      <div className="w-16 h-16 bg-[#A8DADC]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-[#A8DADC]" />
                      </div>
                      <h3 className="text-lg font-semibold text-[#1D3557] mb-2">Check your inbox</h3>
                      <p className="text-[#6C757D] text-sm mb-6">
                        If <strong>{forgotEmail}</strong> is registered, you'll receive a password reset link shortly.
                      </p>
                      <button
                        onClick={() => { setMode('signin'); setForgotSent(false); }}
                        className="text-sm text-[#F4A261] hover:underline"
                      >
                        ← Back to Sign In
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleForgot} className="space-y-5">
                      <div>
                        <label className={labelClass}>Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ADB5BD]" />
                          <input
                            type="email"
                            required
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            className={`${inputClass} pl-11`}
                            placeholder="you@example.com"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isLoading ? 'Sending...' : (<>Send Reset Link <ArrowRight className="w-4 h-4" /></>)}
                      </button>

                      <p className="text-center">
                        <button
                          type="button"
                          onClick={() => setMode('signin')}
                          className="text-sm text-[#6C757D] hover:text-[#1D3557] transition-colors"
                        >
                          ← Back to Sign In
                        </button>
                      </p>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-8">
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="relative bg-[#1D3557] rounded-3xl overflow-hidden p-8 lg:p-12 text-center">
              <div className="absolute inset-0 bg-gradient-to-r from-[#A8DADC]/20 to-[#F4A261]/20" />
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-white mb-3">Discover Seoul & Spice</h2>
                <p className="text-white/70 mb-6">
                  Korean beauty, fashion, home & food — all in one place.
                </p>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-[#A8DADC] text-[#1D3557] font-medium rounded-full hover:bg-[#F4A261] hover:text-white transition-colors"
                >
                  Browse Products <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}