from pathlib import Path

f = Path("src/components/Footer.tsx")
src = f.read_text(encoding="utf-8")


def apply(old, new, label):
    global src
    count = src.count(old)
    if count != 1:
        raise SystemExit(f"[ABORTED] Anchor for '{label}' matched {count} time(s), expected 1.")
    src = src.replace(old, new, 1)


# 1. Drop the now-unused imports/state/handler
apply(
    "import { Link } from 'react-router';\n"
    "import { Instagram, Facebook, Twitter, Youtube, Mail, MapPin, Phone } from 'lucide-react';\n"
    "import { useState } from 'react';\n"
    "import { toast } from 'sonner';\n",
    "import { Link } from 'react-router';\n"
    "import { Instagram, Facebook, Twitter, Youtube, Mail, MapPin, Phone } from 'lucide-react';\n",
    "imports",
)

apply(
    "export default function Footer() {\n"
    "  const [email, setEmail] = useState('');\n"
    "\n"
    "  const handleSubscribe = (e: React.FormEvent) => {\n"
    "    e.preventDefault();\n"
    "    if (email) {\n"
    "      toast.success('Thank you for subscribing!');\n"
    "      setEmail('');\n"
    "    }\n"
    "  };\n"
    "\n"
    "  return (\n",
    "export default function Footer() {\n"
    "  return (\n",
    "state + handler",
)

# 2. Remove the whole newsletter section block
apply(
    '    <footer className="bg-[#1D3557] text-white">\n'
    "      {/* Newsletter Section */}\n"
    '      <div className="section-padding py-12 border-b border-white/10">\n'
    '        <div className="max-w-7xl mx-auto">\n'
    '          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">\n'
    '            <div className="text-center lg:text-left">\n'
    '              <h3 className="text-2xl font-semibold mb-2">Join the Community</h3>\n'
    '              <p className="text-white/70">\n'
    "                Subscribe for exclusive offers, new arrivals, and beauty tips.\n"
    "              </p>\n"
    "            </div>\n"
    '            <form onSubmit={handleSubscribe} className="flex w-full max-w-md gap-3">\n'
    "              <input\n"
    '                type="email"\n'
    "                value={email}\n"
    "                onChange={(e) => setEmail(e.target.value)}\n"
    '                placeholder="Enter your email"\n'
    '                className="flex-1 px-5 py-3 rounded-full bg-white/10 border border-white/20 \n'
    "                         text-white placeholder:text-white/50 focus:outline-none focus:ring-2 \n"
    '                         focus:ring-[#A8DADC] transition-all"\n'
    "                required\n"
    "              />\n"
    "              <button\n"
    '                type="submit"\n'
    '                className="px-6 py-3 bg-[#A8DADC] text-[#1D3557] font-medium rounded-full\n'
    '                         hover:bg-[#F4A261] hover:text-white transition-colors"\n'
    "              >\n"
    "                Subscribe\n"
    "              </button>\n"
    "            </form>\n"
    "          </div>\n"
    "        </div>\n"
    "      </div>\n"
    "\n"
    "      {/* Main Footer */}\n",
    '    <footer className="bg-[#1D3557] text-white">\n'
    "      {/* Main Footer */}\n",
    "newsletter section",
)

f.write_text(src, encoding="utf-8")
print(f"Removed newsletter section from {f}.")
