/**
 * Update Battery Air Pump Product with Correct Specifications
 */

import { getDb } from "../server/db";
import { products, type ProductVariant } from "../shared/schema";
import { eq } from "drizzle-orm";

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

// Corrected Air Pump variants with real specifications
const airPumpVariants: ProductVariant[] = [
    {
        id: "sb1102",
        label: "SB1102 (بطارية - صغير)",
        price: usdToIqd(3.50),
        stock: 12,
        sku: "SOBO-SB1102",
        isDefault: true,
        specifications: {
            "الموديل": "SB-1102",
            "النوع": "بطارية قابلة للشحن",
            "البطارية": "ليثيوم 4800 mAh",
            "مدة العمل": "حتى 70 ساعة",
            "الشحن": "USB",
            "تدفق الهواء": "4 لتر/دقيقة",
            "مناسب لـ": "20-50 لتر",
            "هدية مجانية": "محول UK"
        }
    },
    {
        id: "sb1106",
        label: "SB1106 (كهرباء - كبير)",
        price: usdToIqd(7.00),
        stock: 10,
        sku: "SOBO-SB1106",
        specifications: {
            "الموديل": "SB-1106",
            "النوع": "كهرباء AC",
            "الطاقة": "5.8 واط",
            "الجهد": "220-240V",
            "تدفق الهواء": "2×4.5 لتر/دقيقة",
            "المخارج": "2 منفذ",
            "هدية مجانية": "محول UK"
        }
    }
];

async function updateProduct() {
    console.log("\n🔄 تحديث مضخة الهواء SOBO بالمواصفات الصحيحة...\n");
    console.log("━".repeat(50));

    try {
        await db.update(products)
            .set({
                name: "SOBO مضخة هواء (بطارية/كهرباء) + محول UK هدية",
                brand: "SOBO",
                description: "مضخات هواء SOBO عالية الجودة. متوفرة بنوعين:\n\n🔋 SB-1102 (بطارية): مضخة محمولة تعمل ببطارية ليثيوم 4800mAh قابلة للشحن USB. تعمل حتى 70 ساعة. مثالية للطوارئ وانقطاع الكهرباء. مناسبة للأحواض 20-50 لتر.\n\n⚡ SB-1106 (كهرباء): مضخة كهربائية قوية 5.8 واط مع مخرجين. تدفق هواء 2×4.5 لتر/دقيقة. صامتة وموفرة للطاقة.\n\n🎁 تأتي مع محول كهرباء UK مجاني كهدية!",
                hasVariants: true,
                variants: airPumpVariants,
                specifications: {
                    "العلامة التجارية": "SOBO",
                    "الموديلات": "SB-1102 (بطارية), SB-1106 (كهرباء)",
                    "🔋 SB-1102 البطارية": "4800mAh ليثيوم، 70 ساعة، USB",
                    "⚡ SB-1106 الطاقة": "5.8W، 220-240V، مخرجين",
                    "🎁 هدية مجانية": "محول كهرباء UK"
                }
            })
            .where(eq(products.id, "yee-battery-air-pump"));

        console.log("✅ تم التحديث بنجاح!");
        console.log("\n📋 المواصفات المحدثة:");
        console.log("\n🔋 SB-1102 (بطارية):");
        console.log("   • بطارية: ليثيوم 4800 mAh");
        console.log("   • مدة العمل: حتى 70 ساعة");
        console.log("   • الشحن: USB");
        console.log("   • تدفق الهواء: 4 لتر/دقيقة");
        console.log("   • مناسب لـ: 20-50 لتر");

        console.log("\n⚡ SB-1106 (كهرباء):");
        console.log("   • الطاقة: 5.8 واط");
        console.log("   • الجهد: 220-240V");
        console.log("   • تدفق الهواء: 2×4.5 لتر/دقيقة");
        console.log("   • المخارج: 2 منفذ");

    } catch (error: any) {
        console.error("❌ خطأ:", error.message);
    }

    console.log("\n" + "━".repeat(50));
    console.log("✅ انتهى!");
}

updateProduct().catch(console.error);
