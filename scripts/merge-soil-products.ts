/**
 * Merge YEE Soil Products into One with Variants
 * Combines 1.5L and 3L into single product with size options
 */

import { getDb } from "../server/db";
import { products } from "../shared/schema";
import { eq, like, and } from "drizzle-orm";

const db = getDb();
if (!db) {
    console.error("❌ Database connection failed");
    process.exit(1);
}

async function mergeSoilProducts() {
    console.log("\n🔄 دمج منتجات التربة...\n");

    // Find the two soil products
    const soilProducts = await db.select()
        .from(products)
        .where(like(products.name, '%تربة نباتات مائية مطورة%'));

    console.log(`📦 وجدت ${soilProducts.length} منتج تربة`);

    if (soilProducts.length < 2) {
        console.log("⚠️  لم يتم العثور على منتجين للدمج");
        process.exit(1);
    }

    // Find the 1.5L and 3L products
    const product15L = soilProducts.find(p => p.name.includes('1.5'));
    const product3L = soilProducts.find(p => p.name.includes('3'));

    if (!product15L || !product3L) {
        console.log("⚠️  لم يتم العثور على المنتجين");
        process.exit(1);
    }

    console.log(`   - ${product15L.name}: ${product15L.price} د.ع`);
    console.log(`   - ${product3L.name}: ${product3L.price} د.ع`);

    // Combine images from both products
    const allImages = [
        ...(product15L.images as string[]),
        ...(product3L.images as string[])
    ];

    // Define variants
    const variants = [
        {
            id: "1.5L",
            label: "1.5 لتر",
            price: parseInt(product15L.price as string),
            stock: 20,
            isDefault: true
        },
        {
            id: "3L",
            label: "3 لتر",
            price: parseInt(product3L.price as string),
            stock: 15,
            isDefault: false
        }
    ];

    // Update the 1.5L product to have variants and all images
    await db.update(products)
        .set({
            name: "YEE تربة نباتات مائية مطورة",
            slug: "yee-water-grass-mud-fertility-upgrade",
            description: "تربة نباتات مائية مطورة غنية بالمغذيات لنمو النباتات. تحافظ على pH مستقر وتدعم جذور قوية. آمنة للأسماك والروبيان. متوفرة بحجم 1.5 لتر و 3 لتر.",
            variants: variants,
            hasVariants: true,
            images: allImages,
            thumbnail: allImages[0],
            specifications: {
                "العلامة التجارية": "YEE",
                "الأحجام المتوفرة": "1.5 لتر، 3 لتر",
                "النوع": "تربة مطورة بالمغذيات",
                "مناسبة لـ": "أحواض النباتات المائية"
            }
        })
        .where(eq(products.id, product15L.id));

    console.log("\n✅ تم تحديث منتج التربة بالمتغيرات:");
    variants.forEach(v => {
        console.log(`   - ${v.label}: ${v.price} د.ع`);
    });

    // Delete the 3L product (now merged)
    await db.delete(products).where(eq(products.id, product3L.id));
    console.log(`\n🗑️  تم حذف المنتج المكرر: ${product3L.name}`);

    console.log("\n🎉 تم الانتهاء!\n");
    process.exit(0);
}

mergeSoilProducts();
