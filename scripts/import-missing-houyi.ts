/**
 * Import Missing HOUYI Products
 * Imports all products that have image folders but are not in the database
 */

import { getDb } from "../server/db";
import { products } from "../shared/schema";
import { readdirSync, statSync } from "fs";
import { join } from "path";

const db = getDb();
if (!db) {
    console.error("❌ Database connection failed.");
    process.exit(1);
}

// Price conversion
const CNY_TO_IQD = 184;
const PROFIT_MARGIN = 1.35;

function cnyToIqd(cny: number): number {
    return Math.round(cny * CNY_TO_IQD * PROFIT_MARGIN);
}

function generateSlug(name: string): string {
    return name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/(^-|-$)/g, '');
}

function scanImages(folderName: string): string[] {
    const folderPath = join(process.cwd(), "client", "public", "images", "products", "houyi", folderName);
    try {
        const files = readdirSync(folderPath);
        return files
            .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
            .map(file => `/images/products/houyi/${folderName}/${file}`);
    } catch {
        return [];
    }
}

// Missing products data
const missingProducts = [
    {
        folderName: "Color oxygenation tube  4M 5 PIC BLACK   5 PIC WHITE",
        name: "HOUYI أنبوب أكسجين ملون 4 متر",
        category: "accessories",
        subcategory: "air-pump-accessories",
        description: "أنبوب أكسجين ملون بطول 4 متر. متوفر بلونين: أسود وأبيض. مرن وقوي ومقاوم للتسرب.",
        price: 8,
        hasVariants: true,
        variants: [
            { id: "black", label: "أسود", price: 8, stock: 25, isDefault: true },
            { id: "white", label: "أبيض", price: 8, stock: 25, isDefault: false }
        ]
    },
    {
        folderName: "Moss Line",
        name: "HOUYI خيط موس للتثبيت",
        category: "accessories",
        subcategory: "aquascaping",
        description: "خيط شفاف لتثبيت الموس على الأحجار والخشب. قابل للتحلل ولا يؤثر على الأسماك.",
        price: 5
    },
    {
        folderName: "Net bag BLACK & WHITE",
        name: "HOUYI حقيبة شبكية للفلتر",
        category: "filtration",
        subcategory: "filter-media",
        description: "حقيبة شبكية لوضع مواد الفلتر. متوفرة بلونين: أسود وأبيض.",
        price: 4,
        hasVariants: true,
        variants: [
            { id: "black", label: "أسود", price: 4, stock: 25, isDefault: true },
            { id: "white", label: "أبيض", price: 4, stock: 25, isDefault: false }
        ]
    },
    {
        folderName: "oxygenation tube",
        name: "HOUYI أنبوب أكسجين شفاف",
        category: "accessories",
        subcategory: "air-pump-accessories",
        description: "أنبوب أكسجين شفاف عالي الجودة. مرن ومقاوم للتسرب.",
        price: 5
    },
    {
        folderName: "Planting ring 52×26mm",
        name: "HOUYI حلقة زراعة 52×26 ملم",
        category: "accessories",
        subcategory: "aquascaping",
        description: "حلقة زراعة لتثبيت النباتات في التربة. مقاس 52×26 ملم.",
        price: 6
    },
    {
        folderName: "Pumice Small bag3-6mm",
        name: "HOUYI حجر خفاف 3-6 ملم",
        category: "substrate",
        subcategory: "filter-media",
        description: "حجر خفاف طبيعي للتصفية البيولوجية. حجم الحبيبات 3-6 ملم.",
        price: 12
    },
    {
        folderName: "River sand 1-2mm",
        name: "HOUYI رمل نهري 1-2 ملم",
        category: "substrate",
        subcategory: "sand",
        description: "رمل نهري طبيعي ناعم. حجم الحبيبات 1-2 ملم. مثالي لأسماك الكوريدوراس.",
        price: 10
    },
    {
        folderName: "Silicone 121",
        name: "HOUYI سيليكون آمن للأحواض",
        category: "accessories",
        subcategory: "aquascaping",
        description: "سيليكون آمن للأحواض وغير سام للأسماك. للإصلاحات والتركيب.",
        price: 15
    },
    {
        folderName: "South American Sands  BLACK & RED",
        name: "HOUYI رمل أمريكي جنوبي",
        category: "substrate",
        subcategory: "sand",
        description: "رمل أمريكي جنوبي طبيعي. متوفر بلونين: أسود وأحمر.",
        price: 18,
        hasVariants: true,
        variants: [
            { id: "black", label: "أسود", price: 18, stock: 20, isDefault: true },
            { id: "red", label: "أحمر", price: 18, stock: 20, isDefault: false }
        ]
    },
    {
        folderName: "Stainless steel shunt 4 & 6",
        name: "HOUYI موزع ستانلس ستيل",
        category: "accessories",
        subcategory: "air-pump-accessories",
        description: "موزع هواء ستانلس ستيل عالي الجودة. متوفر بـ 4 و 6 منافذ.",
        price: 12,
        hasVariants: true,
        variants: [
            { id: "4-ports", label: "4 منافذ", price: 12, stock: 25, isDefault: true },
            { id: "6-ports", label: "6 منافذ", price: 12, stock: 25, isDefault: false }
        ]
    },
    {
        folderName: "stream sand",
        name: "HOUYI رمل جدول طبيعي",
        category: "substrate",
        subcategory: "sand",
        description: "رمل جدول طبيعي للأحواض المزروعة.",
        price: 10
    },
    {
        folderName: "Suction cup thermometer",
        name: "HOUYI ترمومتر بكوب شفط",
        category: "monitoring",
        subcategory: "thermometers",
        description: "ترمومتر زجاجي يثبت على الزجاج بكوب شفط. دقيق وسهل القراءة.",
        price: 4
    },
    {
        folderName: "Terminalia Leaves",
        name: "HOUYI أوراق ترميناليا (كاتابا)",
        category: "water-treatment",
        subcategory: "natural-additives",
        description: "أوراق ترميناليا (كاتابا) الطبيعية. تحسن جودة المياه وتقلل التوتر عند الأسماك.",
        price: 8
    },
    {
        folderName: "Tracheal suction cup",
        name: "HOUYI كوب شفط للأنابيب",
        category: "accessories",
        subcategory: "tubing-accessories",
        description: "كوب شفط لتثبيت الأنابيب على زجاج الحوض.",
        price: 3
    },
    {
        folderName: "Volcanic black & RED 3–5cm",
        name: "HOUYI صخور بركانية 3-5 سم",
        category: "decoration",
        subcategory: "rocks",
        description: "صخور بركانية طبيعية للتصفية والديكور. متوفرة بلونين: أسود وأحمر.",
        price: 15,
        hasVariants: true,
        variants: [
            { id: "black", label: "أسود", price: 15, stock: 20, isDefault: true },
            { id: "red", label: "أحمر", price: 15, stock: 20, isDefault: false }
        ]
    },
    {
        folderName: "White cotton 30×50×2.5",
        name: "HOUYI قطن فلتر أبيض 30×50×2.5",
        category: "filtration",
        subcategory: "filter-media",
        description: "قطن فلتر أبيض للتصفية الميكانيكية. مقاس 30×50×2.5 سم.",
        price: 8
    },
    {
        folderName: "White sand",
        name: "HOUYI رمل أبيض ناعم",
        category: "substrate",
        subcategory: "sand",
        description: "رمل أبيض ناعم للأحواض. يعطي مظهراً جميلاً ونظيفاً.",
        price: 12
    }
];

