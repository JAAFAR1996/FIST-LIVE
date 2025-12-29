-- Update HOUYI Feeding Cup with color variants
UPDATE products 
SET variants = '[
  {
    "id": "green", 
    "label": "أخضر", 
    "price": 1739, 
    "stock": 50, 
    "isDefault": true, 
    "image": "/images/products/houyi/Feeding cup GREEN & WHITE/GREEN.jpg", 
    "specifications": {"اللون": "أخضر"}
  }, 
  {
    "id": "white", 
    "label": "أبيض", 
    "price": 1739, 
    "stock": 50, 
    "isDefault": false, 
    "image": "/images/products/houyi/Feeding cup GREEN & WHITE/H47b4fa0192b74669911646ae641c963eH.png", 
    "specifications": {"اللون": "أبيض"}
  }
]'::jsonb
WHERE id = 'houyi-feeding-cup-green-white';

-- Verify the update
SELECT id, name, has_variants, variants FROM products WHERE id = 'houyi-feeding-cup-green-white';
