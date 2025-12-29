-- Merge products: Control Valve + Multi Connectors into ONE product with variants

-- Step 1: Update the connectors product to include both as variants
UPDATE products 
SET 
  name = 'HOUYI وصلات ومحابس 4 ملم',
  description = 'مجموعة وصلات ومحابس هوائية 4 ملم. تشمل وصلات بأشكال مختلفة (T, I, Y) وصمام تحكم للتحكم الدقيق بتدفق الهواء.',
  has_variants = true,
  variants = '[
  {
    "id": "connectors",
    "label": "وصلات (T, I, Y)",
    "price": 994,
    "stock": 50,
    "isDefault": true,
    "image": "/images/products/houyi/4mm T& 4mm I &4mm Y/Gemini_Generated_Image_gcjcaxgcjcaxgcjc.png",
    "specifications": {"النوع": "وصلات متعددة", "الأشكال": "T, I, Y"}
  },
  {
    "id": "control-valve",
    "label": "صمام تحكم",
    "price": 497,
    "stock": 50,
    "isDefault": false,
    "image": "/images/products/houyi/Control valve 4mm/H17199b252bb449a0a4edd1034ebe0b167.jpg",
    "specifications": {"النوع": "صمام تحكم"}
  }
]'::jsonb
WHERE id = 'houyi-4mm-t-4mm-i-4mm-y';

-- Step 2: Delete the old control valve product
DELETE FROM products WHERE id = 'houyi-control-valve-4mm';

-- Verify the result
SELECT id, name, has_variants, variants FROM products WHERE id = 'houyi-4mm-t-4mm-i-4mm-y';
