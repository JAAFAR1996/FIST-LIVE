/**
 * Import HOUYI Feeding Cup with Color Variants (Green & White)
 * This script will import the product directly with variants enabled
 */

import { getDb } from "../server/db";
import { products } from "../shared/schema";

const db = getDb();
if (!db) {
    console.error("❌ Database connection failed. Check DATABASE_URL.");
    process.exit(1);
}

// Price conversion: CNY to IQD
const CNY_TO_IQD = 184;
const PROFIT_MARGIN = 1.35;
const PRICE_CNY = 7; // Original price in CNY

function cnyToIqd(cny: number): number {
    return Math.round(cny * CNY_TO_IQD * PROFIT_MARGIN);
}

async function importFeedingCupWithVariants() {
    console.log("\n🍽️  استيراد كوب التغذية HOUYI مع خيارات الألوان...\n");

    try {
        const price = cnyToIqd(PRICE_CNY);

        // Product data
        const product = {
            id: "houyi-feeding-cup-green-white",
            slug: "houyi-feeding-cup-green-white",
            name: "HOUYI كوب تغذية",
            brand: "HOUYI",
            category: "accessories",
            subcategory: "feeding-accessories",
            description: "كوب تغذية يثبت على زجاج الحوض بالشفط. يمنع انتشار الطعام في الحوض ويسهل مراقبة كمية الطعام المقدمة للأسماك. متوفر بلونين: أخضر وأبيض.",
            price: price.toString(),
            stock: 100,
            isNew: true,
            images: [
                "/images/products/houyi/Feeding cup GREEN & WHITE/GREEN.jpg",
                "/images/products/houyi/Feeding cup GREEN & WHITE/GREEN 2.jpg",
                "/images/products/houyi/Feeding cup GREEN & WHITE/H47b4fa0192b74669911646ae641c963eH.png",
                "/images/products/houyi/Feeding cup GREEN & WHITE/Hcb8007eb946e4c94994d5ae4174fd968Z.png",
                "/images/products/houyi/Feeding cup GREEN & WHITE/Hd9b0cce5a1c8423485d1183e97c265c6x.png",
                "/images/products/houyi/Feeding cup GREEN & WHITE/Heca531ec720c41aab4ac65cb3004804eg.jpg"
            ],
            thumbnail: "/images/products/houyi/Feeding cup GREEN & WHITE/GREEN.jpg",
            specifications: {
                "العلامة التجارية": "HOUYI",
                "القطر": "8 سم",
                "المادة": "بلاستيك آمن",
                "التثبيت": "كوب شفط",
                "الألوان المتاحة": "أخضر، أبيض"
            },
            hasVariants: true,
            variants: [
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
            ]
        };

        console.log("📦 المنتج:", product.name);
        console.log("💰 السعر:", price.toLocaleString(), "د.ع");
        console.log("🎨 الخيارات: أخضر، أبيض");
        console.log("📸 عدد الصور:", product.images.length);
        console.log("\n⏳ جاري الحفظ في قاعدة البيانات...\n");

        // Insert into database
        await db.insert(products).values(product);

        console.log("✅ تم استيراد المنتج بنجاح!\n");
        console.log("🔗 معرف المنتج:", product.id);
        console.log("\n📋 تفاصيل الخيارات:");
        console.log("  ✓ أخضر (green) - افتراضي");
        console.log("  ✓ أبيض (white)");
        console.log("\n🎉 تم! يمكنك الآن رؤية المنتج في الموقع مع خيارات الألوان.\n");

        process.exit(0);

    } catch (error: any) {
        console.error("\n❌ خطأ:", error.message);

        if (error.message?.includes("duplicate key")) {
            console.log("\n💡 المنتج موجود بالفعل! استخدم سكريبت التحديث بدلاً من ذلك.\n");
        }

        process.exit(1);
    }
}

// Run
importFeedingCupWithVariants();
