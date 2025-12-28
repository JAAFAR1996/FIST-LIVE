/**
 * Houyi Products Import Script
 * Imports Binzhou Houyi aquarium products with Arabic translations
 *
 * Company: Binzhou Houyi Aquatic Products Co., Ltd.
 * Specialty: Filter materials, cleaning tools, aquarium accessories
 * Origin: Shandong Province, China
 */

import { getDb } from "../server/db";
import { products } from "../shared/schema";
import { readdirSync, statSync } from "fs";
import { join } from "path";

// Get database connection
const db = getDb();
if (!db) {
    console.error("❌ Database connection failed. Check DATABASE_URL.");
    process.exit(1);
}

// CNY to IQD conversion rate + 35% profit margin (Houyi is cost-effective)
const CNY_TO_IQD = 184; // 1 CNY = ~184 IQD
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

function generateId(name: string): string {
    return `houyi-${generateSlug(name).substring(0, 50)}`;
}

// Product translations and categories mapping
const productData: Record<string, {
    arabicName: string;
    category: string;
    subcategory: string;
    description: string;
    price: number; // in CNY
    specifications: Record<string, any>;
}> = {
    "Activated carbon": {
        arabicName: "كربون نشط Houyi لتنقية المياه",
        category: "filtration",
        subcategory: "filter-media",
        description: "كربون نشط عالي الجودة من Houyi لتنقية مياه الحوض وإزالة الشوائب والروائح والكلور. مادة تصفية كيميائية فعالة تحافظ على نقاء الماء وصحة الأسماك.",
        price: 15,
        specifications: {
            "العلامة التجارية": "Houyi",
            "النوع": "كربون نشط",
            "الاستخدام": "تنقية كيميائية",
            "الوزن": "500 جرام",
            "الفوائد": "إزالة الكلور والمعادن الثقيلة والروائح",
            "مدة الصلاحية": "3-4 أسابيع",
            "طريقة الاستخدام": "يوضع في الفلتر أو كيس شبكي"
        }
    },
    "Ceramic ring": {
        arabicName: "حلقات سيراميك Houyi بيولوجية",
        category: "filtration",
        subcategory: "filter-media",
        description: "حلقات سيراميك مسامية من Houyi لتصفية بيولوجية فعالة. توفر مساحة كبيرة لنمو البكتيريا النافعة التي تحول الأمونيا والنتريت إلى نترات آمنة.",
        price: 18,
        specifications: {
            "العلامة التجارية": "Houyi",
            "النوع": "حلقات سيراميك",
            "الاستخدام": "تصفية بيولوجية",
            "الوزن": "1 كجم",
            "المسامية": "عالية جداً",
            "مساحة السطح": "كبيرة للبكتيريا النافعة",
            "العمر الافتراضي": "5+ سنوات",
            "سهولة التنظيف": "نعم - شطف بماء الحوض"
        }
    },
    "Breathing ring": {
        arabicName: "حلقات تهوية Houyi بيولوجية",
        category: "filtration",
        subcategory: "filter-media",
        description: "حلقات تهوية بيولوجية من Houyi مصممة لتوفير أكسجين إضافي مع التصفية البيولوجية. تحسن جودة المياه وتدعم نمو البكتيريا الهوائية.",
        price: 16,
        specifications: {
            "العلامة التجارية": "Houyi",
            "النوع": "حلقات تهوية",
            "اللون": "أبيض",
            "الوزن": "500 جرام",
            "الفائدة": "تحسين الأكسجين والتصفية البيولوجية",
            "مناسب لـ": "جميع أنواع الأحواض"
        }
    },
    "Medium cotton grey 50g & Medium cotton brown 50g": {
        arabicName: "قطن فلتر Houyi (رمادي وبني) 50 جرام",
        category: "filtration",
        subcategory: "filter-media",
        description: "قطن فلتر متعدد الكثافات من Houyi للتصفية الميكانيكية. يأتي بلونين (رمادي وبني) لمراحل مختلفة - يزيل الجزيئات العالقة ويحافظ على نقاء الماء.",
        price: 8,
        specifications: {
            "العلامة التجارية": "Houyi",
            "النوع": "قطن فلتر",
            "الألوان": "رمادي وبني",
            "الوزن": "50 جرام لكل لون",
            "الكثافة": "متوسطة",
            "الاستخدام": "تصفية ميكانيكية",
            "قابل للغسل": "نعم - عدة مرات"
        }
    },
    "Dutch Sand": {
        arabicName: "رمل هولندي Houyi للنباتات المائية",
        category: "substrate",
        subcategory: "planted-tank-substrate",
        description: "تربة هولندية احترافية من Houyi مخصصة للنباتات المائية. غنية بالمغذيات وتدعم نمو الجذور القوية. مثالية للأحواض المزروعة الطبيعية (Dutch Style Aquascape).",
        price: 35,
        specifications: {
            "العلامة التجارية": "Houyi",
            "النوع": "تربة هولندية",
            "الوزن": "5 كجم",
            "pH": "6.0-6.8 (حمضي قليلاً)",
            "الفوائد": "غني بالمغذيات والحديد",
            "مناسب لـ": "الأحواض المزروعة",
            "اللون": "بني داكن",
            "المنشأ": "مستورد"
        }
    },
    "Aquatic plants": {
        arabicName: "نباتات مائية Houyi صناعية",
        category: "decoration",
        subcategory: "artificial-plants",
        description: "نباتات مائية صناعية من Houyi ذات مظهر طبيعي. لا تحتاج صيانة ولا إضاءة خاصة. آمنة للأسماك ولا تؤثر على جودة المياه. مثالية للمبتدئين.",
        price: 12,
        specifications: {
            "العلامة التجارية": "Houyi",
            "النوع": "نباتات صناعية",
            "المادة": "بلاستيك آمن وغير سام",
            "الارتفاع": "متنوع",
            "الصيانة": "لا تحتاج - شطف بالماء فقط",
            "المتانة": "عالية جداً",
            "آمن": "نعم - لجميع أنواع الأسماك"
        }
    },
    "Aquarium Fish Tank Five-in-one Cleaning Tool Fish Net Scraper Algae Knife Aquatic Clip": {
        arabicName: "طقم تنظيف Houyi 5 في 1 للأحواض",
        category: "maintenance",
        subcategory: "cleaning-tools",
        description: "طقم تنظيف شامل 5 في 1 من Houyi يشمل: شبكة أسماك، كاشط زجاج، سكين طحالب، ملقط نباتات، وإسفنجة. كل ما تحتاجه لصيانة الحوض في أداة واحدة متعددة الاستخدامات.",
        price: 25,
        specifications: {
            "العلامة التجارية": "Houyi",
            "عدد القطع": "5 أدوات في 1",
            "الأدوات": "شبكة، كاشط، سكين، ملقط، إسفنجة",
            "المادة": "ستانلس ستيل + بلاستيك عالي الجودة",
            "الطول": "قابل للتمديد",
            "سهولة الاستخدام": "ممتاز",
            "مناسب لـ": "جميع أحجام الأحواض"
        }
    },
    "Aquarium Fish Tank Stainless Steel Telescopic Square Fishnet Three-section Fishing Net  MEDIAM": {
        arabicName: "شبكة أسماك Houyi ستانلس قابلة للتمديد (متوسط)",
        category: "maintenance",
        subcategory: "fish-nets",
        description: "شبكة أسماك احترافية من Houyi بمقبض ستانلس ستيل قابل للتمديد (3 أقسام). مربعة الشكل للوصول إلى الزوايا. متينة وعملية للاستخدام اليومي.",
        price: 18,
        specifications: {
            "العلامة التجارية": "Houyi",
            "المادة": "ستانلس ستيل 304",
            "الحجم": "متوسط",
            "الشكل": "مربع",
            "الطول": "قابل للتمديد - 3 أقسام",
            "الطول الكامل": "حتى 60 سم",
            "شبكة": "ناعمة لحماية الأسماك",
            "مقاومة الصدأ": "نعم"
        }
    },
    "1.55m double-ended spring brush (blue)Hose brush": {
        arabicName: "فرشاة خرطوم Houyi 1.55 متر مرنة",
        category: "maintenance",
        subcategory: "cleaning-tools",
        description: "فرشاة خرطوم مرنة بطرفين من Houyi بطول 1.55 متر. زنبركية لتنظيف الخراطيم والأنابيب من الداخل. تزيل الطحالب والرواسب بفعالية.",
        price: 10,
        specifications: {
            "العلامة التجارية": "Houyi",
            "الطول": "1.55 متر",
            "النوع": "فرشاة زنبركية مرنة",
            "اللون": "أزرق",
            "الطرفين": "قابل للاستخدام من الجهتين",
            "مناسب لـ": "خراطيم 4-16 ملم",
            "الاستخدام": "تنظيف الخراطيم والأنابيب"
        }
    },
    "fish tank cleaning towel": {
        arabicName: "منشفة Houyi لتنظيف الحوض",
        category: "maintenance",
        subcategory: "cleaning-tools",
        description: "منشفة مخصصة لتنظيف الحوض من Houyi. خالية من الوبر، لا تخدش الزجاج، قوة امتصاص عالية. آمنة للاستخدام داخل وخارج الحوض.",
        price: 6,
        specifications: {
            "العلامة التجارية": "Houyi",
            "المادة": "مايكروفايبر",
            "الحجم": "30×40 سم",
            "خالية من الوبر": "نعم",
            "لا تخدش": "نعم - آمنة على الزجاج",
            "قابلة للغسل": "نعم",
            "الامتصاص": "عالي جداً"
        }
    },
    "Acrylic tool rack": {
        arabicName: "حامل أدوات Houyi أكريليك شفاف",
        category: "accessories",
        subcategory: "organization",
        description: "حامل أدوات أكريليك شفاف من Houyi لتنظيم أدوات الصيانة. يثبت على جانب الحوض. مظهر أنيق وعملي لحفظ الملاقط والمقصات والأدوات الصغيرة.",
        price: 14,
        specifications: {
            "العلامة التجارية": "Houyi",
            "المادة": "أكريليك شفاف",
            "السعة": "4-6 أدوات",
            "التثبيت": "شفط أو لاصق",
            "الأبعاد": "10×8×6 سم",
            "الشفافية": "عالية",
            "متين": "نعم - مقاوم للكسر"
        }
    },
    "Check valve round red": {
        arabicName: "صمام عدم رجوع Houyi دائري أحمر",
        category: "accessories",
        subcategory: "air-pump-accessories",
        description: "صمام عدم رجوع من Houyi يمنع رجوع الماء إلى مضخة الهواء. ضروري لحماية المضخة من التلف. تصميم دائري بلون أحمر واضح.",
        price: 3,
        specifications: {
            "العلامة التجارية": "Houyi",
            "النوع": "صمام عدم رجوع",
            "الشكل": "دائري",
            "اللون": "أحمر",
            "قطر الخرطوم": "4 ملم",
            "المادة": "بلاستيك عالي الجودة",
            "الوظيفة": "منع رجوع الماء"
        }
    },
    "Control valve 4mm": {
        arabicName: "صمام تحكم Houyi 4 ملم",
        category: "accessories",
        subcategory: "air-pump-accessories",
        description: "صمام تحكم من Houyi للتحكم بتدفق الهواء. قطر 4 ملم. يسمح بضبط دقيق لكمية الهواء المتدفقة إلى الحوض.",
        price: 2,
        specifications: {
            "العلامة التجارية": "Houyi",
            "النوع": "صمام تحكم",
            "القطر": "4 ملم",
            "المادة": "بلاستيك",
            "التحكم": "دقيق - دوراني",
            "الاستخدام": "ضبط تدفق الهواء"
        }
    },
    "4mm T& 4mm I &4mm Y": {
        arabicName: "وصلات Houyi 4 ملم (T و I و Y)",
        category: "accessories",
        subcategory: "tubing-connectors",
        description: "مجموعة وصلات من Houyi بأشكال مختلفة (T, I, Y) لتوزيع الهواء أو الماء. قطر 4 ملم. ضرورية لتوصيل الخراطيم المتعددة.",
        price: 4,
        specifications: {
            "العلامة التجارية": "Houyi",
            "الأشكال": "T (حرف T), I (مستقيم), Y (حرف Y)",
            "القطر": "4 ملم",
            "المادة": "بلاستيك مرن",
            "عدد القطع": "3 وصلات مختلفة",
            "الاستخدام": "توزيع الهواء أو الماء"
        }
    },
    "4 port blue & 6port blue": {
        arabicName: "موزع هواء Houyi (4 و 6 منافذ) أزرق",
        category: "accessories",
        subcategory: "air-pump-accessories",
        description: "موزع هواء من Houyi بمنافذ متعددة (4 و 6). يوزع الهواء من مضخة واحدة إلى عدة أحواض أو نقاط. بلون أزرق.",
        price: 6,
        specifications: {
            "العلامة التجارية": "Houyi",
            "المنافذ": "4 منافذ و 6 منافذ",
            "اللون": "أزرق",
            "المادة": "بلاستيك عالي الجودة",
            "قطر الخرطوم": "4 ملم",
            "الاستخدام": "توزيع الهواء"
        }
    },
    "Hose clamp    With packaging-blue": {
        arabicName: "مشابك خرطوم Houyi زرقاء (مع تغليف)",
        category: "accessories",
        subcategory: "tubing-accessories",
        description: "مشابك خرطوم من Houyi لتثبيت الخراطيم ومنع انزلاقها. تأتي مع تغليف احترافي. بلون أزرق. ضرورية لتثبيت الخراطيم على الفلاتر والمضخات.",
        price: 3,
        specifications: {
            "العلامة التجارية": "Houyi",
            "اللون": "أزرق",
            "المادة": "بلاستيك مرن",
            "قطر الخرطوم": "4-16 ملم",
            "عدد القطع": "10 مشابك",
            "التغليف": "نعم - احترافي"
        }
    },
    "Color oxygenation tube  4M 5 PIC BLACK   5 PIC WHITE": {
        arabicName: "خرطوم هواء Houyi ملون 4 متر (5 أسود + 5 أبيض)",
        category: "accessories",
        subcategory: "air-tubing",
        description: "خرطوم هواء من Houyi بطول 4 متر. يأتي بلونين (5 قطع سوداء + 5 قطع بيضاء). مرن ومتين لنقل الهواء من المضخة إلى الحوض.",
        price: 8,
        specifications: {
            "العلامة التجارية": "Houyi",
            "الطول": "4 متر لكل قطعة",
            "عدد القطع": "10 قطع (5 سوداء + 5 بيضاء)",
            "القطر": "4 ملم",
            "المادة": "سيليكون مرن",
            "المرونة": "عالية",
            "مقاوم للتآكل": "نعم"
        }
    },
    "Chubby thermometer": {
        arabicName: "ترمومتر Houyi عائم صغير",
        category: "monitoring",
        subcategory: "thermometers",
        description: "ترمومتر عائم صغير من Houyi بتصميم ظريف. دقيق وسهل القراءة. يطفو على سطح الماء لقياس درجة الحرارة بدقة.",
        price: 5,
        specifications: {
            "العلامة التجارية": "Houyi",
            "النوع": "ترمومتر عائم",
            "المدى": "0-50 درجة مئوية",
            "الدقة": "±1 درجة",
            "التثبيت": "عائم على السطح",
            "سهولة القراءة": "ممتاز"
        }
    },
    "led屏显温度计": {
        arabicName: "ترمومتر Houyi LED رقمي",
        category: "monitoring",
        subcategory: "thermometers",
        description: "ترمومتر رقمي من Houyi بشاشة LED واضحة. يعرض درجة الحرارة بدقة عالية. سهل التثبيت والقراءة حتى من بعيد.",
        price: 12,
        specifications: {
            "العلامة التجارية": "Houyi",
            "النوع": "ترمومتر رقمي LED",
            "الشاشة": "LED واضحة",
            "المدى": "-50 إلى 110 درجة",
            "الدقة": "±0.1 درجة",
            "البطارية": "LR44 (مرفقة)",
            "مقاوم للماء": "نعم - IP67"
        }
    },
    "Blue Dragon – flake": {
        arabicName: "طعام Houyi Blue Dragon رقائق",
        category: "fish-food",
        subcategory: "flakes",
        description: "طعام رقائق Blue Dragon من Houyi للأسماك الاستوائية. متوازن غذائياً ويحتوي على جميع العناصر الضرورية. يحسن الألوان ويعزز المناعة.",
        price: 10,
        specifications: {
            "العلامة التجارية": "Houyi Blue Dragon",
            "النوع": "رقائق",
            "الوزن": "100 جرام",
            "البروتين": "45%",
            "الدهون": "8%",
            "الألياف": "3%",
            "مناسب لـ": "جميع الأسماك الاستوائية",
            "الفوائد": "تحسين الألوان والمناعة"
        }
    },
    "Feeding cup GREEN & WHITE": {
        arabicName: "كوب تغذية Houyi (أخضر وأبيض)",
        category: "accessories",
        subcategory: "feeding-accessories",
        description: "كوب تغذية من Houyi بلونين (أخضر وأبيض). يثبت على زجاج الحوض بالشفط. يمنع انتشار الطعام ويسهل مراقبة كمية الطعام المقدمة.",
        price: 7,
        specifications: {
            "العلامة التجارية": "Houyi",
            "الألوان": "أخضر وأبيض",
            "المادة": "بلاستيك شفاف",
            "التثبيت": "شفط قوي",
            "القطر": "8 سم",
            "الفوائد": "منع تلوث الماء، سهولة التنظيف"
        }
    },
    "DoPhin Electric Skimmer": {
        arabicName: "كاشط سطح Houyi DoPhin كهربائي",
        category: "filtration",
        subcategory: "surface-skimmers",
        description: "كاشط سطح كهربائي من Houyi (DoPhin). يزيل الزيوت والبروتينات من سطح الماء تلقائياً. يحسن تبادل الغازات ومظهر سطح الماء.",
        price: 45,
        specifications: {
            "العلامة التجارية": "Houyi DoPhin",
            "النوع": "كاشط سطح كهربائي",
            "القدرة": "5 واط",
            "التدفق": "200 لتر/ساعة",
            "الجهد": "220-240V",
            "مناسب لـ": "أحواض حتى 100 لتر",
            "التثبيت": "داخلي - شفط"
        }
    },
    "Fat injection": {
        arabicName: "حقنة Houyi لتغذية الأسماك",
        category: "accessories",
        subcategory: "feeding-accessories",
        description: "حقنة تغذية من Houyi لإطعام الأسماك المريضة أو الصغيرة. مثالية لتقديم الطعام السائل أو المهروس. سهلة التنظيف والاستخدام.",
        price: 4,
        specifications: {
            "العلامة التجارية": "Houyi",
            "السعة": "10 مل",
            "المادة": "بلاستيك طبي آمن",
            "الاستخدام": "تغذية الأسماك المريضة/الصغيرة",
            "سهولة التنظيف": "ممتاز",
            "دقة الجرعة": "عالية"
        }
    },
    "Foam Glue": {
        arabicName: "غراء رغوي Houyi آمن للأحواض",
        category: "accessories",
        subcategory: "aquascaping",
        description: "غراء رغوي من Houyi آمن للأحواض المائية. يستخدم لتثبيت الأحجار والديكورات. غير سام وآمن على الأسماك والنباتات.",
        price: 8,
        specifications: {
            "العلامة التجارية": "Houyi",
            "النوع": "غراء رغوي مائي",
            "الحجم": "50 جرام",
            "آمن": "نعم - غير سام",
            "الاستخدام": "تثبيت الديكور والأحجار",
            "وقت الجفاف": "24 ساعة",
            "مقاوم للماء": "نعم"
        }
    },
    "Gauze isolation net": {
        arabicName: "شبكة عزل Houyi قماشية",
        category: "breeding",
        subcategory: "breeding-accessories",
        description: "شبكة عزل قماشية من Houyi لفصل الأسماك أو عزل الزريعة. مرنة وآمنة. تسمح بتدفق الماء مع حماية الأسماك الصغيرة.",
        price: 6,
        specifications: {
            "العلامة التجارية": "Houyi",
            "المادة": "قماش شبكي ناعم",
            "الحجم": "30×20 سم",
            "الاستخدام": "عزل الزريعة أو الأسماك المريضة",
            "تدفق الماء": "ممتاز",
            "آمن": "نعم - لا يؤذي الأسماك"
        }
    },
    "Mesh 8cm": {
        arabicName: "شبكة Houyi 8 سم للأحواض",
        category: "maintenance",
        subcategory: "fish-nets",
        description: "شبكة أسماك من Houyi بقطر 8 سم. حجم مثالي للأسماك الصغيرة والمتوسطة. ناعمة لحماية الأسماك من الإصابات.",
        price: 5,
        specifications: {
            "العلامة التجارية": "Houyi",
            "القطر": "8 سم",
            "العمق": "6 سم",
            "المقبض": "بلاستيك مريح",
            "الشبكة": "ناعمة جداً",
            "مناسب لـ": "الأسماك الصغيرة/المتوسطة"
        }
    },
    "Moss glue 5g green&White Moss Glue 20g White& glue White 50g": {
        arabicName: "غراء موس Houyi (5جم، 20جم، 50جم)",
        category: "accessories",
        subcategory: "aquascaping",
        description: "غراء موس من Houyi بأحجام مختلفة (5 و 20 و 50 جرام). مخصص لتثبيت الموس على الأحجار والخشب. آمن تماماً على النباتات والأسماك.",
        price: 10,
        specifications: {
            "العلامة التجارية": "Houyi",
            "الأحجام": "5 جرام، 20 جرام، 50 جرام",
            "الألوان": "أخضر وأبيض",
            "الاستخدام": "تثبيت الموس والنباتات",
            "آمن": "نعم - غير سام 100%",
            "وقت الجفاف": "5-10 دقائق",
            "مقاوم للماء": "نعم"
        }
    }
};

