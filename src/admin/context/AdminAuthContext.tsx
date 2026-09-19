import { createContext, useContext, useState, type ReactNode } from 'react';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001') + '/api';

// Production build with no API configured (e.g. a Vercel preview): browser-only demo login.
const DEMO_MODE = import.meta.env.PROD && (!import.meta.env.VITE_API_URL || /localhost|127\.0\.0\.1/.test(import.meta.env.VITE_API_URL));

interface AdminSession { id: string | number; name: string; role: string; }
interface AdminAuthContextType {
  session: AdminSession | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  error: string | null;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<AdminSession | null>(() => {
    const raw = sessionStorage.getItem('ss_admin_session');
    return raw ? JSON.parse(raw) : null;
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    if (DEMO_MODE) {
      if (email.trim().toLowerCase() === 'admin@seoulspice.com' && password === 'admin123') {
        const demo = { id: 'admin_001', name: 'Admin User', role: 'admin' };
        sessionStorage.setItem('ss_admin_token', 'demo-token');
        sessionStorage.setItem('ss_admin_session', JSON.stringify(demo));
        setSession(demo);
        return true;
      }
      setError('Invalid email or password');
      return false;
    }
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Login failed'); return false; }
      
      sessionStorage.setItem('ss_admin_token', data.token);
      sessionStorage.setItem('ss_admin_session', JSON.stringify({ id: data.user.id, name: data.user.name, role: data.user.role }));
      setSession({ id: data.user.id, name: data.user.name, role: data.user.role });
      return true;
    } catch (err) {
      setError('Connection failed. Is the server running?');
      return false;
    }
  };

  const logout = () => {
    sessionStorage.removeItem('ss_admin_token');
    sessionStorage.removeItem('ss_admin_session');
    setSession(null);
  };

  return (
    <AdminAuthContext.Provider value={{ session, login, logout, error }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
