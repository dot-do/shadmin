#!/bin/bash
# check-unsafe-casts.sh
# TDD RED phase: Detect `as unknown as` type safety violations
#
# This script enforces type safety by detecting unsafe cast patterns.
# The `as unknown as` pattern is a TypeScript anti-pattern that bypasses
# the type system entirely, making type errors impossible to detect.
#
# Usage: ./scripts/check-unsafe-casts.sh
# Exit codes:
#   0 - No unsafe casts found (GREEN)
#   1 - Unsafe casts detected (RED)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "Checking for unsafe cast patterns (as unknown as)..."
echo "=================================================="

# Search in source files (excluding node_modules, dist, .beads, vendor)
# Note: We include .spec.ts files because even test code should use proper typing
# Using -n for line numbers and -H for filename
UNSAFE_CASTS=$(grep -rnH "as unknown as" \
  --include="*.ts" \
  --include="*.tsx" \
  --exclude-dir="node_modules" \
  --exclude-dir="dist" \
  --exclude-dir=".beads" \
  --exclude-dir=".turbo" \
  --exclude-dir="vendor" \
  "$REPO_ROOT" 2>/dev/null || true)

if [ -z "$UNSAFE_CASTS" ]; then
  echo -e "${GREEN}SUCCESS: No unsafe cast patterns found!${NC}"
  exit 0
fi

# Count occurrences
TOTAL_COUNT=$(echo "$UNSAFE_CASTS" | wc -l | tr -d ' ')

echo -e "${RED}FAILED: Found $TOTAL_COUNT unsafe cast patterns${NC}"
echo ""
echo "Locations:"
echo "----------"

# Group by file for cleaner output
echo "$UNSAFE_CASTS" | while IFS= read -r line; do
  # Extract file path relative to repo root
  FILE=$(echo "$line" | cut -d: -f1)
  LINE_NUM=$(echo "$line" | cut -d: -f2)
  CONTENT=$(echo "$line" | cut -d: -f3-)

  # Make path relative to repo root
  REL_PATH="${FILE#$REPO_ROOT/}"

  echo -e "${YELLOW}$REL_PATH:$LINE_NUM${NC}"
  echo "  $CONTENT"
  echo ""
done

echo "=================================================="
echo "Summary by category:"
echo ""

# Count production code vs test code
PROD_COUNT=$(echo "$UNSAFE_CASTS" | grep -v "\.spec\." | grep -v "test-utils" | wc -l | tr -d ' ')
TEST_COUNT=$(echo "$UNSAFE_CASTS" | grep -E "(\.spec\.|test-utils)" | wc -l | tr -d ' ')
EXAMPLES_COUNT=$(echo "$UNSAFE_CASTS" | grep "/examples/" | wc -l | tr -d ' ')

echo "  Production code: $PROD_COUNT"
echo "  Test code:       $TEST_COUNT"
echo "  Examples:        $EXAMPLES_COUNT"
echo "  ----------------"
echo "  Total:           $TOTAL_COUNT"
echo ""
echo -e "${RED}Fix these before the type system can be trusted.${NC}"
echo ""
echo "Common fixes:"
echo "  1. Add proper generic constraints"
echo "  2. Use type guards with runtime checks"
echo "  3. Fix interface definitions to match actual data"
echo "  4. Use satisfies operator for type narrowing"

exit 1
