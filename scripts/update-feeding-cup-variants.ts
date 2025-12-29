/**
 * Update HOUYI Feeding Cup to add Color Variants
 * Adds green and white color options to existing product
 */

import { getDb } from "../server/db";
import { products } from "../shared/schema";
import { eq } from "drizzle-orm";

const db = getDb();
if (!db) {
    console.error("❌ Database connection failed.");
    process.exit(1);
}

const PRODUCT_ID = "houyi-feeding-cup-green-white";

async function addColorVariants() {
    console.log("\n🎨 إضافة خيارات الألوان لكوب التغذية HOUYI...\n");

    try {
        // 1. Get current product
        const [currentProduct] = await db
            .select()
            .from(products)
            .where(eq(products.id, PRODUCT_ID));

        if (!currentProduct) {
            console.error("❌ المنتج غير موجود!");
            process.exit(1);
        }

        console.log("✅ وجدت المنتج:", currentProduct.name);
        console.log("💰 السعر الحالي:", currentProduct.price, "د.ع");

        // 2. Create variants
        const price = parseInt(currentProduct.price);
        const variants = [
            {
                id: "green",
                label: "أخضر",
                price: price,
                stock: 50,
                isDefault: true,
                image: "/images/products/houyi/Feeding cup GREEN & WHITE/GREEN.jpg",
                specifications: {
                    "اللون": "أخضر",
                    "كود اللون": "#4CAF50"
                }
            },
            {
                id: "white",
                label: "أبيض", 
                price: price,
                stock: 50,
                isDefault: false,
                image: "/images/products/houyi/Feeding cup GREEN & WHITE/H47b4fa0192b74669911646ae641c963eH.png",
                specifications: {
                    "اللون": "أبيض",
                    "كود اللون": "#FFFFFF"
                }
            }
        ];

        console.log("\n🔄 تحديث المنتج...");
        console.log("📋 الخيارات:");
        variants.forEach(v => {
            console.log(`  ✓ ${v.label} (${v.id})${v.isDefault ? ' - افتراضي' : ''}`);
        });

        // 3. Update product with variants
        await db
            .update(products)
            .set({
                hasVariants: true,
                variants: variants
            })
            .where(eq(products.id, PRODUCT_ID));

        console.log("\n✅ تم التحديث بنجاح! 🎉\n");
        console.log("🌐 يمكنك الآن رؤية خيارات الألوان في صفحة المنتج");
        console.log("🔗 ID:", PRODUCT_ID);
        console.log("\n");

        process.exit(0);

    } catch (error: any) {
        console.error("\n❌ خطأ:", error.message);
        process.exit(1);
    }
}

addColorVariants();
