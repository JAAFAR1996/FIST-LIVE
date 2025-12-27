/**
 * Fix HYGGER specifications - Arabic keys
 * Run: npx tsx script/fix-hygger-specs-arabic.ts
 */

import { neon } from "@neondatabase/serverless";

const DATABASE_URL = "postgresql://neondb_owner:npg_N7dEzt2pWjCi@ep-quiet-moon-a4h7tdze-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require";

const sql = neon(DATABASE_URL);

async function fixSpecs() {
    console.log("🔧 Fixing HYGGER HG978-18W specifications to Arabic...");

    // All Arabic keys
    const arabicSpecs = {
        // Basic specs
        "الموديل": "HG-978",
        "القدرة": "18 واط",
        "عدد LED": "78 LED",
        "نوع LED": "5050 RGB + أبيض",
        "الألوان": "7 ألوان RGB",
        "درجة اللون": "6500K طيف كامل",

        // Electrical
        "جهد الدخول": "AC 100-240V",
        "جهد الخروج": "DC 20V",

        // Size
        "حجم الإضاءة": "18 بوصة (45 سم)",
        "حجم الحوض المناسب": "18-24 بوصة (45-60 سم)",

        // Features
        "وضع 24 ساعة": "نعم ✓",
        "مؤقت قابل للضبط": "نعم ✓",
        "خيارات المؤقت": "6، 10، 12 ساعة",
        "مستويات السطوع": "0-100% (بزيادة 10%)",
        "مقاوم للماء": "نعم ✓",

        // Design
        "الخامة": "هيكل ألمنيوم",
        "الأقواس": "أقواس معدنية قابلة للتمديد",
        "طول السلك": "2.5 متر",

        // Package
        "محتويات العلبة": "إضاءة LED + محول طاقة + 2 قوس معدني + دليل المستخدم",

        // Benefits array
        "benefits": [
            "طيف ضوئي كامل 6500K يحاكي ضوء الشمس الطبيعي",
            "وضع 24/7 ذكي يحاكي دورة الإضاءة الطبيعية (شروق-نهار-غروب)",
            "يعزز نمو النباتات المائية ويبرز ألوان الأسماك",
            "7 ألوان RGB قابلة للتخصيص مع 9 مستويات سطوع",
            "هيكل ألمنيوم ممتاز للتبريد وعمر افتراضي +50,000 ساعة"
        ]
    };

    try {
        const updateResult = await sql`
            UPDATE products 
            SET 
                specifications = ${JSON.stringify(arabicSpecs)}::jsonb,
                updated_at = NOW()
            WHERE id = 'hygger-hg978-18w'
            RETURNING id, name
        `;

        if (updateResult.length > 0) {
            console.log("✅ Updated:", updateResult[0].name);
            console.log("\n📋 New specifications (Arabic keys):");
            Object.entries(arabicSpecs).forEach(([key, value]) => {
                if (key !== 'benefits') {
                    console.log(`   ${key}: ${value}`);
                }
            });
        } else {
            console.log("❌ Product not found");
        }

    } catch (error) {
        console.error("❌ Error:", error);
    }
}

fixSpecs();
