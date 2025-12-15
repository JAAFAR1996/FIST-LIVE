-- إضافة السعر الأصلي (خصم 10%) لجميع المنتجات التي لا تحتوي على originalPrice
-- هذا سيجعلها تظهر في صفحة العروض

UPDATE products 
SET original_price = ROUND(CAST(price AS numeric) * 1.15)
WHERE original_price IS NULL 
  AND deleted_at IS NULL;

-- للتحقق من النتيجة
SELECT id, name, price, original_price, 
       ROUND(((CAST(original_price AS numeric) - CAST(price AS numeric)) / CAST(original_price AS numeric)) * 100) as discount_percent
FROM products 
WHERE original_price IS NOT NULL 
  AND deleted_at IS NULL
LIMIT 10;
