#!/bin/bash

# Script to add dynamic export to all API routes that import MongoDB
# This prevents build-time execution errors

FILES=(
  "./src/app/api/buildings/route.js"
  "./src/app/api/buildings/[id]/route.js"
  "./src/app/api/datamodels/route.js"
  "./src/app/api/datamodels/[id]/route.js"
  "./src/app/api/developments/route.js"
  "./src/app/api/like/route.js"
  "./src/app/api/media/route.js"
  "./src/app/api/media/[id]/route.js"
  "./src/app/api/permissions/route.js"
  "./src/app/api/permissions/[id]/route.js"
  "./src/app/api/projects/route.js"
  "./src/app/api/projects/[id]/route.js"
  "./src/app/api/roles/route.js"
  "./src/app/api/roles/[id]/route.js"
  "./src/app/api/users/route.js"
  "./src/app/api/users/[id]/route.js"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    # Check if it already has the dynamic export
    if ! grep -q "export const dynamic" "$file"; then
      echo "Adding dynamic export to $file"
      
      # Find the line number of the first import
      first_import=$(grep -n "^import" "$file" | tail -1 | cut -d: -f1)
      
      if [ ! -z "$first_import" ]; then
        # Add the export after the last import
        sed -i '' "${first_import}a\\
\\
// Prevent build-time execution\\
export const dynamic = 'force-dynamic';\\
export const runtime = 'nodejs';" "$file"
        echo "  ✓ Added to $file"
      else
        echo "  ⚠ No imports found in $file, skipping"
      fi
    else
      echo "  ✓ $file already has dynamic export"
    fi
  else
    echo "  ✗ File not found: $file"
  fi
done

echo ""
echo "Done! All API routes have been updated."
