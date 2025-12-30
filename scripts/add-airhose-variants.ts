/**
 * Add Variants to YEE Air Hose Product
 * Adds 1.5m and 1.7m size options
 */

import { getDb } from "../server/db";
import { products } from "../shared/schema";
import { eq } from "drizzle-orm";

const db = getDb();
if (!db) {
    console.error("❌ Database connection failed");
    process.exit(1);
}

// USD to IQD conversion + 35% profit margin
const USD_TO_IQD = 1480;
const PROFIT_MARGIN = 1.35;

function usdToIqd(usd: number): number {
    return Math.round(usd * USD_TO_IQD * PROFIT_MARGIN);
}

async function addAirHoseVariants() {
    console.log("\n🔄 إضافة متغيرات منتج خرطوم الهواء...\n");

    const productId = "yee-thickened-airbag-for-durability17-meters-15-metersthickened-and-lengthened";

    // Define variants
    const variants = [
        {
            id: "1.5m",
            label: "1.5 متر",
            price: usdToIqd(0.37),  // $0.37 for 1.5m
            stock: 20,
            isDefault: false
        },
        {
            id: "1.7m",
            label: "1.7 متر",
            price: usdToIqd(0.92),  // $0.92 for 1.7m
            stock: 25,
            isDefault: true
        }
    ];

    try {
        // Update the product with variants
        await db.update(products)
            .set({
                name: "YEE خرطوم هواء مقوى",
                description: "خرطوم هواء مقوى بجدران سميكة تمنع الانثناء والتسرب. مرن ومتين للاستخدام طويل الأمد. متوفر بأحجام 1.5 متر و 1.7 متر.",
                variants: variants,
                hasVariants: true,
                price: usdToIqd(0.37).toString(),  // Base price (lowest)
                specifications: {
                    "العلامة التجارية": "YEE",
                    "الأحجام المتوفرة": "1.5 متر، 1.7 متر",
                    "النوع": "مقوى وسميك",
                    "اللون": "شفاف"
                }
            })
            .where(eq(products.id, productId));

        console.log("✅ تم تحديث منتج خرطوم الهواء بالمتغيرات:");
        variants.forEach(v => {
            console.log(`   - ${v.label}: ${v.price} د.ع`);
        });

    } catch (error: any) {
        console.error("❌ خطأ:", error.message);
    }

    console.log("\n🎉 تم الانتهاء!\n");
    process.exit(0);
}

addAirHoseVariants();