/**
 * Scans a folder for images and returns array of image paths
 */
function scanImagesInFolder(folderName: string): string[] {
    const folderPath = join(process.cwd(), "client", "public", "images", "products", "houyi", folderName);

    try {
        if (!statSync(folderPath).isDirectory()) {
            console.warn(`⚠️  ${folderName} is not a directory`);
            return [];
        }

        const files = readdirSync(folderPath);
        const imageFiles = files.filter(file =>
            /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
        );

        return imageFiles.map(file => `/images/products/houyi/${folderName}/${file}`);
    } catch (error) {
        console.warn(`⚠️  Could not read folder: ${folderName}`);
        return [];
    }
}

/**
 * Map actual folder names to product data keys
 * This ensures we can find the right product data for each folder
 */
const folderToProductMap: Record<string, string> = {
    "Activated carbon": "Activated carbon",
    "Ceramic ring": "Ceramic ring",
    "Breathing ring – white": "Breathing ring",
    "Medium cotton grey 50g & Medium cotton brown 50g": "Medium cotton grey 50g & Medium cotton brown 50g",
    "Dutch Sand": "Dutch Sand",
    "Aquatic plants": "Aquatic plants",
    "Aquarium Fish Tank Five-in-one Cleaning Tool Fish Net Scraper Algae Knife Aquatic Clip": "Aquarium Fish Tank Five-in-one Cleaning Tool Fish Net Scraper Algae Knife Aquatic Clip",
    "Aquarium Fish Tank Stainless Steel Telescopic Square Fishnet Three-section Fishing Net  MEDIAM": "Aquarium Fish Tank Stainless Steel Telescopic Square Fishnet Three-section Fishing Net  MEDIAM",
    "1.55m double-ended spring brush (blue)Hose brush": "1.55m double-ended spring brush (blue)Hose brush",
    "fish tank cleaning towel": "fish tank cleaning towel",
    "Acrylic tool rack": "Acrylic tool rack",
    "Check valve round red": "Check valve round red",
    "Control valve 4mm": "Control valve 4mm",
    "4mm T& 4mm I &4mm Y": "4mm T& 4mm I &4mm Y",
    "4 port blue & 6port blue": "4 port blue & 6port blue",
    "Hose clamp    With packaging-blue": "Hose clamp    With packaging-blue",
    "Color oxygenation tube  4M 5 PIC BLACK   5 PIC WHITE": "Color oxygenation tube  4M 5 PIC BLACK   5 PIC WHITE",
    "Chubby thermometer": "Chubby thermometer",
    "led屏显温度计": "led屏显温度计",
    "Blue Dragon – flake": "Blue Dragon – flake",
    "Feeding cup GREEN & WHITE": "Feeding cup GREEN & WHITE",
    "DoPhin Electric Skimmer": "DoPhin Electric Skimmer",
    "Fat injection": "Fat injection",
    "Foam Glue": "Foam Glue",
    "Gauze isolation net": "Gauze isolation net",
    "Mesh 8cm": "Mesh 8cm",
    "Moss glue 5g green&White Moss Glue 20g White& glue White 50g": "Moss glue 5g green&White Moss Glue 20g White& glue White 50g"
};

