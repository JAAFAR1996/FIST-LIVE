/**
 * Update YEE Product Image URLs in Database
 * Changes .png and .jpg extensions to .webp to match optimized files
 */

import { getDb } from "../server/db";
import { products } from "../shared/schema";
import { like } from "drizzle-orm";

const db = getDb();
if (!db) {
    console.error("❌ Database connection failed");
    process.exit(1);
}

async function updateImageUrls() {
    console.log("\n🔄 تحديث روابط صور YEE في قاعدة البيانات...\n");

    // Get all YEE products
    const yeeProducts = await db.select().from(products).where(like(products.brand, 'YEE'));

    console.log(`📦 عدد منتجات YEE: ${yeeProducts.length}`);
    console.log("━".repeat(50));

    let updated = 0;
    let skipped = 0;

    for (const product of yeeProducts) {
        const oldImages = product.images as string[];
        const oldThumbnail = product.thumbnail;

        // Update image extensions from .png/.jpg to .webp
        const newImages = oldImages.map(img => {
            if (img.includes('/yee/') && (img.endsWith('.png') || img.endsWith('.jpg') || img.endsWith('.jpeg'))) {
                return img.replace(/\.(png|jpg|jpeg)$/i, '.webp');
            }
            return img;
        });

        // Update thumbnail
        let newThumbnail = oldThumbnail;
        if (oldThumbnail.includes('/yee/') && (oldThumbnail.endsWith('.png') || oldThumbnail.endsWith('.jpg') || oldThumbnail.endsWith('.jpeg'))) {
            newThumbnail = oldThumbnail.replace(/\.(png|jpg|jpeg)$/i, '.webp');
        }

        // Check if anything changed
        const imagesChanged = JSON.stringify(oldImages) !== JSON.stringify(newImages);
        const thumbnailChanged = oldThumbnail !== newThumbnail;

        if (imagesChanged || thumbnailChanged) {
            await db.update(products)
                .set({
                    images: newImages,
                    thumbnail: newThumbnail
                })
                .where(like(products.id, product.id));

            console.log(`✅ ${product.name}`);
            console.log(`   ${oldImages.length} صور محدثة`);
            updated++;
        } else {
            skipped++;
        }
    }

    console.log("\n" + "━".repeat(50));
    console.log("📊 النتيجة:");
    console.log(`   ✅ تم تحديث: ${updated} منتج`);
    console.log(`   ⏭️  تم تخطي: ${skipped} منتج`);
    console.log("\n🎉 تم الانتهاء!\n");

    process.exit(0);
}

updateImageUrls();
