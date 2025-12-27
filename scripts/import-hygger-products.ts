/**
 * HYGGER Products Import Script
 * Imports 17 HYGGER aquarium products with Arabic translations
 */

import { getDb } from "../server/db";
import { products } from "../shared/schema";

// Get database connection
const db = getDb();
if (!db) {
    console.error("❌ Database connection failed. Check DATABASE_URL.");
    process.exit(1);
}

// USD to IQD conversion rate + 40% profit margin
const USD_TO_IQD = 1310;
const PROFIT_MARGIN = 1.4;

function usdToIqd(usd: number): string {
    return Math.round(usd * USD_TO_IQD * PROFIT_MARGIN).toString();
}

function generateSlug(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const hyggerProducts = [
    // 1. HG-978-18W - LED Light
    {
        id: "hygger-hg978-18w",
        slug: "hygger-led-aquarium-light-18w",
        name: "إضاءة هيغر LED بالطيف الكامل 18 واط",
        brand: "HYGGER",
        category: "lighting",
        subcategory: "led-lights",
        description: "إضاءة LED بالطيف الكامل مع وضع 24/7 ووضع DIY للأحواض المزروعة. مثالية للأحواض 18-24 بوصة مع 98 لمبة LED و 1075 لومن.",
        price: usdToIqd(12.70),
        stock: 8,
        isNew: true,
        images: ["/images/products/hygger/hg978/1.png"],
        thumbnail: "/images/products/hygger/hg978/1.png",
        specifications: {
            "العلامة التجارية": "HYGGER",
            "الموديل": "HG-978-18W",
            "القدرة": "18 واط",
            "اللومن": "1075",
            "عدد LEDs": "98",
            "حجم الحوض": "18-24 بوصة",
            "جهد الدخل": "AC110-120V/60Hz, 220-240V/50Hz",
            "CRI": "86",
            "الألوان": "أبيض 6500K، أزرق 455nm، أحمر 620nm، أخضر 560nm",
            "العمر الافتراضي": "+50,000 ساعة",
            "وضع 24/7": "شروق، نهار، قمري",
            "وضع DIY": "7 ألوان، 9 مستويات سطوع"
        }
    },
    // 2. HG-978-22W
    {
        id: "hygger-hg978-22w",
        slug: "hygger-led-aquarium-light-22w",
        name: "إضاءة هيغر LED بالطيف الكامل 22 واط",
        brand: "HYGGER",
        category: "lighting",
        subcategory: "led-lights",
        description: "إضاءة LED بالطيف الكامل للأحواض 24-30 بوصة مع 115 لمبة LED و 1583 لومن.",
        price: usdToIqd(15.88),
        stock: 6,
        isNew: true,
        images: ["/images/products/hygger/hg978/1.png"],
        thumbnail: "/images/products/hygger/hg978/1.png",
        specifications: {
            "العلامة التجارية": "HYGGER",
            "الموديل": "HG-978-22W",
            "القدرة": "22 واط",
            "اللومن": "1583",
            "عدد LEDs": "115",
            "حجم الحوض": "24-30 بوصة"
        }
    },
    // 3. HG-978-26W
    {
        id: "hygger-hg978-26w",
        slug: "hygger-led-aquarium-light-26w",
        name: "إضاءة هيغر LED بالطيف الكامل 26 واط",
        brand: "HYGGER",
        category: "lighting",
        subcategory: "led-lights",
        description: "إضاءة LED للأحواض 30-36 بوصة مع 138 LED و 1662 لومن.",
        price: usdToIqd(18.77),
        stock: 2,
        isNew: true,
        images: ["/images/products/hygger/hg978/1.png"],
        thumbnail: "/images/products/hygger/hg978/1.png",
        specifications: {
            "العلامة التجارية": "HYGGER",
            "الموديل": "HG-978-26W",
            "القدرة": "26 واط",
            "اللومن": "1662",
            "عدد LEDs": "138",
            "حجم الحوض": "30-36 بوصة"
        }
    },
    // 4. HG-978-36W
    {
        id: "hygger-hg978-36w",
        slug: "hygger-led-aquarium-light-36w",
        name: "إضاءة هيغر LED بالطيف الكامل 36 واط",
        brand: "HYGGER",
        category: "lighting",
        subcategory: "led-lights",
        description: "إضاءة LED للأحواض 36-42 بوصة مع 158 LED و 2728 لومن.",
        price: usdToIqd(26.44),
        stock: 4,
        isNew: true,
        images: ["/images/products/hygger/hg978/1.png"],
        thumbnail: "/images/products/hygger/hg978/1.png",
        specifications: {
            "العلامة التجارية": "HYGGER",
            "الموديل": "HG-978-36W",
            "القدرة": "36 واط",
            "اللومن": "2728",
            "عدد LEDs": "158",
            "حجم الحوض": "36-42 بوصة"
        }
    },
    // 5. HG085-200W - Titanium Heater
    {
        id: "hygger-hg085-200w",
        slug: "hygger-titanium-heater-200w",
        name: "سخان هيغر تيتانيوم 200 واط مع متحكم خارجي",
        brand: "HYGGER",
        category: "heaters",
        subcategory: "titanium-heaters",
        description: "سخان تيتانيوم عالي الجودة مع متحكم درجة حرارة خارجي ذكي. مصنوع من سبيكة تيتانيوم TA2 للطيران مع حماية ضد السخونة الزائدة.",
        price: usdToIqd(19.11),
        stock: 5,
        isNew: true,
        images: ["/images/products/hygger/hg085/1.webp"],
        thumbnail: "/images/products/hygger/hg085/1.webp",
        specifications: {
            "العلامة التجارية": "HYGGER",
            "الموديل": "HG085-200W",
            "القدرة": "200 واط",
            "حجم الحوض": "30-40 جالون (135-180 لتر)",
            "المادة": "سبيكة تيتانيوم TA2 + تفلون",
            "نطاق الحرارة": "60-90°F (16-33°C)",
            "الدقة": "±1°F",
            "مقاومة الماء": "IP68",
            "الجهد": "110-120V, 60Hz",
            "حماية السخونة": "توقف تلقائي عند 95-97°F"
        }
    },
    // 6. HG153-10W - 4-in-1 Filter
    {
        id: "hygger-hg153-10w",
        slug: "hygger-4in1-filter-10w",
        name: "فلتر هيغر غاطس 4 في 1 - 10 واط",
        brand: "HYGGER",
        category: "filters",
        subcategory: "internal-filters",
        description: "فلتر غاطس متعدد الوظائف 4 في 1: فلترة، أكسجة، موجات، دوران. مناسب للأحواض 15-30 جالون.",
        price: usdToIqd(3.73),
        stock: 8,
        isNew: true,
        images: ["/images/products/hygger/hg153/1.png"],
        thumbnail: "/images/products/hygger/hg153/1.png",
        specifications: {
            "العلامة التجارية": "HYGGER",
            "الموديل": "HG153-10W",
            "القدرة": "10 واط",
            "التدفق": "210 GPH",
            "حجم الحوض": "15-30 جالون",
            "الوظائف": "4 في 1",
            "نوع الفلترة": "ميكانيكية وبيولوجية"
        }
    },
    // 7. HG153-18W
    {
        id: "hygger-hg153-18w",
        slug: "hygger-4in1-filter-18w",
        name: "فلتر هيغر غاطس 4 في 1 - 18 واط",
        brand: "HYGGER",
        category: "filters",
        subcategory: "internal-filters",
        description: "فلتر غاطس 4 في 1 للأحواض الكبيرة 30-80 جالون بتدفق 315 GPH.",
        price: usdToIqd(4.55),
        stock: 6,
        isNew: true,
        images: ["/images/products/hygger/hg153/1.png"],
        thumbnail: "/images/products/hygger/hg153/1.png",
        specifications: {
            "العلامة التجارية": "HYGGER",
            "الموديل": "HG153-18W",
            "القدرة": "18 واط",
            "التدفق": "315 GPH",
            "حجم الحوض": "30-80 جالون"
        }
    },
    // 8. HG101-1200L UV Canister
    {
        id: "hygger-hg101-1200l-uv",
        slug: "hygger-canister-filter-uv-1200l",
        name: "فلتر هيغر كانيستر مع معقم UV - 1200 لتر/ساعة",
        brand: "HYGGER",
        category: "filters",
        subcategory: "canister-filters",
        description: "فلتر كانيستر متعدد المراحل مع معقم UV 7 واط. بدء تلقائي بلمسة واحدة وتشغيل هادئ ~30 ديسيبل.",
        price: usdToIqd(59.27),
        stock: 3,
        isNew: true,
        images: ["/images/products/hygger/hg101/1.png"],
        thumbnail: "/images/products/hygger/hg101/1.png",
        specifications: {
            "العلامة التجارية": "HYGGER",
            "الموديل": "HG101-1200L(UV)",
            "قدرة المضخة": "25 واط",
            "مصباح UV": "7 واط",
            "التدفق": "1200 لتر/ساعة",
            "حجم الحوض": "حتى 75 جالون",
            "مستوى الضوضاء": "~30 ديسيبل"
        }
    },
    // 9. HG101-1800L UV
    {
        id: "hygger-hg101-1800l-uv",
        slug: "hygger-canister-filter-uv-1800l",
        name: "فلتر هيغر كانيستر مع معقم UV - 1800 لتر/ساعة",
        brand: "HYGGER",
        category: "filters",
        subcategory: "canister-filters",
        description: "فلتر كانيستر كبير مع معقم UV 9 واط للأحواض الكبيرة.",
        price: usdToIqd(76.53),
        stock: 2,
        isNew: true,
        images: ["/images/products/hygger/hg101/1.png"],
        thumbnail: "/images/products/hygger/hg101/1.png",
        specifications: {
            "العلامة التجارية": "HYGGER",
            "الموديل": "HG101-1800L(UV)",
            "قدرة المضخة": "35 واط",
            "مصباح UV": "9 واط",
            "التدفق": "1800 لتر/ساعة"
        }
    },
    // 10. HG150-6W HOB Filter
    {
        id: "hygger-hg150-6w",
        slug: "hygger-hob-filter-surface-skimmer",
        name: "فلتر هيغر خلفي هادئ مع كاشط سطح الماء",
        brand: "HYGGER",
        category: "filters",
        subcategory: "hang-on-back-filters",
        description: "فلتر خلفي 3 مراحل مع كاشط سطح عائم وجامع فضلات شفاف. هادئ جداً أقل من 25 ديسيبل.",
        price: usdToIqd(16.47),
        stock: 3,
        isNew: true,
        images: ["/images/products/hygger/hg150/1.png"],
        thumbnail: "/images/products/hygger/hg150/1.png",
        specifications: {
            "العلامة التجارية": "HYGGER",
            "الموديل": "HG150-6W",
            "القدرة": "6 واط",
            "التدفق": "132 GPH (500 L/H)",
            "حجم الحوض": "حتى 32 جالون",
            "مستوى الضوضاء": "أقل من 25 ديسيبل"
        }
    }
];

// Continue with remaining products...
const moreProducts = [
    // 11. HG037-3W Air Pump
    {
        id: "hygger-hg037-3w",
        slug: "hygger-quiet-air-pump-3w",
        name: "مضخة هواء هيغر هادئة 3 واط",
        brand: "HYGGER",
        category: "accessories",
        subcategory: "air-pumps",
        description: "مضخة هواء هادئة مع تدفق قابل للتعديل. أقل من 30 ديسيبل.",
        price: usdToIqd(5.25),
        stock: 5,
        isNew: true,
        images: ["/images/products/hygger/hg037/1.webp"],
        thumbnail: "/images/products/hygger/hg037/1.webp",
        specifications: {
            "العلامة التجارية": "HYGGER",
            "الموديل": "HG037-3W",
            "القدرة": "3 واط",
            "التدفق": "50 GPH",
            "حجم الحوض": "30-50 جالون",
            "مستوى الضوضاء": "أقل من 30 ديسيبل"
        }
    },
    // 12. HG087 Rechargeable Pump
    {
        id: "hygger-hg087-1-5w",
        slug: "hygger-rechargeable-oxygen-pump",
        name: "مضخة أكسجين هيغر محمولة قابلة للشحن",
        brand: "HYGGER",
        category: "accessories",
        subcategory: "air-pumps",
        description: "مضخة أكسجين قابلة للشحن مع بطارية 2800mAh. تعمل حتى 28 ساعة وتتحول تلقائياً عند انقطاع الكهرباء.",
        price: usdToIqd(8.91),
        stock: 5,
        isNew: true,
        images: ["/images/products/hygger/hg087/1.webp"],
        thumbnail: "/images/products/hygger/hg087/1.webp",
        specifications: {
            "العلامة التجارية": "HYGGER",
            "الموديل": "HG087-1.5W",
            "القدرة": "1.5 واط",
            "البطارية": "2800mAh ليثيوم",
            "مدة التشغيل": "حتى 28 ساعة",
            "الشحن": "USB-C"
        }
    },
    // 13. HG-958-5W Ultra Quiet
    {
        id: "hygger-hg958-5w",
        slug: "hygger-ultra-quiet-air-pump-5w",
        name: "مضخة هواء هيغر فائقة الهدوء 5 واط",
        brand: "HYGGER",
        category: "accessories",
        subcategory: "air-pumps",
        description: "مضخة هواء بمنفذين مع تصميم فائق الهدوء. محرك مغناطيسي بدون محامل.",
        price: usdToIqd(12.39),
        stock: 3,
        isNew: true,
        images: ["/images/products/hygger/hg958/1.webp"],
        thumbnail: "/images/products/hygger/hg958/1.webp",
        specifications: {
            "العلامة التجارية": "HYGGER",
            "الموديل": "HG-958-5W",
            "القدرة": "5 واط",
            "التدفق": "160 GPH",
            "المنافذ": "2",
            "مستوى الضوضاء": "أقل من 30 ديسيبل"
        }
    },
    // 14. HGY0001-M Cleaning Kit
    {
        id: "hygger-hgy0001-m",
        slug: "hygger-black-knight-cleaning-kit",
        name: "طقم تنظيف هيغر الفارس الأسود 6 في 1",
        brand: "HYGGER",
        category: "accessories",
        subcategory: "cleaning-tools",
        description: "طقم تنظيف شامل بمقبض تلسكوبي من ألياف الكربون. يشمل شبكة، كاشطة، إسفنجات، فرشاة أنابيب، ومشط حصى.",
        price: usdToIqd(7.37),
        stock: 5,
        isNew: true,
        images: ["/images/products/hygger/hgy0001m/1.jpg"],
        thumbnail: "/images/products/hygger/hgy0001m/1.jpg",
        specifications: {
            "العلامة التجارية": "HYGGER",
            "الموديل": "HGY0001-M",
            "الحجم": "M",
            "حجم الحوض": "20-160 جالون",
            "المادة": "ألياف كربون مركبة"
        }
    },
    // 15-17. HG124 Magnetic Cleaners
    {
        id: "hygger-hg124-s",
        slug: "hygger-magnetic-glass-cleaner-small",
        name: "منظف زجاج هيغر مغناطيسي - صغير",
        brand: "HYGGER",
        category: "accessories",
        subcategory: "cleaning-tools",
        description: "منظف مغناطيسي عائم مع شفرتين قابلتين للإزالة. للزجاج 0-6 ملم.",
        price: usdToIqd(2.57),
        stock: 4,
        isNew: true,
        images: ["/images/products/hygger/hg124/1.png"],
        thumbnail: "/images/products/hygger/hg124/1.png",
        specifications: {
            "الموديل": "HG124-S",
            "سماكة الزجاج": "0-6 ملم"
        }
    },
    {
        id: "hygger-hg124-m",
        slug: "hygger-magnetic-glass-cleaner-medium",
        name: "منظف زجاج هيغر مغناطيسي - متوسط",
        brand: "HYGGER",
        category: "accessories",
        subcategory: "cleaning-tools",
        description: "منظف مغناطيسي للزجاج 6-13 ملم.",
        price: usdToIqd(3.85),
        stock: 10,
        isNew: true,
        images: ["/images/products/hygger/hg124/1.png"],
        thumbnail: "/images/products/hygger/hg124/1.png",
        specifications: { "الموديل": "HG124-M", "سماكة الزجاج": "6-13 ملم" }
    },
    {
        id: "hygger-hg124-l",
        slug: "hygger-magnetic-glass-cleaner-large",
        name: "منظف زجاج هيغر مغناطيسي - كبير",
        brand: "HYGGER",
        category: "accessories",
        subcategory: "cleaning-tools",
        description: "منظف مغناطيسي للزجاج 13-20 ملم.",
        price: usdToIqd(6.07),
        stock: 6,
        isNew: true,
        images: ["/images/products/hygger/hg124/1.png"],
        thumbnail: "/images/products/hygger/hg124/1.png",
        specifications: { "الموديل": "HG124-L", "سماكة الزجاج": "13-20 ملم" }
    },
    // 18. HG953-M
    {
        id: "hygger-hg953-m",
        slug: "hygger-magnetic-algae-scraper",
        name: "كاشطة طحالب هيغر مغناطيسية",
        brand: "HYGGER",
        category: "accessories",
        subcategory: "cleaning-tools",
        description: "كاشطة مغناطيسية عائمة مع شفرات ستانلس وبلاستيك.",
        price: usdToIqd(14.12),
        stock: 4,
        isNew: true,
        images: ["/images/products/hygger/hg953/1.webp"],
        thumbnail: "/images/products/hygger/hg953/1.webp",
        specifications: {
            "الموديل": "HG953-M",
            "سماكة الزجاج": "حتى 19 ملم",
            "حجم الحوض": "90-200 جالون"
        }
    },
    // 19. HG073-L Thermometer
    {
        id: "hygger-hg073-l",
        slug: "hygger-digital-thermometer",
        name: "ميزان حرارة هيغر رقمي خارجي",
        brand: "HYGGER",
        category: "accessories",
        subcategory: "thermometers",
        description: "ميزان حرارة رقمي بشاشة LCD شفافة ولاسلكي.",
        price: usdToIqd(4.11),
        stock: 3,
        isNew: true,
        images: ["/images/products/hygger/hg073/1.webp"],
        thumbnail: "/images/products/hygger/hg073/1.webp",
        specifications: {
            "الموديل": "HG073-L",
            "النطاق": "0-60°C",
            "الدقة": "±0.5°C",
            "البطارية": "CR2032"
        }
    },
    // 20. HG030-Color Tools Kit
    {
        id: "hygger-hg030-color",
        slug: "hygger-aquascaping-tools-kit",
        name: "طقم أدوات هيغر للأكواسكيب 6 في 1 ملون",
        brand: "HYGGER",
        category: "accessories",
        subcategory: "aquascaping-tools",
        description: "طقم أدوات ستانلس ستيل ملون مع مقص، ملقطين، مجرفة، وحامل أكريليك.",
        price: usdToIqd(7.70),
        stock: 3,
        isNew: true,
        images: ["/images/products/hygger/hg030/1.webp"],
        thumbnail: "/images/products/hygger/hg030/1.webp",
        specifications: {
            "الموديل": "HG030-Color",
            "المادة": "ستانلس ستيل ملون",
            "المحتويات": "6 قطع"
        }
    },
    // 21-22. HG-957 RGB Lights
    {
        id: "hygger-hg957-36w",
        slug: "hygger-rgb-led-light-controller-36w",
        name: "إضاءة هيغر LED RGB مع متحكم خارجي 36 واط",
        brand: "HYGGER",
        category: "lighting",
        subcategory: "led-lights",
        description: "إضاءة LED RGB قابلة للبرمجة مع متحكم خارجي وشاشة LCD.",
        price: usdToIqd(22.18),
        stock: 3,
        isNew: true,
        images: ["/images/products/hygger/hg957/1.webp"],
        thumbnail: "/images/products/hygger/hg957/1.webp",
        specifications: {
            "الموديل": "HG-957-36W",
            "القدرة": "36 واط",
            "اللومن": "1984",
            "CRI": "89"
        }
    },
    {
        id: "hygger-hg957-48w",
        slug: "hygger-rgb-led-light-controller-48w",
        name: "إضاءة هيغر LED RGB مع متحكم خارجي 48 واط",
        brand: "HYGGER",
        category: "lighting",
        subcategory: "led-lights",
        description: "إضاءة LED RGB كبيرة 48 واط للأحواض 30-36 بوصة.",
        price: usdToIqd(25.80),
        stock: 2,
        isNew: true,
        images: ["/images/products/hygger/hg957/1.webp"],
        thumbnail: "/images/products/hygger/hg957/1.webp",
        specifications: {
            "الموديل": "HG957-48W",
            "القدرة": "48 واط",
            "اللومن": "2365"
        }
    },
    // 23. HG239 Water Tester
    {
        id: "hygger-hg239",
        slug: "hygger-5in1-water-tester",
        name: "جهاز فحص الماء هيغر 5 في 1 رقمي",
        brand: "HYGGER",
        category: "accessories",
        subcategory: "water-testing",
        description: "جهاز فحص رقمي يقيس pH, TDS, EC, الملوحة، والحرارة.",
        price: usdToIqd(13.18),
        stock: 3,
        isNew: true,
        images: ["/images/products/hygger/hg239/1.webp"],
        thumbnail: "/images/products/hygger/hg239/1.webp",
        specifications: {
            "الموديل": "HG239",
            "القياسات": "5 في 1",
            "دقة pH": "±0.05"
        }
    },
    // 24-27. HC004 Background Paper
    {
        id: "hygger-hc004-s",
        slug: "hygger-aquarium-background-small",
        name: "خلفية حوض هيغر كهروستاتيكية - صغير",
        brand: "HYGGER",
        category: "accessories",
        subcategory: "decorations",
        description: "خلفية سوداء كهروستاتيكية بدون غراء 30×100 سم.",
        price: usdToIqd(0.56),
        stock: 5,
        isNew: true,
        images: ["/images/products/hygger/hc004/1.webp"],
        thumbnail: "/images/products/hygger/hc004/1.webp",
        specifications: { "الموديل": "HC004-S", "الحجم": "30×100 سم" }
    },
    {
        id: "hygger-hc004-m",
        slug: "hygger-aquarium-background-medium",
        name: "خلفية حوض هيغر كهروستاتيكية - متوسط",
        brand: "HYGGER",
        category: "accessories",
        subcategory: "decorations",
        description: "خلفية 45×120 سم.",
        price: usdToIqd(0.86),
        stock: 10,
        isNew: true,
        images: ["/images/products/hygger/hc004/1.webp"],
        thumbnail: "/images/products/hygger/hc004/1.webp",
        specifications: { "الموديل": "HC004-M", "الحجم": "45×120 سم" }
    },
    {
        id: "hygger-hc004-l",
        slug: "hygger-aquarium-background-large",
        name: "خلفية حوض هيغر كهروستاتيكية - كبير",
        brand: "HYGGER",
        category: "accessories",
        subcategory: "decorations",
        description: "خلفية 50×150 سم.",
        price: usdToIqd(1.12),
        stock: 15,
        isNew: true,
        images: ["/images/products/hygger/hc004/1.webp"],
        thumbnail: "/images/products/hygger/hc004/1.webp",
        specifications: { "الموديل": "HC004-L", "الحجم": "50×150 سم" }
    },
    {
        id: "hygger-hc004-xl",
        slug: "hygger-aquarium-background-xlarge",
        name: "خلفية حوض هيغر كهروستاتيكية - كبير جداً",
        brand: "HYGGER",
        category: "accessories",
        subcategory: "decorations",
        description: "خلفية 60×200 سم.",
        price: usdToIqd(1.68),
        stock: 12,
        isNew: true,
        images: ["/images/products/hygger/hc004/1.webp"],
        thumbnail: "/images/products/hygger/hc004/1.webp",
        specifications: { "الموديل": "HC004-XL", "الحجم": "60×200 سم" }
    },
    // 28. HG006-50 Test Strips
    {
        id: "hygger-hg006-50",
        slug: "hygger-8in1-test-strips",
        name: "أشرطة فحص الماء هيغر 8 في 1 - 50 شريط",
        brand: "HYGGER",
        category: "accessories",
        subcategory: "water-testing",
        description: "أشرطة فحص سريعة تقيس 8 معايير للمياه العذبة والمالحة.",
        price: usdToIqd(3.00),
        stock: 4,
        isNew: true,
        images: ["/images/products/hygger/hg006/1.png"],
        thumbnail: "/images/products/hygger/hg006/1.png",
        specifications: {
            "الموديل": "HG006-50",
            "العدد": "50 شريط",
            "الاختبارات": "8 معايير"
        }
    }
];

const allProducts = [...hyggerProducts, ...moreProducts];

async function importProducts() {
    console.log(`\n🐠 Importing ${allProducts.length} HYGGER products...\n`);

    let imported = 0;
    let errors = 0;

    for (const product of allProducts) {
        try {
            await db!.insert(products).values({
                ...product,
                rating: "0",
                reviewCount: 0,
                lowStockThreshold: 5,
                isBestSeller: false,
                isProductOfWeek: false,
                currency: "IQD"
            }).onConflictDoNothing();

            console.log(`✅ ${product.name}`);
            imported++;
        } catch (error) {
            console.error(`❌ Error: ${product.id}`, error);
            errors++;
        }
    }

    console.log(`\n📊 Import Complete: ${imported} success, ${errors} errors`);
}

importProducts()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error("Import failed:", err);
        process.exit(1);
    });
