/**
 * Update Cylinder Air Stone Product Images
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
    console.log("\n🖼️ تحديث صور حجر الهواء الأسطواني...\n");

    const images = [
        "/images/products/yee/cylinder-air-stone/all-sizes.png",
        "/images/products/yee/cylinder-air-stone/shape1-small.png",
        "/images/products/yee/cylinder-air-stone/shape2-medium.png",
        "/images/products/yee/cylinder-air-stone/shape3-tall.png",
        "/images/products/yee/cylinder-air-stone/shape4-large.png",
        "/images/products/yee/cylinder-air-stone/shape5-xlarge.png",
        "/images/products/yee/cylinder-air-stone/shape6-wide.png"
    ];

    try {
        await db.update(products)
            .set({
                images: images,
                thumbnail: images[0]
            })
            .where(eq(products.id, "yee-cylinder-air-stone"));

        console.log("✅ تم تحديث الصور بنجاح!");
        console.log(`   📷 عدد الصور: ${images.length}`);
        images.forEach((img, i) => console.log(`   ${i + 1}. ${img}`));
    } catch (error: any) {
        console.error("❌ خطأ:", error.message);
    }
}

updateImages().catch(console.error);
