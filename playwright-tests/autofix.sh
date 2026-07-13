#!/bin/bash
# ─────────────────────────────────────────────────────────────
# Seoul & Spice — Auto-fix script
# Run AFTER playwright tests to patch common issues
# Usage: bash autofix.sh /path/to/ecommerce
# ─────────────────────────────────────────────────────────────

PROJECT=${1:-"/Users/joshwa/Downloads/ecommerce"}
SRC="$PROJECT/src"

echo ""
echo "🔧 Seoul & Spice Auto-Fix Script"
echo "================================="
echo "Project: $PROJECT"
echo ""

FIXES=0

# ── Fix 1: Products dependency in useMemo ────────────────────
echo "Checking Products.tsx useMemo dependency..."
if grep -q "selectedCategory, selectedSubcategories, priceRange, sortBy\]" "$SRC/pages/Products.tsx" 2>/dev/null; then
  sed -i '' 's/\[selectedCategory, selectedSubcategories, priceRange, sortBy\]/[products, selectedCategory, selectedSubcategories, priceRange, sortBy]/' "$SRC/pages/Products.tsx"
  echo "  ✅ Fixed: Added 'products' to useMemo dependency array"
  ((FIXES++))
else
  echo "  ✓ OK"
fi

# ── Fix 2: Dollar signs in ProductCard ──────────────────────
echo "Checking ProductCard.tsx for dollar signs..."
if grep -q '\${product\.price}' "$SRC/components/ProductCard.tsx" 2>/dev/null; then
  sed -i '' 's/\${product\.price}/₹{product.price}/g' "$SRC/components/ProductCard.tsx"
  sed -i '' 's/\${product\.originalPrice}/₹{product.originalPrice}/g' "$SRC/components/ProductCard.tsx"
  echo "  ✅ Fixed: Replaced \$ with ₹ in ProductCard"
  ((FIXES++))
else
  echo "  ✓ OK"
fi

# ── Fix 3: Double ₹₹ symbols ────────────────────────────────
echo "Checking for double ₹₹ symbols..."
DOUBLE=$(grep -rl '₹₹' "$SRC" --include="*.tsx" --include="*.ts" 2>/dev/null)
if [ -n "$DOUBLE" ]; then
  find "$SRC" -name "*.tsx" -o -name "*.ts" | xargs sed -i '' 's/₹₹{/₹{/g' 2>/dev/null
  echo "  ✅ Fixed: Removed double ₹₹ in: $DOUBLE"
  ((FIXES++))
else
  echo "  ✓ OK"
fi

# ── Fix 4: AdminProducts using store.ts instead of api.ts ───
echo "Checking AdminProducts.tsx imports..."
if grep -q "from '@/lib/store'" "$SRC/admin/pages/AdminProducts.tsx" 2>/dev/null; then
  echo "  ⚠️  AdminProducts still imports from store.ts - manual fix needed"
  echo "     Run: See previous fix instructions"
else
  echo "  ✓ OK"
fi

# ── Fix 5: Quantity cap in ProductDetail ─────────────────────
echo "Checking ProductDetail.tsx quantity cap..."
if grep -q "prev + 1)" "$SRC/pages/ProductDetail.tsx" 2>/dev/null; then
  sed -i '' 's/onClick={() => setQuantity((prev) => prev + 1)}/onClick={() => setQuantity((prev) => Math.min(maxQty, prev + 1))}/' "$SRC/pages/ProductDetail.tsx"
  echo "  ✅ Fixed: Added maxQty cap to + button"
  ((FIXES++))
else
  echo "  ✓ OK"
fi

# ── Fix 6: Price range max too low ──────────────────────────
echo "Checking Products.tsx price range max..."
if grep -q 'useState.*\[0, 200\]' "$SRC/pages/Products.tsx" 2>/dev/null; then
  sed -i '' 's/useState<\[number, number\]>(\[0, 200\])/useState<[number, number]>([0, 500])/' "$SRC/pages/Products.tsx"
  sed -i '' 's/max={200}/max={500}/g' "$SRC/pages/Products.tsx"
  sed -i '' 's/priceRange\[1\] < 200/priceRange[1] < 500/g' "$SRC/pages/Products.tsx"
  sed -i '' 's/setPriceRange(\[0, 200\])/setPriceRange([0, 500])/g' "$SRC/pages/Products.tsx"
  echo "  ✅ Fixed: Price range max increased to 500"
  ((FIXES++))
else
  echo "  ✓ OK"
fi

# ── Fix 7: Home.tsx static data import ──────────────────────
echo "Checking Home.tsx for static products import..."
if grep -q "from '@/data/products'" "$SRC/pages/Home.tsx" 2>/dev/null; then
  echo "  ⚠️  Home.tsx uses static products - needs migration to useProducts() hook"
else
  echo "  ✓ OK"
fi

# ── Fix 8: .env path in db/index.ts ─────────────────────────
echo "Checking server db/index.ts .env path..."
SERVER_DB="$PROJECT/server/db/index.ts"
if grep -q "path.resolve(__dirname" "$SERVER_DB" 2>/dev/null; then
  echo "  ✓ OK (using path.resolve)"
elif grep -q "hardcoded" "$SERVER_DB" 2>/dev/null; then
  echo "  ⚠️  db/index.ts may have hardcoded path"
else
  echo "  ✓ OK"
fi

echo ""
echo "================================="
echo "🎉 Auto-fix complete: $FIXES fixes applied"
echo ""

# ── Summary of remaining manual fixes ───────────────────────
echo "📋 Manual fixes still needed (check test report):"
echo "  1. If Home.tsx shows static data: migrate to useProducts() hook"
echo "  2. If admin edit modal doesn't save: check JWT token in sessionStorage"  
echo "  3. If checkout redirects on empty cart: verify CartContext"
echo "  4. If stock label missing: check getStockLabel threshold (default=10)"
echo ""