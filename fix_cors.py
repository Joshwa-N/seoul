import pathlib
p = pathlib.Path("server/index.ts")
s = p.read_text(encoding="utf-8")

old = "app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));"
new = r"""const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim().replace(/\/$/, ''));
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));"""

if old not in s:
    raise SystemExit("CORS line not found - paste server/index.ts lines 1-40 and I'll adjust")
p.write_text(s.replace(old, new), encoding="utf-8")
print("CORS patched")
