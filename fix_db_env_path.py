from pathlib import Path

f = Path("server/db/index.ts")
src = f.read_text(encoding="utf-8")

old = "dotenv.config({ path: '/Users/joshwa/Downloads/ecommerce/.env' });"
new = "dotenv.config();"

count = src.count(old)
if count != 1:
    raise SystemExit(f"Anchor matched {count} times, expected 1 — check db/index.ts manually.")

f.write_text(src.replace(old, new, 1), encoding="utf-8")
print("Fixed — now loads .env from the server's own working directory.")
