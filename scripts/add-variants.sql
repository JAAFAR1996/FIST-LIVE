-- Add color variants to HOUYI Feeding Cup
-- Run this SQL script in NEON database

-- Step 1: Find the product ID
SELECT id, name, price, images 
FROM products 
WHERE name LIKE '%كوب تغذية%' AND brand = 'HOUYI';

-- Step 2: Update the product to enable variants
-- Replace 'PRODUCT_ID_HERE' with the actual ID from step 1
UPDATE products 
SET 
  has_variants = true,
  variants = '[
    {
      "id": "green",
      "label": "أخضر",
      "price": 0,
      "stock": 50,
      "isDefault": true,
      "specifications": {
        "color": "أخضر",
        "colorCode": "#4CAF50"
      }
    },
    {
      "id": "white",
      "label": "أبيض",
      "price": 0,
      "stock": 50,
      "isDefault": false,
      "specifications": {
        "color": "أبيض",
        "colorCode": "#FFFFFF"
      }
    }
  ]'::jsonb,
  updated_at = NOW()
WHERE id = 'PRODUCT_ID_HERE';

-- Step 3: Verify the update
SELECT id, name, has_variants, variants 
FROM products 
WHERE id = 'PRODUCT_ID_HERE';
