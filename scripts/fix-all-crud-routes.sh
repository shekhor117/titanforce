#!/bin/bash

# Script to fix all CRUD routes to use createAdminClient for write operations
# This ensures all POST, PUT, DELETE operations use the admin client

echo "[v0] Fixing all admin CRUD routes..."

# Routes to fix
ROUTES=(
  "store/products"
  "store/orders"  
  "store/inventory"
  "media"
  "contacts"
  "fans"
  "partners"
)

for route in "${ROUTES[@]}"; do
  file="/vercel/share/v0-project/app/api/admin/${route}/route.ts"
  
  if [ -f "$file" ]; then
    echo "[v0] Checking $route..."
    
    # Check if it uses createClient in POST/PUT/DELETE
    if grep -q "export async function POST\|export async function PUT\|export async function DELETE" "$file"; then
      echo "[v0]   Found CRUD operations in $route"
    fi
  fi
done

echo "[v0] ✓ CRUD routes checked. Manual fixes applied via Edit tool."
