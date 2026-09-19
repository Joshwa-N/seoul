#!/usr/bin/env python3
"""
Patches src/pages/Home.tsx to add premium GSAP hero animations
(load-in timeline, split heading, subtle mouse parallax, idle float,
animated bg gradient, hover zoom, scroll-out parallax, clickable
scroll indicator) without touching layout, colors, copy, or images.
"""

import sys
from pathlib import Path

FILE = Path("src/pages/Home.tsx")

if not FILE.exists():
    sys.exit(f"Could not find {FILE} — run this from your project root.")

src = FILE.read_text(encoding="utf-8")
original = src


def apply(old: str, new: str, label: str):
    global src
    count = src.count(old)
    if count != 1:
        sys.exit(
            f"[ABORTED] Anchor for '{label}' matched {count} time(s), expected 1.\n"
            f"Your file has likely drifted from the version you pasted me — "
            f"paste the current Home.tsx again and I'll regenerate this script."
        )
    src = src.replace(old, new, 1)


# 1. Declare a mouse-move cleanup slot at the top of the effect
apply(
    "  useEffect(() => {\n"
    "    const ctx = gsap.context(() => {\n"
    "      // Hero animation\n"
    "      gsap.fromTo(\n"
    "        '.hero-content',\n"
    "        { opacity: 0, y: 40 },\n"
    "        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.3 }\n"
    "      );\n"
    "\n"
    "      // Section animations\n",
    "  useEffect(() => {\n"
    "    let removeHeroMouseMove = () => {};\n"
    "    const ctx = gsap.context(() => {\n"
    "      // Hero animation\n"
    "      const prefersReducedMotion = window.matchMedia(\n"
    "        '(prefers-reduced-motion: reduce)'\n"
    "      ).matches;\n"
    "      const hero = heroRef.current;\n"
    "\n"
    "      const bg = hero?.querySelector<HTMLDivElement>('.hero-bg');\n"
    "      const badge = hero?.querySelector<HTMLDivElement>('.hero-badge');\n"
    "      const words = hero?.querySelectorAll<HTMLElement>('.hero-word');\n"
    "      const desc = hero?.querySelector<HTMLParagraphElement>('.hero-desc');\n"
    "      const buttons = hero?.querySelectorAll<HTMLElement>('.hero-buttons > *');\n"
    "      const imageWrap = hero?.querySelector<HTMLDivElement>('.hero-image-wrap');\n"
    "      const ratingCard = hero?.querySelector<HTMLDivElement>('.hero-rating-card');\n"
    "      const star = hero?.querySelector<SVGSVGElement>('.hero-star');\n"
    "      const scrollIndicator = hero?.querySelector<HTMLButtonElement>(\n"
    "        '.hero-scroll-indicator'\n"
    "      );\n"
    "\n"
    "      if (prefersReducedMotion) {\n"
    "        gsap.set([badge, words, desc, buttons, imageWrap, ratingCard, scrollIndicator], {\n"
    "          clearProps: 'all',\n"
    "          opacity: 1,\n"
    "        });\n"
    "      } else {\n"
    "        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });\n"
    "        tl.from(badge, { y: 18, opacity: 0, duration: 0.6, delay: 0.2 })\n"
    "          .from(words, { y: 44, opacity: 0, duration: 0.7, stagger: 0.12 }, '-=0.25')\n"
    "          .from(desc, { y: 18, opacity: 0, duration: 0.6 }, '-=0.4')\n"
    "          .from(buttons, { y: 18, opacity: 0, duration: 0.5, stagger: 0.12 }, '-=0.35')\n"
    "          .from(imageWrap, { opacity: 0, scale: 0.93, x: 36, duration: 1.05 }, '-=0.85')\n"
    "          .from(ratingCard, { opacity: 0, y: 22, scale: 0.9, duration: 0.6 }, '-=0.45')\n"
    "          .from(scrollIndicator, { opacity: 0, y: -10, duration: 0.5 }, '-=0.2');\n"
    "\n"
    "        // Idle micro-animations\n"
    "        gsap.to(ratingCard, {\n"
    "          y: '+=8',\n"
    "          duration: 2.4,\n"
    "          repeat: -1,\n"
    "          yoyo: true,\n"
    "          ease: 'sine.inOut',\n"
    "          delay: 1.6,\n"
    "        });\n"
    "        if (star) {\n"
    "          gsap.to(star, {\n"
    "            scale: 1.15,\n"
    "            transformOrigin: 'center',\n"
    "            duration: 1,\n"
    "            repeat: -1,\n"
    "            yoyo: true,\n"
    "            ease: 'sine.inOut',\n"
    "            delay: 1.8,\n"
    "          });\n"
    "        }\n"
    "        gsap.to(scrollIndicator, {\n"
    "          y: '+=6',\n"
    "          duration: 1.4,\n"
    "          repeat: -1,\n"
    "          yoyo: true,\n"
    "          ease: 'sine.inOut',\n"
    "        });\n"
    "\n"
    "        // Very subtle animated background gradient drift\n"
    "        if (bg) {\n"
    "          gsap.to(bg, {\n"
    "            backgroundPosition: '100% 60%',\n"
    "            duration: 16,\n"
    "            repeat: -1,\n"
    "            yoyo: true,\n"
    "            ease: 'sine.inOut',\n"
    "          });\n"
    "        }\n"
    "\n"
    "        // Very subtle mouse parallax\n"
    "        const quick = {\n"
    "          bgX: gsap.quickTo(bg, 'x', { duration: 1.6, ease: 'power3.out' }),\n"
    "          bgY: gsap.quickTo(bg, 'y', { duration: 1.6, ease: 'power3.out' }),\n"
    "          imageX: gsap.quickTo(imageWrap, 'x', { duration: 1, ease: 'power3.out' }),\n"
    "          imageY: gsap.quickTo(imageWrap, 'y', { duration: 1, ease: 'power3.out' }),\n"
    "          ratingX: gsap.quickTo(ratingCard, 'x', { duration: 1.2, ease: 'power3.out' }),\n"
    "          ratingY: gsap.quickTo(ratingCard, 'y', { duration: 1.2, ease: 'power3.out' }),\n"
    "        };\n"
    "        const handleHeroMouseMove = (e: MouseEvent) => {\n"
    "          const { innerWidth, innerHeight } = window;\n"
    "          const relX = (e.clientX / innerWidth - 0.5) * 2;\n"
    "          const relY = (e.clientY / innerHeight - 0.5) * 2;\n"
    "          quick.bgX(relX * 14);\n"
    "          quick.bgY(relY * 14);\n"
    "          quick.imageX(relX * 12);\n"
    "          quick.imageY(relY * 8);\n"
    "          quick.ratingX(relX * 18);\n"
    "          quick.ratingY(relY * 10);\n"
    "        };\n"
    "        hero?.addEventListener('mousemove', handleHeroMouseMove);\n"
    "        removeHeroMouseMove = () =>\n"
    "          hero?.removeEventListener('mousemove', handleHeroMouseMove);\n"
    "\n"
    "        // Smooth scroll-out parallax as the hero leaves the viewport\n"
    "        ScrollTrigger.create({\n"
    "          trigger: hero,\n"
    "          start: 'top top',\n"
    "          end: 'bottom top',\n"
    "          scrub: true,\n"
    "          onUpdate: (self) => {\n"
    "            const p = self.progress;\n"
    "            gsap.set(imageWrap, {\n"
    "              y: p * -30,\n"
    "              scale: 1 - p * 0.05,\n"
    "              opacity: 1 - p * 0.6,\n"
    "            });\n"
    "          },\n"
    "        });\n"
    "      }\n"
    "\n"
    "      // Section animations\n",
    "hero load-in timeline + parallax + idle animations",
)