async function importMissingProducts() {
    console.log("\n🚀 استيراد المنتجات الناقصة من HOUYI...\n");

    let successCount = 0;
    let failedCount = 0;

    for (const productData of missingProducts) {
        try {
            const images = scanImages(productData.folderName);

            if (images.length === 0) {
                console.log(`⚠️  تخطي ${productData.name} - لا توجد صور`);
                failedCount++;
                continue;
            }

            const id = `houyi-${generateSlug(productData.folderName)}`;
            const slug = id;
            const price = cnyToIqd(productData.price);

            // Prepare variants with images and correct prices
            let variants = null;
            if (productData.hasVariants && productData.variants) {
                variants = productData.variants.map((v, index) => ({
                    ...v,
                    price: cnyToIqd(v.price),
                    image: images[index] || images[0]
                }));
            }

            const product = {
                id,
                slug,
                name: productData.name,
                brand: "HOUYI",
                category: productData.category,
                subcategory: productData.subcategory,
                description: productData.description,
                price: price.toString(),
                stock: 50,
                isNew: true,
                images,
                thumbnail: images[0],
                specifications: {
                    "العلامة التجارية": "HOUYI"
                },
                hasVariants: productData.hasVariants || false,
                variants
            };

            await db.insert(products).values(product);
            console.log(`✅ ${product.name} - ${images.length} صور${variants ? ` - ${variants.length} خيارات` : ''}`);
            successCount++;

        } catch (error: any) {
            if (error.message?.includes("duplicate key")) {
                console.log(`⏭️  ${productData.name} - موجود مسبقاً`);
            } else {
                console.error(`❌ ${productData.name}:`, error.message);
            }
            failedCount++;
        }
    }

    console.log(`\n📊 النتيجة:`);
    console.log(`✅ نجح: ${successCount} منتج`);
    console.log(`⏭️  تخطي/فشل: ${failedCount} منتج`);
    console.log(`\n🎉 تم الانتهاء!\n`);

    process.exit(0);
}

importMissingProducts();
