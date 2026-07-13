#!/bin/bash
# ─────────────────────────────────────────────────────────────
# Seoul & Spice — Full E2E Test Runner
# ─────────────────────────────────────────────────────────────

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║   Seoul & Spice — E2E Test Suite           ║"
echo "║   Backend + Frontend + Admin Panel         ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Check servers are running
echo "🔍 Checking servers..."
if ! curl -s http://localhost:3001/api/health > /dev/null 2>&1; then
  echo "❌ Backend not running! Start with: cd server && npm run dev"
  exit 1
fi
echo "  ✅ Backend (port 3001)"

if ! curl -s http://localhost:5173 > /dev/null 2>&1; then
  echo "❌ Frontend not running! Start with: npm run dev"
  exit 1
fi
echo "  ✅ Frontend (port 5173)"
echo ""

# Install playwright if needed
if ! npx playwright --version > /dev/null 2>&1; then
  echo "📦 Installing Playwright..."
  npm install
  npx playwright install chromium
fi

echo "🚀 Running tests..."
echo ""

# Run all tests
npx playwright test --reporter=list 2>&1 | tee test-results.txt

echo ""
echo "📊 Generating HTML report..."
echo ""

# Count results
PASSED=$(grep -c "✓\|passed" test-results.txt 2>/dev/null || echo "0")
FAILED=$(grep -c "✗\|failed\|×" test-results.txt 2>/dev/null || echo "0")

echo "╔════════════════════════════════════════════╗"
echo "║   Test Results Summary                     ║"
echo "╠════════════════════════════════════════════╣"
echo "║   ✅ Passed: $(printf '%-34s' "$PASSED")║"
echo "║   ❌ Failed: $(printf '%-34s' "$FAILED")║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo "📄 Full report: npx playwright show-report"
echo ""
echo "🔧 Run autofix for common issues:"
echo "   bash autofix.sh /Users/joshwa/Downloads/ecommerce"
echo ""