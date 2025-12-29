-- Update HOUYI Air Distributor with port count variants
UPDATE products 
SET 
  has_variants = true,
  variants = '[
  {
    "id": "4-ports", 
    "label": "4 فتحات", 
    "price": 1490, 
    "stock": 50, 
    "isDefault": true, 
    "image": "/images/products/houyi/4 port blue & 6port blue/Gemini_Generated_Image_4sz8dd4sz8dd4sz8.png", 
    "specifications": {"عدد الفتحات": "4"}
  }, 
  {
    "id": "6-ports", 
    "label": "6 فتحات", 
    "price": 1490, 
    "stock": 50, 
    "isDefault": false, 
    "image": "/images/products/houyi/4 port blue & 6port blue/Gemini_Generated_Image_enm96penm96penm9.png", 
    "specifications": {"عدد الفتحات": "6"}
  }
]'::jsonb
WHERE id = 'houyi-4-port-blue-6port-blue';

-- Verify the update
SELECT id, name, has_variants, variants FROM products WHERE id = 'houyi-4-port-blue-6port-blue';
