/**
 * Add Sponge Filter Product with Multiple Variants
 * XY-180 and XY-2835 models
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

// Sponge Filter variants
const spongeFilterVariants: ProductVariant[] = [
    {
        id: "xy-180",
        label: "XY-180 (كبير)",
        price: usdToIqd(0.75),
        stock: 5,
        sku: "SF-XY-180",
        isDefault: true,
        specifications: {
            "الموديل": "XY-180",
            "الارتفاع": "9 سم",
            "العرض": "7.5 سم",
            "العمق": "6.2 سم",
            "اللون": "أسود"
        }
    },
    {
        id: "xy-2835",
        label: "XY-2835 (صغير)",
        price: usdToIqd(0.58),
        stock: 5,
        sku: "SF-XY-2835",
        specifications: {
            "الموديل": "XY-2835",
            "الارتفاع": "7 سم",
            "العرض": "5.5 سم",
            "اللون": "أسود"
        }
    }
];

async function addSpongeFilter() {
    console.log("\n🚀 إضافة منتج فلتر الإسفنج مع متغيرات...\n");
    console.log(`📦 عدد المتغيرات: ${spongeFilterVariants.length}`);
    console.log("━".repeat(50));

    const totalStock = spongeFilterVariants.reduce((sum, v) => sum + v.stock, 0);
    const defaultVariant = spongeFilterVariants.find(v => v.isDefault) || spongeFilterVariants[0];

    const product = {
        id: "yee-sponge-filter",
        slug: "yee-sponge-filter",
        name: "YEE فلتر إسفنجي للأحواض",
        brand: "YEE",
        category: "filtration",
        subcategory: "sponge-filters",
        description: "فلتر إسفنجي عالي الجودة للأحواض. يوفر تصفية بيولوجية وميكانيكية ممتازة. مثالي لأحواض التربية والروبيان والأسماك الصغيرة. يعمل بمضخة هواء (تباع منفصلة). متوفر بحجمين: XY-180 الكبير و XY-2835 الصغير.",
        price: defaultVariant.price.toString(),
        stock: totalStock,
        isNew: true,
        isBestSeller: false,
        isProductOfWeek: false,
        hasVariants: true,
        variants: spongeFilterVariants,
        images: ["/images/products/yee/sponge-filter/all-models.png"],
        thumbnail: "/images/products/yee/sponge-filter/all-models.png",
        specifications: {
            "العلامة التجارية": "YEE",
            "النوع": "فلتر إسفنجي",
            "اللون": "أسود",
            "الموديلات المتوفرة": "XY-180, XY-2835",
            "يتطلب": "مضخة هواء"
        }
    };

    try {
        await db.insert(products).values(product).onConflictDoNothing();
        console.log(`✅ تم إضافة: ${product.name}`);
        console.log(`   📦 ${spongeFilterVariants.length} متغير`);
        console.log(`   📊 إجمالي المخزون: ${totalStock} قطعة`);

        spongeFilterVariants.forEach(v => {
            console.log(`   💰 ${v.label}: ${v.price} IQD`);
        });

    } catch (error: any) {
        console.error(`❌ خطأ:`, error.message);
    }

    console.log("\n" + "━".repeat(50));
    console.log("✅ انتهى!");
}

addSpongeFilter().catch(console.error);
