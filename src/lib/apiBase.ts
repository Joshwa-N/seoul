// Local dev -> localhost backend. Production -> VITE_API_URL (set in Vercel), or same-origin.
export const API_BASE: string =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  (import.meta.env.DEV ? 'http://localhost:3001' : '');
