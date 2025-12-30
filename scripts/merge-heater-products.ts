/**
 * Merge YEE Steel Heater Products into One with Wattage Variants
 * Combines 50W, 100W, 200W into single product with power options
 */

import { getDb } from "../server/db";
import { products } from "../shared/schema";
import { eq, like, or } from "drizzle-orm";

const db = getDb();
if (!db) {
    console.error("❌ Database connection failed");
    process.exit(1);
}

async function mergeHeaterProducts() {
    console.log("\n🔄 دمج منتجات السخانات الستيل...\n");

    // Find the three heater products
    const heaterProducts = await db.select()
        .from(products)
        .where(like(products.name, '%سخان ستيل نقي%'));

    console.log(`📦 وجدت ${heaterProducts.length} سخان ستيل`);

    if (heaterProducts.length < 3) {
        console.log("⚠️  لم يتم العثور على 3 منتجات للدمج");
        process.exit(1);
    }

    // Sort by wattage
    const heater50W = heaterProducts.find(p => p.name.includes('50'));
    const heater100W = heaterProducts.find(p => p.name.includes('100'));
    const heater200W = heaterProducts.find(p => p.name.includes('200'));

    if (!heater50W || !heater100W || !heater200W) {
        console.log("⚠️  لم يتم العثور على جميع المنتجات");
        process.exit(1);
    }

    console.log(`   - ${heater50W.name}: ${heater50W.price} د.ع`);
    console.log(`   - ${heater100W.name}: ${heater100W.price} د.ع`);
    console.log(`   - ${heater200W.name}: ${heater200W.price} د.ع`);

    // Combine images from all products (they share the same folder)
    const allImages = heater50W.images as string[];

    // Define variants
    const variants = [
        {
            id: "50W",
            label: "50 واط",
            price: parseInt(heater50W.price as string),
            stock: 15,
            isDefault: true,
            specifications: {
                "القدرة": "50 واط",
                "مناسب لـ": "20-40 لتر"
            }
        },
        {
            id: "100W",
            label: "100 واط",
            price: parseInt(heater100W.price as string),
            stock: 20,
            isDefault: false,
            specifications: {
                "القدرة": "100 واط",
                "مناسب لـ": "40-80 لتر"
            }
        },
        {
            id: "200W",
            label: "200 واط",
            price: parseInt(heater200W.price as string),
            stock: 12,
            isDefault: false,
            specifications: {
                "القدرة": "200 واط",
                "مناسب لـ": "80-150 لتر"
            }
        }
    ];

    // Update the 50W product to have variants
    await db.update(products)
        .set({
            name: "YEE سخان ستيل نقي 304",
            slug: "yee-pure-steel-heater",
            description: "سخان غمر من الستيل النقي 304 عالي الجودة. ترموستات مدمج للتحكم الدقيق بدرجة الحرارة (16-34°C). مقاوم للصدأ ومناسب للمياه العذبة والمالحة. متوفر بقدرات 50 واط و 100 واط و 200 واط.",
            variants: variants,
            hasVariants: true,
            images: allImages,
            thumbnail: allImages[0],
            specifications: {
                "العلامة التجارية": "YEE",
                "المادة": "ستيل 304",
                "نطاق الحرارة": "16-34°C",
                "القدرات المتوفرة": "50W, 100W, 200W",
                "الحماية": "ضد الجفاف والحرارة الزائدة"
            }
        })
        .where(eq(products.id, heater50W.id));

    console.log("\n✅ تم تحديث منتج السخان بالمتغيرات:");
    variants.forEach(v => {
        console.log(`   - ${v.label}: ${v.price} د.ع`);
    });

    // Delete the other products (now merged)
    await db.delete(products).where(eq(products.id, heater100W.id));
    console.log(`🗑️  تم حذف: ${heater100W.name}`);

    await db.delete(products).where(eq(products.id, heater200W.id));
    console.log(`🗑️  تم حذف: ${heater200W.name}`);

    console.log("\n🎉 تم الانتهاء!\n");
    process.exit(0);
}

mergeHeaterProducts();
