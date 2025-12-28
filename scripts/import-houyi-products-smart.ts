/**
 * HOUYI Products Import Script - Smart Version
 * Following HYGGER naming pattern
 */

import { getDb } from "../server/db";
import { products } from "../shared/schema";
import { readdirSync, statSync } from "fs";
import { join } from "path";

const db = getDb();
if (!db) {
    console.error("❌ Database connection failed. Check DATABASE_URL.");
    process.exit(1);
}

// CNY to IQD conversion + 35% profit margin
const CNY_TO_IQD = 184;
const PROFIT_MARGIN = 1.35;

function cnyToIqd(cny: number): string {
    return Math.round(cny * CNY_TO_IQD * PROFIT_MARGIN).toString();
}

function generateSlug(name: string): string {
    return name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/(^-|-$)/g, '');
}

function scanImagesInFolder(folderName: string): string[] {
    const folderPath = join(process.cwd(), "client", "public", "images", "products", "houyi", folderName);

    try {
        if (!statSync(folderPath).isDirectory()) {
            return [];
        }

        const files = readdirSync(folderPath);
        const imageFiles = files.filter(file =>
            /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
        );

        return imageFiles.map(file => `/images/products/houyi/${folderName}/${file}`);
    } catch (error) {
        return [];
    }
}

