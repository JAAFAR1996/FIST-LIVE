/**
 * Add Battery Air Pump Product with UK Adapter as Free Gift
 */

import { getDb } from "../server/db";
import { products, type ProductVariant } from "../shared/schema";

const db = getDb();
if (!db) {
    console.error("❌ Database connection failed.");
    process.exit(1);
}

// USD to IQD conversion + 35% profit margin
const USD_TO_IQD = 1480;
const PROFIT_MARGIN = 1.35;

function usdToIqd(usd: number): number {
    return Math.round(usd * USD_TO_IQD * PROFIT_MARGIN);
}

// Battery Air Pump variants
const batteryAirPumpVariants: ProductVariant[] = [
    {
        id: "sb1102",
        label: "SB1102 (صغير)",
        price: usdToIqd(3.50),
        stock: 12,
        sku: "BAP-SB1102",
        isDefault: true,
        specifications: {
            "الموديل": "SB1102",
            "الحجم": "صغير",
            "هدية مجانية": "محول UK"
        }
    },
    {
        id: "sb1106",
        label: "SB1106 (كبير)",
        price: usdToIqd(7.00),
        stock: 10,
        sku: "BAP-SB1106",
        specifications: {
            "الموديل": "SB1106",
            "الحجم": "كبير",
            "هدية مجانية": "محول UK"
        }
    }
];

async function addProducts() {
    console.log("\n🚀 إضافة مضخة هواء بطارية مع هدية محول UK...\n");
    console.log("━".repeat(50));

    const batteryPump = {
        id: "yee-battery-air-pump",
        slug: "yee-battery-air-pump",
        name: "YEE مضخة هواء بطارية محمولة + محول UK هدية",
        brand: "YEE",
        category: "air-pumps",
        subcategory: "battery-pumps",
        description: "مضخة هواء تعمل بالبطارية، محمولة ومثالية للطوارئ وانقطاع الكهرباء. تحافظ على حياة أسماكك عند انقطاع التيار الكهربائي. متوفرة بحجمين: SB1102 الصغير و SB1106 الكبير للأحواض الأكبر. 🎁 تأتي مع محول كهرباء UK مجاني كهدية!",
        price: usdToIqd(3.50).toString(),
        stock: 22,
        isNew: true,
        isBestSeller: true,
        isProductOfWeek: false,
        hasVariants: true,
        variants: batteryAirPumpVariants,
        images: ["/images/products/yee/battery-air-pump/main.png"],
        thumbnail: "/images/products/yee/battery-air-pump/main.png",
        specifications: {
            "العلامة التجارية": "YEE",
            "النوع": "مضخة هواء بطارية",
            "الموديلات": "SB1102, SB1106",
            "الاستخدام": "طوارئ وانقطاع الكهرباء",
            "🎁 هدية مجانية": "محول كهرباء UK"
        }
    };

    try {
        await db.insert(products).values(batteryPump).onConflictDoNothing();
        console.log(`✅ ${batteryPump.name}`);
        console.log(`   📦 ${batteryAirPumpVariants.length} متغير`);
        console.log(`   🎁 هدية مجانية: محول UK`);
        batteryAirPumpVariants.forEach(v => {
            console.log(`   💰 ${v.label}: ${v.price} IQD`);
        });

    } catch (error: any) {
        console.error(`❌ خطأ:`, error.message);
    }

    console.log("\n" + "━".repeat(50));
    console.log("✅ انتهى!");
}

addProducts().catch(console.error);
