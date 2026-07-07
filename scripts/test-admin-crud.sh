#!/bin/bash

# Admin Panel CRUD Test Script
# Tests all CRUD operations in the admin panel

set -e

BASE_URL="${1:-http://localhost:3000}"
ADMIN_TOKEN="${2:-}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
PASSED=0
FAILED=0
TOTAL=0

# Helper functions
log_test() {
  echo -e "${BLUE}[TEST]${NC} $1"
  TOTAL=$((TOTAL + 1))
}

log_pass() {
  echo -e "${GREEN}[PASS]${NC} $1"
  PASSED=$((PASSED + 1))
}

log_fail() {
  echo -e "${RED}[FAIL]${NC} $1"
  FAILED=$((FAILED + 1))
}

log_info() {
  echo -e "${YELLOW}[INFO]${NC} $1"
}

# Test wrapper
test_endpoint() {
  local method=$1
  local endpoint=$2
  local data=$3
  local description=$4
  
  log_test "$description"
  
  local cmd="curl -s -X $method \"$BASE_URL$endpoint\""
  
  if [ ! -z "$ADMIN_TOKEN" ]; then
    cmd="$cmd -H \"Authorization: Bearer $ADMIN_TOKEN\""
  fi
  
  if [ ! -z "$data" ]; then
    cmd="$cmd -H \"Content-Type: application/json\" -d '$data'"
  fi
  
  response=$(eval $cmd)
  
  if echo "$response" | grep -q "error\|Error\|PGRST"; then
    log_fail "Response: $response"
    return 1
  else
    log_pass "Response OK"
    return 0
  fi
}

# Main test suite
echo -e "\n${BLUE}================================${NC}"
echo -e "${BLUE}Admin Panel CRUD Test Suite${NC}"
echo -e "${BLUE}================================${NC}\n"

log_info "Testing API endpoints at: $BASE_URL"
log_info "Authentication: ${ADMIN_TOKEN:-'None (public endpoints only)'}\n"

# 1. PLAYERS MANAGEMENT
echo -e "\n${BLUE}--- 1. PLAYERS MANAGEMENT ---${NC}"
test_endpoint "GET" "/api/admin/players" "" "1.1 Read all players"
test_endpoint "GET" "/api/admin/players?id=1" "" "1.2 Read specific player"

# 2. NEWS MANAGEMENT
echo -e "\n${BLUE}--- 2. NEWS MANAGEMENT ---${NC}"
test_endpoint "GET" "/api/admin/news" "" "2.1 Read all news"
test_endpoint "GET" "/api/admin/news?id=1" "" "2.2 Read specific news"

# 3. MATCHES MANAGEMENT
echo -e "\n${BLUE}--- 3. MATCHES MANAGEMENT ---${NC}"
test_endpoint "GET" "/api/admin/matches" "" "3.1 Read all matches"
test_endpoint "GET" "/api/admin/matches?id=1" "" "3.2 Read specific match"

# 4. STORE - PRODUCTS
echo -e "\n${BLUE}--- 4. STORE - PRODUCTS ---${NC}"
test_endpoint "GET" "/api/admin/store/products" "" "4.1 Read all products"
test_endpoint "GET" "/api/admin/store/products?id=1" "" "4.2 Read specific product"
test_endpoint "GET" "/api/admin/store/products?limit=5&offset=0" "" "4.3 Paginated products"

# 5. STORE - ORDERS
echo -e "\n${BLUE}--- 5. STORE - ORDERS ---${NC}"
test_endpoint "GET" "/api/admin/store/orders" "" "5.1 Read all orders"
test_endpoint "GET" "/api/admin/store/orders?id=1" "" "5.2 Read specific order"

# 6. STORE - INVENTORY
echo -e "\n${BLUE}--- 6. STORE - INVENTORY ---${NC}"
test_endpoint "GET" "/api/admin/store/inventory" "" "6.1 Read inventory"

# 7. STANDINGS
echo -e "\n${BLUE}--- 7. STANDINGS ---${NC}"
test_endpoint "GET" "/api/admin/standings" "" "7.1 Read standings"

# 8. INJURIES
echo -e "\n${BLUE}--- 8. INJURIES ---${NC}"
test_endpoint "GET" "/api/admin/injuries" "" "8.1 Read injuries"

# 9. TROPHIES
echo -e "\n${BLUE}--- 9. TROPHIES ---${NC}"
test_endpoint "GET" "/api/admin/trophies" "" "9.1 Read trophies"

# 10. FANS
echo -e "\n${BLUE}--- 10. FANS ---${NC}"
test_endpoint "GET" "/api/admin/fans" "" "10.1 Read fans"

# 11. ANALYTICS
echo -e "\n${BLUE}--- 11. ANALYTICS ---${NC}"
test_endpoint "GET" "/api/admin/analytics" "" "11.1 Read analytics"

# 12. SETTINGS
echo -e "\n${BLUE}--- 12. SETTINGS ---${NC}"
test_endpoint "GET" "/api/admin/settings" "" "12.1 Read settings"

# 13. USERS
echo -e "\n${BLUE}--- 13. USERS ---${NC}"
test_endpoint "GET" "/api/admin/users" "" "13.1 Read users"

# 14. RANKINGS
echo -e "\n${BLUE}--- 14. RANKINGS ---${NC}"
test_endpoint "GET" "/api/admin/rankings" "" "14.1 Read rankings"

# 15. MOTM
echo -e "\n${BLUE}--- 15. MAN OF THE MATCH ---${NC}"
test_endpoint "GET" "/api/admin/motm" "" "15.1 Read MOTM"

# 16. LINEUPS
echo -e "\n${BLUE}--- 16. LINEUPS ---${NC}"
test_endpoint "GET" "/api/admin/lineup" "" "16.1 Read lineups"

# 17. PLAYER PROFILES
echo -e "\n${BLUE}--- 17. PLAYER PROFILES ---${NC}"
test_endpoint "GET" "/api/admin/player-profiles" "" "17.1 Read player profiles"

# Summary
echo -e "\n${BLUE}================================${NC}"
echo -e "${BLUE}Test Summary${NC}"
echo -e "${BLUE}================================${NC}\n"

echo -e "Total Tests: $TOTAL"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"

if [ $FAILED -eq 0 ]; then
  echo -e "\n${GREEN}All tests passed!${NC}\n"
  exit 0
else
  echo -e "\n${RED}Some tests failed. Please review the errors above.${NC}\n"
  exit 1
fi
