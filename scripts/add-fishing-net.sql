-- Add small fishing net product as HOUYI brand
INSERT INTO products (
    id, slug, name, brand, category, subcategory, 
    description, price, stock, is_new, 
    images, thumbnail, specifications, has_variants
) VALUES (
    'houyi-small-wholesale-aquarium-special-nylon-fishing-net',
    'houyi-small-wholesale-aquarium-special-nylon-fishing-net',
    'HOUYI شبكة أسماك نايلون صغيرة',
    'HOUYI',
    'maintenance',
    'fish-nets',
    'شبكة أسماك نايلون صغيرة عالية الجودة. مثالية لصيد الأسماك الصغيرة والزريعة. خفيفة الوزن وسهلة الاستخدام.',
    '740',
    50,
    true,
    '["/images/products/houyi/small Wholesale Aquarium Special Nylon Fishing Net/H1d7c805fe0d5432cb589d957890466ca2.jpg", "/images/products/houyi/small Wholesale Aquarium Special Nylon Fishing Net/H23409b418b0445d3a1fe0f063f40f140w.jpg", "/images/products/houyi/small Wholesale Aquarium Special Nylon Fishing Net/H93f96006174d4adaad4d477c791bbb51f.jpg", "/images/products/houyi/small Wholesale Aquarium Special Nylon Fishing Net/H9e006f63adbb47799fc6e0244d7eb5be2.jpg", "/images/products/houyi/small Wholesale Aquarium Special Nylon Fishing Net/Hdc741b24ec85421abd72b791753a8acb6.jpg"]'::jsonb,
    '/images/products/houyi/small Wholesale Aquarium Special Nylon Fishing Net/H1d7c805fe0d5432cb589d957890466ca2.jpg',
    '{"العلامة التجارية": "HOUYI", "المادة": "نايلون", "الحجم": "صغير"}'::jsonb,
    false
);

-- Verify
SELECT id, name, brand FROM products WHERE id = 'houyi-small-wholesale-aquarium-special-nylon-fishing-net';
