/**
 * Update Sponge Filter Product Images
 */

import { getDb } from "../server/db";
import { products } from "../shared/schema";
import { eq } from "drizzle-orm";

const db = getDb();
if (!db) {
    console.error("❌ Database connection failed.");
    process.exit(1);
}

async function updateImages() {
    console.log("\n🖼️ تحديث صور فلتر الإسفنج...\n");

    const images = [
        "/images/products/yee/sponge-filter/all-models.png",
        "/images/products/yee/sponge-filter/xy-180-specs.png",
        "/images/products/yee/sponge-filter/xy-2835-specs.png",
        "/images/products/yee/sponge-filter/xy-2835-box.png",
        "/images/products/yee/sponge-filter/yu-003-box.png"
    ];

    try {
        await db.update(products)
            .set({
                images: images,
                thumbnail: images[0]
            })
            .where(eq(products.id, "yee-sponge-filter"));

        console.log("✅ تم تحديث الصور بنجاح!");
        console.log(`   📷 عدد الصور: ${images.length}`);
        images.forEach((img, i) => console.log(`   ${i + 1}. ${img}`));
    } catch (error: any) {
        console.error("❌ خطأ:", error.message);
    }
}

updateImages().catch(console.error);