/**
 * Generate products array with images scanned from folders
 */
function generateProductsWithImages() {
    const products = [];

    for (const [folderName, productKey] of Object.entries(folderToProductMap)) {
        const data = productData[productKey];

        if (!data) {
            console.warn(`⚠️  No product data found for: ${productKey}`);
            continue;
        }

        // Scan images from folder
        const images = scanImagesInFolder(folderName);

        if (images.length === 0) {
            console.warn(`⚠️  No images found for: ${folderName}`);
            continue;
        }

        // Use folder name to generate unique ID
        const uniqueId = `houyi-${generateSlug(folderName)}`;
        const uniqueSlug = `houyi-${generateSlug(folderName)}`;

        const product = {
            id: uniqueId,
            slug: uniqueSlug,
            name: data.arabicName,
            brand: "Houyi",
            category: data.category,
            subcategory: data.subcategory,
            description: data.description,
            price: cnyToIqd(data.price),
            stock: Math.floor(Math.random() * 20) + 10, // Random stock 10-30
            isNew: true,
            images: images,
            thumbnail: images[0], // First image as thumbnail
            specifications: data.specifications
        };

        products.push(product);
        console.log(`✅ ${product.name} - ${images.length} صور`);
    }

    return products;
}

/**
 * Main import function
 */
async function importHouyiProducts() {
    console.log("\n🚀 بدء استيراد منتجات Houyi...\n");

    // Generate products with images
    const houyiProducts = generateProductsWithImages();

    console.log(`\n📦 تم تحضير ${houyiProducts.length} منتج من Houyi\n`);

    if (houyiProducts.length === 0) {
        console.error("❌ لم يتم العثور على منتجات للاستيراد!");
        process.exit(1);
    }

    // Insert into database
    try {
        console.log("💾 جاري إدخال المنتجات في قاعدة البيانات...\n");

        for (const product of houyiProducts) {
            await db.insert(products).values(product);
            console.log(`✅ تم إضافة: ${product.name}`);
        }

        console.log(`\n🎉 تم استيراد ${houyiProducts.length} منتج بنجاح!`);
        console.log("\n✨ جميع منتجات Houyi أصبحت متاحة على الموقع!\n");

        process.exit(0);
    } catch (error) {
        console.error("\n❌ خطأ أثناء إدخال المنتجات:", error);
        process.exit(1);
    }
}

// Run import
importHouyiProducts();