// Smart product data with HOUYI brand first (like HYGGER pattern)
const houyiProducts = [
    {
        folderName: "Activated carbon",
        name: "HOUYI كربون نشط لتنقية المياه",
        category: "filtration",
        subcategory: "filter-media",
        description: "كربون نشط عالي الجودة لتنقية مياه الحوض وإزالة الكلور والشوائب والروائح. مادة تصفية كيميائية فعالة تحافظ على نقاء الماء وصحة الأسماك.",
        price: 15,
        specifications: {
            "العلامة التجارية": "HOUYI",
            "النوع": "كربون نشط",
            "الوزن": "500 جرام",
            "الاستخدام": "تنقية كيميائية",
            "الفوائد": "إزالة الكلور والمعادن الثقيلة والروائح",
            "مدة الصلاحية": "3-4 أسابيع"
        }
    },
    {
        folderName: "Ceramic ring",
        name: "HOUYI حلقات سيراميك بيولوجية",
        category: "filtration",
        subcategory: "filter-media",
        description: "حلقات سيراميك مسامية للتصفية البيولوجية الفعالة. توفر مساحة كبيرة لنمو البكتيريا النافعة التي تحول الأمونيا إلى نترات آمنة.",
        price: 18,
        specifications: {
            "العلامة التجارية": "HOUYI",
            "النوع": "حلقات سيراميك",
            "الوزن": "1 كجم",
            "المسامية": "عالية جداً",
            "العمر الافتراضي": "5+ سنوات"
        }
    },
    {
        folderName: "Breathing ring – white",
        name: "HOUYI حلقات تهوية بيولوجية",
        category: "filtration",
        subcategory: "filter-media",
        description: "حلقات تهوية بيولوجية لتوفير أكسجين إضافي مع التصفية. تحسن جودة المياه وتدعم نمو البكتيريا الهوائية.",
        price: 16,
        specifications: {
            "العلامة التجارية": "HOUYI",
            "النوع": "حلقات تهوية",
            "اللون": "أبيض",
            "الوزن": "500 جرام"
        }
    },
    {
        folderName: "Medium cotton grey 50g & Medium cotton brown 50g",
        name: "HOUYI قطن فلتر متعدد الكثافات 50 جرام",
        category: "filtration",
        subcategory: "filter-media",
        description: "قطن فلتر للتصفية الميكانيكية بلونين (رمادي وبني). يزيل الجزيئات العالقة ويحافظ على نقاء الماء.",
        price: 8,
        specifications: {
            "العلامة التجارية": "HOUYI",
            "الألوان": "رمادي وبني",
            "الوزن": "50 جرام × 2",
            "قابل للغسل": "نعم"
        }
    },
    {
        folderName: "Dutch Sand",
        name: "HOUYI تربة هولندية للنباتات المائية",
        category: "substrate",
        subcategory: "planted-tank-substrate",
        description: "تربة هولندية احترافية غنية بالمغذيات للأحواض المزروعة. تدعم نمو الجذور القوية ومثالية للـ Dutch Style Aquascape.",
        price: 35,
        specifications: {
            "العلامة التجارية": "HOUYI",
            "النوع": "تربة هولندية",
            "الوزن": "5 كجم",
            "pH": "6.0-6.8"
        }
    },
    {
        folderName: "Aquatic plants",
        name: "HOUYI نباتات مائية صناعية",
        category: "decoration",
        subcategory: "artificial-plants",
        description: "نباتات مائية صناعية ذات مظهر طبيعي. لا تحتاج صيانة أو إضاءة خاصة. آمنة ومثالية للمبتدئين.",
        price: 12,
        specifications: {
            "العلامة التجارية": "HOUYI",
            "المادة": "بلاستيك آمن",
            "الصيانة": "لا تحتاج"
        }
    },
    {
        folderName: "Aquarium Fish Tank Five-in-one Cleaning Tool Fish Net Scraper Algae Knife Aquatic Clip",
        name: "HOUYI طقم تنظيف 5 في 1",
        category: "maintenance",
        subcategory: "cleaning-tools",
        description: "طقم تنظيف شامل يشمل: شبكة أسماك، كاشط زجاج، سكين طحالب، ملقط نباتات، وإسفنجة. كل ما تحتاجه في أداة واحدة.",
        price: 25,
        specifications: {
            "العلامة التجارية": "HOUYI",
            "عدد القطع": "5 أدوات",
            "المادة": "ستانلس ستيل"
        }
    },
    {
        folderName: "Aquarium Fish Tank Stainless Steel Telescopic Square Fishnet Three-section Fishing Net  MEDIAM",
        name: "HOUYI شبكة أسماك ستانلس قابلة للتمديد",
        category: "maintenance",
        subcategory: "fish-nets",
        description: "شبكة أسماك احترافية بمقبض ستانلس قابل للتمديد (3 أقسام). مربعة الشكل للوصول إلى الزوايا.",
        price: 18,
        specifications: {
            "العلامة التجارية": "HOUYI",
            "المادة": "ستانلس ستيل 304",
            "الحجم": "متوسط",
            "الطول": "حتى 60 سم"
        }
    },
    {
        folderName: "1.55m double-ended spring brush (blue)Hose brush",
        name: "HOUYI فرشاة خرطوم مرنة 1.55 متر",
        category: "maintenance",
        subcategory: "cleaning-tools",
        description: "فرشاة خرطوم زنبركية بطرفين لتنظيف الخراطيم والأنابيب من الداخل. تزيل الطحالب والرواسب بفعالية.",
        price: 10,
        specifications: {
            "العلامة التجارية": "HOUYI",
            "الطول": "1.55 متر",
            "مناسب لـ": "خراطيم 4-16 ملم"
        }
    },
    {
        folderName: "fish tank cleaning towel",
        name: "HOUYI منشفة تنظيف الحوض",
        category: "maintenance",
        subcategory: "cleaning-tools",
        description: "منشفة مايكروفايبر مخصصة لتنظيف الحوض. خالية من الوبر، لا تخدش الزجاج، قوة امتصاص عالية.",
        price: 6,
        specifications: {
            "العلامة التجارية": "HOUYI",
            "المادة": "مايكروفايبر",
            "الحجم": "30×40 سم"
        }
    },
    {
        folderName: "Acrylic tool rack",
        name: "HOUYI حامل أدوات أكريليك شفاف",
        category: "accessories",
        subcategory: "organization",
        description: "حامل أدوات أكريليك شفاف لتنظيم أدوات الصيانة. يثبت على جانب الحوض.",
        price: 14,
        specifications: {
            "العلامة التجارية": "HOUYI",
            "المادة": "أكريليك",
            "السعة": "4-6 أدوات"
        }
    },
    {
        folderName: "Check valve round red",
        name: "HOUYI صمام عدم رجوع دائري",
        category: "accessories",
        subcategory: "air-pump-accessories",
        description: "صمام عدم رجوع يمنع رجوع الماء إلى مضخة الهواء. ضروري لحماية المضخة من التلف.",
        price: 3,
        specifications: {
            "العلامة التجارية": "HOUYI",
            "اللون": "أحمر",
            "القطر": "4 ملم"
        }
    },
    {
        folderName: "Control valve 4mm",
        name: "HOUYI صمام تحكم 4 ملم",
        category: "accessories",
        subcategory: "air-pump-accessories",
        description: "صمام تحكم للتحكم الدقيق بتدفق الهواء. يسمح بضبط كمية الهواء المتدفقة.",
        price: 2,
        specifications: {
            "العلامة التجارية": "HOUYI",
            "القطر": "4 ملم"
        }
    },
    {
        folderName: "4mm T& 4mm I &4mm Y",
        name: "HOUYI وصلات متعددة 4 ملم",
        category: "accessories",
        subcategory: "tubing-connectors",
        description: "مجموعة وصلات بأشكال مختلفة (T, I, Y) لتوزيع الهواء أو الماء.",
        price: 4,
        specifications: {
            "العلامة التجارية": "HOUYI",
            "الأشكال": "T, I, Y",
            "عدد القطع": "3"
        }
    },
    {
        folderName: "4 port blue & 6port blue",
        name: "HOUYI موزع هواء متعدد المنافذ",
        category: "accessories",
        subcategory: "air-pump-accessories",
        description: "موزع هواء بمنافذ متعددة (4 و 6) لتوزيع الهواء من مضخة واحدة.",
        price: 6,
        specifications: {
            "العلامة التجارية": "HOUYI",
            "المنافذ": "4 و 6 منافذ"
        }
    },
    {
        folderName: "Hose clamp    With packaging-blue",
        name: "HOUYI مشابك خرطوم",
        category: "accessories",
        subcategory: "tubing-accessories",
        description: "مشابك خرطوم لتثبيت الخراطيم ومنع انزلاقها. ضرورية للفلاتر والمضخات.",
        price: 3,
        specifications: {
            "العلامة التجارية": "HOUYI",
            "عدد القطع": "10"
        }
    },
    {
        folderName: "Chubby thermometer",
        name: "HOUYI ترمومتر عائم",
        category: "monitoring",
        subcategory: "thermometers",
        description: "ترمومتر عائم بتصميم ظريف. دقيق وسهل القراءة على سطح الماء.",
        price: 5,
        specifications: {
            "العلامة التجارية": "HOUYI",
            "المدى": "0-50 درجة",
            "الدقة": "±1 درجة"
        }
    },
    {
        folderName: "led屏显温度计",
        name: "HOUYI ترمومتر رقمي LED",
        category: "monitoring",
        subcategory: "thermometers",
        description: "ترمومتر رقمي بشاشة LED واضحة. يعرض درجة الحرارة بدقة عالية.",
        price: 12,
        specifications: {
            "العلامة التجارية": "HOUYI",
            "الشاشة": "LED",
            "الدقة": "±0.1 درجة"
        }
    },
    {
        folderName: "Blue Dragon – flake",
        name: "HOUYI طعام Blue Dragon رقائق",
        category: "fish-food",
        subcategory: "flakes",
        description: "طعام رقائق متوازن غذائياً للأسماك الاستوائية. يحسن الألوان ويعزز المناعة.",
        price: 10,
        specifications: {
            "العلامة التجارية": "HOUYI",
            "الوزن": "100 جرام",
            "البروتين": "45%"
        }
    },
    {
        folderName: "Feeding cup GREEN & WHITE",
        name: "HOUYI كوب تغذية",
        category: "accessories",
        subcategory: "feeding-accessories",
        description: "كوب تغذية يثبت على زجاج الحوض. يمنع انتشار الطعام ويسهل مراقبة الكمية.",
        price: 7,
        specifications: {
            "العلامة التجارية": "HOUYI",
            "القطر": "8 سم"
        }
    },
    {
        folderName: "DoPhin Electric Skimmer",
        name: "HOUYI كاشط سطح كهربائي DoPhin",
        category: "filtration",
        subcategory: "surface-skimmers",
        description: "كاشط سطح كهربائي يزيل الزيوت والبروتينات تلقائياً. يحسن تبادل الغازات.",
        price: 45,
        specifications: {
            "العلامة التجارية": "HOUYI",
            "القدرة": "5 واط",
            "التدفق": "200 لتر/ساعة"
        }
    },
    {
        folderName: "Fat injection",
        name: "HOUYI حقنة تغذية",
        category: "accessories",
        subcategory: "feeding-accessories",
        description: "حقنة لإطعام الأسماك المريضة أو الصغيرة. مثالية للطعام السائل أو المهروس.",
        price: 4,
        specifications: {
            "العلامة التجارية": "HOUYI",
            "السعة": "10 مل"
        }
    },
    {
        folderName: "Foam Glue",
        name: "HOUYI غراء رغوي آمن",
        category: "accessories",
        subcategory: "aquascaping",
        description: "غراء رغوي آمن لتثبيت الأحجار والديكورات. غير سام وآمن على الأسماك.",
        price: 8,
        specifications: {
            "العلامة التجارية": "HOUYI",
            "الحجم": "50 جرام"
        }
    },
    {
        folderName: "Gauze isolation net",
        name: "HOUYI شبكة عزل قماشية",
        category: "breeding",
        subcategory: "breeding-accessories",
        description: "شبكة عزل قماشية لفصل الأسماك أو عزل الزريعة. مرنة وآمنة.",
        price: 6,
        specifications: {
            "العلامة التجارية": "HOUYI",
            "الحجم": "30×20 سم"
        }
    },
    {
        folderName: "Mesh 8cm",
        name: "HOUYI شبكة أسماك 8 سم",
        category: "maintenance",
        subcategory: "fish-nets",
        description: "شبكة أسماك بقطر 8 سم. حجم مثالي للأسماك الصغيرة والمتوسطة.",
        price: 5,
        specifications: {
            "العلامة التجارية": "HOUYI",
            "القطر": "8 سم"
        }
    },
    {
        folderName: "Moss glue 5g green&White Moss Glue 20g White& glue White 50g",
        name: "HOUYI غراء موس",
        category: "accessories",
        subcategory: "aquascaping",
        description: "غراء موس بأحجام مختلفة لتثبيت الموس على الأحجار والخشب. آمن تماماً.",
        price: 10,
        specifications: {
            "العلامة التجارية": "HOUYI",
            "الأحجام": "5، 20، 50 جرام"
        }
    }
];

