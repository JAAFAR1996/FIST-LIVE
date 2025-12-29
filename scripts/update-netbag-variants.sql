-- Update net bag with colors and sizes variants (6 options)
UPDATE products 
SET 
  name = 'HOUYI حقيبة شبكية للفلتر',
  description = 'حقيبة شبكية لوضع مواد الفلتر. متوفرة بلونين (أسود وأبيض) و3 أحجام (صغير، وسط، كبير).',
  variants = '[
  {
    "id": "black-small",
    "label": "أسود - صغير S",
    "price": 994,
    "stock": 25,
    "isDefault": true,
    "image": "/images/products/houyi/Net bag BLACK & WHITE/H5eac5e53a646436a8e50ccb0f5bcdfdcP.jpg",
    "specifications": {"اللون": "أسود", "الحجم": "صغير S"}
  },
  {
    "id": "black-medium",
    "label": "أسود - وسط M",
    "price": 994,
    "stock": 25,
    "isDefault": false,
    "image": "/images/products/houyi/Net bag BLACK & WHITE/H6a394cc56ac4416aa8368b72b65f88536.jpg",
    "specifications": {"اللون": "أسود", "الحجم": "وسط M"}
  },
  {
    "id": "black-large",
    "label": "أسود - كبير L",
    "price": 994,
    "stock": 25,
    "isDefault": false,
    "image": "/images/products/houyi/Net bag BLACK & WHITE/H7129d7e91eb34918a98c67972e68644dC.jpg",
    "specifications": {"اللون": "أسود", "الحجم": "كبير L"}
  },
  {
    "id": "white-small",
    "label": "أبيض - صغير S",
    "price": 994,
    "stock": 25,
    "isDefault": false,
    "image": "/images/products/houyi/Net bag BLACK & WHITE/WHITE.jpg",
    "specifications": {"اللون": "أبيض", "الحجم": "صغير S"}
  },
  {
    "id": "white-medium",
    "label": "أبيض - وسط M",
    "price": 994,
    "stock": 25,
    "isDefault": false,
    "image": "/images/products/houyi/Net bag BLACK & WHITE/WHITE 2.jpg",
    "specifications": {"اللون": "أبيض", "الحجم": "وسط M"}
  },
  {
    "id": "white-large",
    "label": "أبيض - كبير L",
    "price": 994,
    "stock": 25,
    "isDefault": false,
    "image": "/images/products/houyi/Net bag BLACK & WHITE/H7b7ead7c6ea54d05a8b3fa86b604fbb6I.jpg",
    "specifications": {"اللون": "أبيض", "الحجم": "كبير L"}
  }
]'::jsonb
WHERE id = 'houyi-net-bag-black-white';

-- Verify
SELECT id, name, jsonb_array_length(variants) as variant_count FROM products WHERE id = 'houyi-net-bag-black-white';