# 2. Clean up the mousemove listener alongside the existing ctx.revert()
apply(
    "    return () => ctx.revert();\n"
    "  }, []);",
    "    return () => {\n"
    "      removeHeroMouseMove();\n"
    "      ctx.revert();\n"
    "    };\n"
    "  }, []);",
    "effect cleanup",
)

# 3. Add scrollToNext(), used by the scroll-indicator button
apply(
    "  const handleNewsletterSubmit = (e: React.FormEvent) => {\n"
    "    e.preventDefault();\n"
    "    toast.success('Thank you for subscribing!');\n"
    "  };",
    "  const scrollToNext = () => {\n"
    "    const next = sectionsRef.current[0];\n"
    "    if (next) {\n"
    "      next.scrollIntoView({ behavior: 'smooth' });\n"
    "    } else {\n"
    "      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });\n"
    "    }\n"
    "  };\n"
    "\n"
    "  const handleNewsletterSubmit = (e: React.FormEvent) => {\n"
    "    e.preventDefault();\n"
    "    toast.success('Thank you for subscribing!');\n"
    "  };",
    "scrollToNext helper",
)

# 4. Background gradient — tag it + give it room to drift
apply(
    '        <div className="absolute inset-0 bg-gradient-to-br from-[#A8DADC]/30 via-[#F8F9FA] to-[#F4A261]/20" />',
    '        <div className="hero-bg absolute inset-0 bg-gradient-to-br from-[#A8DADC]/30 via-[#F8F9FA] to-[#F4A261]/20 bg-[length:140%_140%]" />',
    "background gradient tag",
)

# 5. Badge
apply(
    '              <span className="inline-block px-4 py-2 bg-[#A8DADC]/30 text-[#1D3557] text-sm font-medium rounded-full mb-6">',
    '              <span className="hero-badge inline-block px-4 py-2 bg-[#A8DADC]/30 text-[#1D3557] text-sm font-medium rounded-full mb-6">',
    "badge tag",
)

