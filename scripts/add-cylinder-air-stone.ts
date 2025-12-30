/**
 * Add Cylinder Air Stone Product with Multiple Size Variants
 * Based on the product table provided by the user
 */

import { getDb } from "../server/db";
import { products, type ProductVariant } from "../shared/schema";

const db = getDb();
if (!db) {
    console.error("❌ Database connection failed. Check DATABASE_URL.");
    process.exit(1);
}

// USD to IQD conversion + 35% profit margin
const USD_TO_IQD = 1480;
const PROFIT_MARGIN = 1.35;

function usdToIqd(usd: number): number {
    return Math.round(usd * USD_TO_IQD * PROFIT_MARGIN);
}

// All Cylinder Air Stone variants from the product table
const cylinderAirStoneVariants: ProductVariant[] = [
    // 10mm*25mm - Grey Only
    {
        id: "10x25-grey",
        label: "10×25 ملم - رمادي",
        price: usdToIqd(0.07),
        stock: 10,
        sku: "CAS-10x25-G",
        isDefault: true,
        specifications: {
            "المقاس": "10×25 ملم",
            "اللون": "رمادي",
            "قطر التوصيل": "4 ملم"
        }
    },
    // 10mm*30mm - Grey Only
    {
        id: "10x30-grey",
        label: "10×30 ملم - رمادي",
        price: usdToIqd(0.07),
        stock: 10,
        sku: "CAS-10x30-G",
        specifications: {
            "المقاس": "10×30 ملم",
            "اللون": "رمادي",
            "قطر التوصيل": "4 ملم"
        }
    },
    // 12mm*25mm - Grey
    {
        id: "12x25-grey",
        label: "12×25 ملم - رمادي",
        price: usdToIqd(0.07),
        stock: 10,
        sku: "CAS-12x25-G",
        specifications: {
            "المقاس": "12×25 ملم",
            "اللون": "رمادي",
            "قطر التوصيل": "4 ملم"
        }
    },
    // 12mm*25mm - Blue
    {
        id: "12x25-blue",
        label: "12×25 ملم - أزرق",
        price: usdToIqd(0.07),
        stock: 10,
        sku: "CAS-12x25-B",
        specifications: {
            "المقاس": "12×25 ملم",
            "اللون": "أزرق",
            "قطر التوصيل": "4 ملم"
        }
    },
    // 13mm*25mm - Grey
    {
        id: "13x25-grey",
        label: "13×25 ملم - رمادي",
        price: usdToIqd(0.07),
        stock: 10,
        sku: "CAS-13x25-G",
        specifications: {
            "المقاس": "13×25 ملم",
            "اللون": "رمادي",
            "قطر التوصيل": "4 ملم"
        }
    },
    // 13mm*25mm - Blue
    {
        id: "13x25-blue",
        label: "13×25 ملم - أزرق",
        price: usdToIqd(0.07),
        stock: 10,
        sku: "CAS-13x25-B",
        specifications: {
            "المقاس": "13×25 ملم",
            "اللون": "أزرق",
            "قطر التوصيل": "4 ملم"
        }
    },
    // 15mm*25mm - Grey
    {
        id: "15x25-grey",
        label: "15×25 ملم - رمادي",
        price: usdToIqd(0.06),
        stock: 5,
        sku: "CAS-15x25-G",
        specifications: {
            "المقاس": "15×25 ملم",
            "اللون": "رمادي",
            "قطر التوصيل": "4 ملم"
        }
    },
    // 15mm*25mm - Blue
    {
        id: "15x25-blue",
        label: "15×25 ملم - أزرق",
        price: usdToIqd(0.06),
        stock: 5,
        sku: "CAS-15x25-B",
        specifications: {
            "المقاس": "15×25 ملم",
            "اللون": "أزرق",
            "قطر التوصيل": "4 ملم"
        }
    },
    // 15mm*30mm - Grey
    {
        id: "15x30-grey",
        label: "15×30 ملم - رمادي",
        price: usdToIqd(0.07),
        stock: 10,
        sku: "CAS-15x30-G",
        specifications: {
            "المقاس": "15×30 ملم",
            "اللون": "رمادي",
            "قطر التوصيل": "4 ملم"
        }
    },
    // 15mm*30mm - Blue
    {
        id: "15x30-blue",
        label: "15×30 ملم - أزرق",
        price: usdToIqd(0.07),
        stock: 10,
        sku: "CAS-15x30-B",
        specifications: {
            "المقاس": "15×30 ملم",
            "اللون": "أزرق",
            "قطر التوصيل": "4 ملم"
        }
    },
    // 18mm*30mm - Grey
    {
        id: "18x30-grey",
        label: "18×30 ملم - رمادي",
        price: usdToIqd(0.08),
        stock: 5,
        sku: "CAS-18x30-G",
        specifications: {
            "المقاس": "18×30 ملم",
            "اللون": "رمادي",
            "قطر التوصيل": "4 ملم"
        }
    },
    // 18mm*30mm - Blue
    {
        id: "18x30-blue",
        label: "18×30 ملم - أزرق",
        price: usdToIqd(0.08),
        stock: 5,
        sku: "CAS-18x30-B",
        specifications: {
            "المقاس": "18×30 ملم",
            "اللون": "أزرق",
            "قطر التوصيل": "4 ملم"
        }
    },
    // 18mm*45mm - Grey
    {
        id: "18x45-grey",
        label: "18×45 ملم - رمادي",
        price: usdToIqd(0.12),
        stock: 10,
        sku: "CAS-18x45-G",
        specifications: {
            "المقاس": "18×45 ملم",
            "اللون": "رمادي",
            "قطر التوصيل": "4 ملم"
        }
    },
    // 18mm*45mm - Blue
    {
        id: "18x45-blue",
        label: "18×45 ملم - أزرق",
        price: usdToIqd(0.12),
        stock: 10,
        sku: "CAS-18x45-B",
        specifications: {
            "المقاس": "18×45 ملم",
            "اللون": "أزرق",
            "قطر التوصيل": "4 ملم"
        }
    },
    // 18mm*50mm - Grey
    {
        id: "18x50-grey",
        label: "18×50 ملم - رمادي",
        price: usdToIqd(0.13),
        stock: 5,
        sku: "CAS-18x50-G",
        specifications: {
            "المقاس": "18×50 ملم",
            "اللون": "رمادي",
            "قطر التوصيل": "4 ملم"
        }
    },
    // 18mm*50mm - Blue
    {
        id: "18x50-blue",
        label: "18×50 ملم - أزرق",
        price: usdToIqd(0.13),
        stock: 5,
        sku: "CAS-18x50-B",
        specifications: {
            "المقاس": "18×50 ملم",
            "اللون": "أزرق",
            "قطر التوصيل": "4 ملم"
        }
    },
    // 20mm*50mm - Grey
    {
        id: "20x50-grey",
        label: "20×50 ملم - رمادي",
        price: usdToIqd(0.13),
        stock: 10,
        sku: "CAS-20x50-G",
        specifications: {
            "المقاس": "20×50 ملم",
            "اللون": "رمادي",
            "قطر التوصيل": "4 ملم"
        }
    },
    // 20mm*50mm - Blue
    {
        id: "20x50-blue",
        label: "20×50 ملم - أزرق",
        price: usdToIqd(0.13),
        stock: 10,
        sku: "CAS-20x50-B",
        specifications: {
            "المقاس": "20×50 ملم",
            "اللون": "أزرق",
            "قطر التوصيل": "4 ملم"
        }
    },
    // 25mm*40mm - Grey
    {
        id: "25x40-grey",
        label: "25×40 ملم - رمادي",
        price: usdToIqd(0.14),
        stock: 5,
        sku: "CAS-25x40-G",
        specifications: {
            "المقاس": "25×40 ملم",
            "اللون": "رمادي",
            "قطر التوصيل": "4 أو 8 ملم"
        }
    },
    // 25mm*40mm - Blue
    {
        id: "25x40-blue",
        label: "25×40 ملم - أزرق",
        price: usdToIqd(0.14),
        stock: 5,
        sku: "CAS-25x40-B",
        specifications: {
            "المقاس": "25×40 ملم",
            "اللون": "أزرق",
            "قطر التوصيل": "4 أو 8 ملم"
        }
    },
    // 25mm*50mm - Grey
    {
        id: "25x50-grey",
        label: "25×50 ملم - رمادي",
        price: usdToIqd(0.14),
        stock: 5,
        sku: "CAS-25x50-G",
        specifications: {
            "المقاس": "25×50 ملم",
            "اللون": "رمادي",
            "قطر التوصيل": "4 أو 8 ملم"
        }
    },
    // 25mm*50mm - Blue
    {
        id: "25x50-blue",
        label: "25×50 ملم - أزرق",
        price: usdToIqd(0.14),
        stock: 5,
        sku: "CAS-25x50-B",
        specifications: {
            "المقاس": "25×50 ملم",
            "اللون": "أزرق",
            "قطر التوصيل": "4 أو 8 ملم"
        }
    },
    // 25mm*100mm - Grey
    {
        id: "25x100-grey",
        label: "25×100 ملم - رمادي",
        price: usdToIqd(0.27),
        stock: 5,
        sku: "CAS-25x100-G",
        specifications: {
            "المقاس": "25×100 ملم",
            "اللون": "رمادي",
            "قطر التوصيل": "4 أو 8 ملم"
        }
    },
    // 25mm*100mm - Blue
    {
        id: "25x100-blue",
        label: "25×100 ملم - أزرق",
        price: usdToIqd(0.27),
        stock: 5,
        sku: "CAS-25x100-B",
        specifications: {
            "المقاس": "25×100 ملم",
            "اللون": "أزرق",
            "قطر التوصيل": "4 أو 8 ملم"
        }
    },
    // 30mm*70mm - Grey
    {
        id: "30x70-grey",
        label: "30×70 ملم - رمادي",
        price: usdToIqd(0.22),
        stock: 3,
        sku: "CAS-30x70-G",
        specifications: {
            "المقاس": "30×70 ملم",
            "اللون": "رمادي",
            "قطر التوصيل": "4 أو 8 ملم"
        }
    },
    // 30mm*70mm - Blue
    {
        id: "30x70-blue",
        label: "30×70 ملم - أزرق",
        price: usdToIqd(0.22),
        stock: 3,
        sku: "CAS-30x70-B",
        specifications: {
            "المقاس": "30×70 ملم",
            "اللون": "أزرق",
            "قطر التوصيل": "4 أو 8 ملم"
        }
    },
    // 30mm*100mm - Grey
    {
        id: "30x100-grey",
        label: "30×100 ملم - رمادي",
        price: usdToIqd(0.27),
        stock: 3,
        sku: "CAS-30x100-G",
        specifications: {
            "المقاس": "30×100 ملم",
            "اللون": "رمادي",
            "قطر التوصيل": "4 أو 8 ملم"
        }
    },
    // 30mm*100mm - Blue
    {
        id: "30x100-blue",
        label: "30×100 ملم - أزرق",
        price: usdToIqd(0.27),
        stock: 3,
        sku: "CAS-30x100-B",
        specifications: {
            "المقاس": "30×100 ملم",
            "اللون": "أزرق",
            "قطر التوصيل": "4 أو 8 ملم"
        }
    },
    // 50mm*50mm - Grey
    {
        id: "50x50-grey",
        label: "50×50 ملم - رمادي",
        price: usdToIqd(0.34),
        stock: 3,
        sku: "CAS-50x50-G",
        specifications: {
            "المقاس": "50×50 ملم",
            "اللون": "رمادي",
            "قطر التوصيل": "4 أو 8 ملم"
        }
    },
    // 50mm*50mm - Blue
    {
        id: "50x50-blue",
        label: "50×50 ملم - أزرق",
        price: usdToIqd(0.34),
        stock: 3,
        sku: "CAS-50x50-B",
        specifications: {
            "المقاس": "50×50 ملم",
            "اللون": "أزرق",
            "قطر التوصيل": "4 أو 8 ملم"
        }
    },
    // 50mm*100mm - Grey
    {
        id: "50x100-grey",
        label: "50×100 ملم - رمادي",
        price: usdToIqd(0.59),
        stock: 3,
        sku: "CAS-50x100-G",
        specifications: {
            "المقاس": "50×100 ملم",
            "اللون": "رمادي",
            "قطر التوصيل": "4 أو 8 ملم"
        }
    },
    // 50mm*100mm - Blue
    {
        id: "50x100-blue",
        label: "50×100 ملم - أزرق",
        price: usdToIqd(0.59),
        stock: 3,
        sku: "CAS-50x100-B",
        specifications: {
            "المقاس": "50×100 ملم",
            "اللون": "أزرق",
            "قطر التوصيل": "4 أو 8 ملم"
        }
    }
];

