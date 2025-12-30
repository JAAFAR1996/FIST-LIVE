/**
 * Fix Duplicate Images in Products
 */

import { getDb } from "../server/db";
import { products } from "../shared/schema";
import { like, eq } from "drizzle-orm";

const db = getDb();
if (!db) {
    console.error("❌ Database connection failed");
    process.exit(1);
}

async function fixDuplicates() {
    console.log("\n🔄 إزالة الصور المكررة...\n");

    // Get all YEE products
    const yeeProducts = await db.select().from(products).where(like(products.brand, 'YEE'));
    let fixed = 0;

    for (const p of yeeProducts) {
        const images = p.images as string[];
        const uniqueImages = [...new Set(images)];

        if (uniqueImages.length !== images.length) {
            await db.update(products).set({
                images: uniqueImages,
                thumbnail: uniqueImages[0]
            }).where(eq(products.id, p.id));

            console.log(`✅ ${p.name.substring(0, 40)}`);
            console.log(`   ${images.length} → ${uniqueImages.length} صور`);
            fixed++;
        }
    }

    if (fixed === 0) {
        console.log("⚠️  لا توجد صور مكررة في أي منتج");
    } else {
        console.log(`\n📊 تم إصلاح ${fixed} منتج`);
    }

    console.log("🎉 تم!\n");
    process.exit(0);
}

fixDuplicates();