# 6. Heading — split into words for the staggered reveal
apply(
    '              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#1D3557] leading-tight mb-6">\n'
    "                SEOUL\n"
    '                <span className="text-[#F4A261]"> & </span>\n'
    "                SPICE\n"
    "              </h1>",
    '              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#1D3557] leading-tight mb-6">\n'
    '                <span className="hero-word inline-block">SEOUL</span>\n'
    '                <span className="hero-word inline-block text-[#F4A261]"> &amp; </span>\n'
    '                <span className="hero-word inline-block">SPICE</span>\n'
    "              </h1>",
    "heading split",
)

# 7. Description
apply(
    '              <p className="text-lg text-[#6C757D] mb-8 max-w-md mx-auto lg:mx-0">',
    '              <p className="hero-desc text-lg text-[#6C757D] mb-8 max-w-md mx-auto lg:mx-0">',
    "description tag",
)

# 8. Buttons — container tag + Shop Now arrow/scale hover + Explore Collections lift
apply(
    '              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">\n'
    '                <Link to="/products" className="btn-primary inline-flex items-center justify-center gap-2">\n'
    "                  Shop Now\n"
    '                  <ArrowRight className="w-4 h-4" />\n'
    "                </Link>\n"
    '                <Link to="/collections" className="btn-secondary inline-flex items-center justify-center">\n'
    "                  Explore Collections\n"
    "                </Link>\n"
    "              </div>",
    '              <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">\n'
    "                <Link\n"
    '                  to="/products"\n'
    '                  className="btn-primary group inline-flex items-center justify-center gap-2 transition-transform duration-300 hover:scale-[1.03]"\n'
    "                >\n"
    "                  Shop Now\n"
    '                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />\n'
    "                </Link>\n"
    "                <Link\n"
    '                  to="/collections"\n'
    '                  className="btn-secondary inline-flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5"\n'
    "                >\n"
    "                  Explore Collections\n"
    "                </Link>\n"
    "              </div>",
    "buttons + hover",
)

# 9. Hero image wrap — tag it, clip it, add hover zoom
apply(
    '              <div className="relative aspect-[3/4] max-w-md mx-auto">\n'
    "                <img\n"
    '                  src="/images/hero-model.jpg"\n'
    '                  alt="SEOUL & SPICE Lifestyle"\n'
    '                  className="w-full h-full object-cover rounded-3xl shadow-2xl"\n'
    "                />",
    '              <div className="hero-image-wrap group relative aspect-[3/4] max-w-md mx-auto overflow-hidden rounded-3xl">\n'
    "                <img\n"
    '                  src="/images/hero-model.jpg"\n'
    '                  alt="SEOUL & SPICE Lifestyle"\n'
    '                  className="w-full h-full object-cover rounded-3xl shadow-2xl transition-transform duration-700 ease-out group-hover:scale-105"\n'
    "                />",
    "hero image hover zoom",
)

# 10. Rating card — tag card + star
apply(
    '                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl">\n'
    '                  <div className="flex items-center gap-3">\n'
    '                    <div className="w-12 h-12 bg-[#A8DADC]/30 rounded-full flex items-center justify-center">\n'
    '                      <Star className="w-6 h-6 text-[#F4A261] fill-[#F4A261]" />\n'
    "                    </div>",
    '                <div className="hero-rating-card absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl">\n'
    '                  <div className="flex items-center gap-3">\n'
    '                    <div className="w-12 h-12 bg-[#A8DADC]/30 rounded-full flex items-center justify-center">\n'
    '                      <Star className="hero-star w-6 h-6 text-[#F4A261] fill-[#F4A261]" />\n'
    "                    </div>",
    "rating card + star tag",
)

# 11. Scroll indicator — make it a clickable, GSAP-driven button
apply(
    "        {/* Scroll Indicator */}\n"
    '        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">\n'
    '          <div className="w-6 h-10 border-2 border-[#1D3557]/30 rounded-full flex justify-center pt-2">\n'
    '            <div className="w-1.5 h-3 bg-[#1D3557]/50 rounded-full" />\n'
    "          </div>\n"
    "        </div>",
    "        {/* Scroll Indicator */}\n"
    "        <button\n"
    '          type="button"\n'
    "          onClick={scrollToNext}\n"
    '          aria-label="Scroll to next section"\n'
    '          className="hero-scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"\n'
    "        >\n"
    '          <div className="w-6 h-10 border-2 border-[#1D3557]/30 rounded-full flex justify-center pt-2 transition-colors duration-300 hover:border-[#1D3557]/60">\n'
    '            <div className="w-1.5 h-3 bg-[#1D3557]/50 rounded-full" />\n'
    "          </div>\n"
    "        </button>",
    "scroll indicator button",
)

backup = FILE.with_suffix(".tsx.bak")
backup.write_text(original, encoding="utf-8")
FILE.write_text(src, encoding="utf-8")

print(f"Patched {FILE} successfully.")
print(f"Original saved to {backup} — delete it once you're happy with the result.")
