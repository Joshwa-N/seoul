import re, pathlib

src = pathlib.Path("src")

# 1. shared helper
lib = src / "lib"
lib.mkdir(exist_ok=True)
(lib / "apiBase.ts").write_text(
"""// Local dev -> localhost backend. Production -> VITE_API_URL (set in Vercel), or same-origin.
export const API_BASE: string =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  (import.meta.env.DEV ? 'http://localhost:3001' : '');
"""
)

IMPORT = "import { API_BASE } from '@/lib/apiBase';\n"
URL = "http://localhost:3001"
changed = []

for p in list(src.rglob("*.ts")) + list(src.rglob("*.tsx")):
    if p.name == "apiBase.ts":
        continue
    text = p.read_text(encoding="utf-8")
    if URL not in text:
        continue
    orig = text

    # '...http://localhost:3001...' or "..." -> `...${API_BASE}...`
    def to_template(m):
        inner = m.group(2).replace(URL, "${API_BASE}")
        return "`" + inner + "`"
    text = re.sub(r"""(['"])([^'"\n`]*?""" + re.escape(URL) + r"""[^'"\n`]*?)\1""", to_template, text)

    # already inside a template literal
    text = text.replace(URL, "${API_BASE}")

    if "@/lib/apiBase" not in text:
        text = IMPORT + text
    if text != orig:
        p.write_text(text, encoding="utf-8")
        changed.append(str(p))

print("Updated files:")
for c in changed:
    print("  ", c)