async function importHouyiProducts() {
    console.log("\n🚀 بدء استيراد منتجات HOUYI بذكاء...\n");

    let successCount = 0;
    let failedCount = 0;

    for (const productData of houyiProducts) {
        try {
            // Scan images
            const images = scanImagesInFolder(productData.folderName);

            if (images.length === 0) {
                console.log(`⚠️  تخطي ${productData.name} - لا توجد صور`);
                failedCount++;
                continue;
            }

            // Generate unique ID and slug from folder name
            const id = `houyi-${generateSlug(productData.folderName)}`;
            const slug = `houyi-${generateSlug(productData.folderName)}`;

            const product = {
                id,
                slug,
                name: productData.name,
                brand: "HOUYI",
                category: productData.category,
                subcategory: productData.subcategory,
                description: productData.description,
                price: cnyToIqd(productData.price),
                stock: Math.floor(Math.random() * 20) + 10,
                isNew: true,
                images,
                thumbnail: images[0],
                specifications: productData.specifications
            };

            await db.insert(products).values(product);
            console.log(`✅ ${product.name} - ${images.length} صور`);
            successCount++;

        } catch (error) {
            console.error(`❌ خطأ في ${productData.name}:`, error);
            failedCount++;
        }
    }

    console.log(`\n📊 النتيجة:`);
    console.log(`✅ نجح: ${successCount} منتج`);
    console.log(`❌ فشل: ${failedCount} منتج`);
    console.log(`\n🎉 تم الانتهاء!\n`);

    process.exit(0);
}

// Run import
importHouyiProducts();
