#!/usr/bin/env python3
import sys
from pathlib import Path

FILE = Path("src/pages/Home.tsx")
src = FILE.read_text(encoding="utf-8")

old = (
    "                  />\n"
    "                </div>\n"
    "                {/* Floating Card */}\n"
)
new = (
    "                  />\n"
    "                </div>\n"
    "\n"
    "                {/* Floating Card */}\n"
)

count = src.count(old)
if count != 1:
    sys.exit(f"[ABORTED] matched {count} time(s)")

FILE.write_text(src.replace(old, new, 1), encoding="utf-8")
print("OK")