async function addCylinderAirStone() {
    console.log("\n🚀 إضافة منتج حجر هواء أسطواني مع متغيرات متعددة...\n");
    console.log(`📦 عدد المتغيرات: ${cylinderAirStoneVariants.length}`);
    console.log("━".repeat(50));

    // Calculate total stock from all variants
    const totalStock = cylinderAirStoneVariants.reduce((sum, v) => sum + v.stock, 0);
    
    // Get the default variant price as main product price
    const defaultVariant = cylinderAirStoneVariants.find(v => v.isDefault) || cylinderAirStoneVariants[0];

    const product = {
        id: "yee-cylinder-air-stone",
        slug: "yee-cylinder-air-stone",
        name: "YEE حجر هواء أسطواني",
        brand: "YEE",
        category: "accessories",
        subcategory: "air-stones",
        description: "حجر هواء أسطواني عالي الجودة من YEE. ينتج فقاعات دقيقة وموزعة بشكل متساوي لتحسين تبادل الأكسجين في الحوض. متوفر بأحجام متعددة من 10 ملم إلى 50 ملم لتناسب جميع أحجام الأحواض. متوفر باللون الرمادي والأزرق. قطر التوصيل 4 ملم للمقاسات الصغيرة و 4/8 ملم للمقاسات الكبيرة.",
        price: defaultVariant.price.toString(),
        stock: totalStock,
        isNew: true,
        isBestSeller: false,
        isProductOfWeek: false,
        hasVariants: true,
        variants: cylinderAirStoneVariants,
        images: ["/images/products/yee/placeholder-air-stone.webp"],
        thumbnail: "/images/products/yee/placeholder-air-stone.webp",
        specifications: {
            "العلامة التجارية": "YEE",
            "النوع": "حجر هواء أسطواني",
            "المادة": "سيراميك مسامي",
            "الألوان المتوفرة": "رمادي، أزرق",
            "المقاسات المتوفرة": "10×25 إلى 50×100 ملم",
            "قطر التوصيل": "4 ملم / 8 ملم"
        }
    };

    try {
        await db.insert(products).values(product).onConflictDoNothing();
        console.log(`✅ تم إضافة: ${product.name}`);
        console.log(`   📦 ${cylinderAirStoneVariants.length} متغير`);
        console.log(`   📊 إجمالي المخزون: ${totalStock} قطعة`);
        console.log(`   💰 السعر الافتراضي: ${defaultVariant.price} IQD`);
        
        // Show price range
        const prices = cylinderAirStoneVariants.map(v => v.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        console.log(`   💵 نطاق الأسعار: ${minPrice} - ${maxPrice} IQD`);
        
    } catch (error: any) {
        console.error(`❌ خطأ:`, error.message);
    }

    console.log("\n" + "━".repeat(50));
    console.log("✅ انتهى!");
}

addCylinderAirStone().catch(console.error);
