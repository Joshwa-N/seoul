#!/usr/bin/env python3
"""Fixes the hero rating card being clipped by the image's overflow-hidden wrapper."""

import sys
from pathlib import Path

FILE = Path("src/pages/Home.tsx")

if not FILE.exists():
    sys.exit(f"Could not find {FILE} — run this from your project root.")

src = FILE.read_text(encoding="utf-8")

old = (
    '              <div className="hero-image-wrap group relative aspect-[3/4] max-w-md mx-auto overflow-hidden rounded-3xl">\n'
    "                <img\n"
    '                  src="/images/hero-model.jpg"\n'
    '                  alt="SEOUL & SPICE Lifestyle"\n'
    '                  className="w-full h-full object-cover rounded-3xl shadow-2xl transition-transform duration-700 ease-out group-hover:scale-105"\n'
    "                />"
)

new = (
    '              <div className="hero-image-wrap group relative aspect-[3/4] max-w-md mx-auto">\n'
    '                <div className="w-full h-full overflow-hidden rounded-3xl shadow-2xl">\n'
    "                  <img\n"
    '                    src="/images/hero-model.jpg"\n'
    '                    alt="SEOUL & SPICE Lifestyle"\n'
    '                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"\n'
    "                  />\n"
    "                </div>"
)

count = src.count(old)
if count != 1:
    sys.exit(f"[ABORTED] Anchor matched {count} time(s), expected 1. Paste your current Home.tsx again.")

src = src.replace(old, new, 1)
FILE.write_text(src, encoding="utf-8")
print(f"Fixed {FILE} — rating card should be visible again.")
