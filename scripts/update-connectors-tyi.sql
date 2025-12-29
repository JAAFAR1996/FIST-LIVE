-- Update connectors product: separate T, Y, I variants and remove control valve
UPDATE products 
SET 
  name = 'HOUYI وصلات 4 ملم',
  description = 'وصلات هوائية 4 ملم بأشكال مختلفة. تستخدم لتوزيع الهواء أو الماء.',
  variants = '[
  {
    "id": "t-connector",
    "label": "وصلة T",
    "price": 994,
    "stock": 50,
    "isDefault": true,
    "image": "/images/products/houyi/4mm T& 4mm I &4mm Y/Gemini_Generated_Image_gcjcaxgcjcaxgcjc.png",
    "specifications": {"الشكل": "T"}
  },
  {
    "id": "y-connector",
    "label": "وصلة Y",
    "price": 994,
    "stock": 50,
    "isDefault": false,
    "image": "/images/products/houyi/4mm T& 4mm I &4mm Y/Gemini_Generated_Image_kz3fevkz3fevkz3f.png",
    "specifications": {"الشكل": "Y"}
  },
  {
    "id": "i-connector",
    "label": "موصل مستقيم I",
    "price": 994,
    "stock": 50,
    "isDefault": false,
    "image": "/images/products/houyi/4mm T& 4mm I &4mm Y/Gemini_Generated_Image_kz3fevkz3fevkz3f (1).png",
    "specifications": {"الشكل": "I"}
  }
]'::jsonb
WHERE id = 'houyi-4mm-t-4mm-i-4mm-y';

-- Verify
SELECT id, name, variants FROM products WHERE id = 'houyi-4mm-t-4mm-i-4mm-y';
