/**
 * Import first 10 products from Binzhou_Houyi_FINAL_v3.xlsx
 * Run with: npx tsx scripts/import-binzhou-products.ts
 */

import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

// Direct connection string
const DATABASE_URL = "postgresql://neondb_owner:npg_N7dEzt2pWjCi@ep-quiet-moon-a4h7tdze-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require";
import { products } from "../shared/schema.js";

// First 10 products from the Excel file
const binzhouProducts = [
    {
        "#": 1,
        "Product Name": "Aquarium Aluminum Alloy Retractable Koi Fish Net",
        "Category": "tools",
        "Qty": 2,
        "Price USD": 3.44,
    },
    {
        "#": 2,
        "Product Name": "small Wholesale Aquarium Special Nylon Fishing Net",
        "Category": "tools",
        "Qty": 5,
        "Price USD": 0.5,
    },
    {
        "#": 3,
        "Product Name": "Aquarium Fish Tank Stainless Steel Telescopic Square Fishnet Three-section Fishing Net MEDIAM",
        "Category": "tools",
        "Qty": 5,
        "Price USD": 0.7,
    },
    {
        "#": 4,
        "Product Name": "Aquarium Fish Tank Five-in-one Cleaning Tool Fish Net Scraper Algae Knife Aquatic Clip",
        "Category": "tools",
        "Qty": 5,
        "Price USD": 1.4,
    },
    {
        "#": 5,
        "Product Name": "3 in 1 Quick Water Changer Aquarium Siphon Bottom Filter Kit Filter Vacuum Gravel Cleaner Fish Tank Tool Accessory",
        "Category": "tools",
        "Qty": 15,
        "Price USD": 0.68,
    },
    {
        "#": 6,
        "Product Name": "Chubby thermometer",
        "Category": "Measurement & Thermometers",
        "Qty": 15,
        "Price USD": 0.1,
    },
    {
        "#": 7,
        "Product Name": "Suction cup thermometer",
        "Category": "Measurement & Thermometers",
        "Qty": 20,
        "Price USD": 0.16,
    },
    {
        "#": 8,
        "Product Name": "DoPhin Electric Skimmer",
        "Category": "Water filters",
        "Qty": 5,
        "Price USD": 2.55,
    },
    {
        "#": 9,
        "Product Name": "led屏显温度计",
        "Category": "Measurement & Thermometers",
        "Qty": 8,
        "Price USD": 1.5,
    },
    {
        "#": 10,
        "Product Name": "Rhododendron 40-45cm",
        "Category": "decor",
        "Qty": 2,
        "Price USD": 7.66,
    },
];

// Exchange rate USD to IQD (approximate)
const USD_TO_IQD = 1480;

// Generate slug from name
function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^\w\s\u0621-\u064A-]/g, "")
        .replace(/\s+/g, "-")
        .substring(0, 100);
}

// Generate unique ID
function generateId(): string {
    return crypto.randomUUID();
}

// Category mapping to match existing categories
const categoryMapping: Record<string, { category: string; subcategory: string }> = {
    "tools": { category: "tools", subcategory: "cleaning-tools" },
    "Measurement & Thermometers": { category: "tools", subcategory: "thermometers" },
    "Water filters": { category: "filters", subcategory: "water-filters" },
    "decor": { category: "decor", subcategory: "driftwood" },
};

async function importProducts() {
    const connectionString = DATABASE_URL;

    if (!connectionString) {
        console.error("❌ DATABASE_URL is not set in environment variables");
        process.exit(1);
    }

    console.log("🔌 Connecting to NEON database...");
    const client = neon(connectionString);
    const db = drizzle(client);

    console.log("📦 Importing first 10 products from Binzhou_Houyi_FINAL_v3.xlsx...\n");

    let successCount = 0;
    let failCount = 0;

    for (const item of binzhouProducts) {
        try {
            const categoryInfo = categoryMapping[item.Category] || {
                category: item.Category.toLowerCase(),
                subcategory: "general"
            };

            // Convert USD to IQD
            const priceIQD = Math.round(item["Price USD"] * USD_TO_IQD);

            const productData = {
                id: generateId(),
                slug: generateSlug(item["Product Name"]),
                name: item["Product Name"],
                brand: "Binzhou Houyi", // Default brand for this import
                category: categoryInfo.category,
                subcategory: categoryInfo.subcategory,
                description: `${item["Product Name"]} - منتج عالي الجودة من Binzhou Houyi`,
                price: priceIQD.toString(),
                originalPrice: null,
                currency: "IQD",
                images: [] as string[],
                thumbnail: "/assets/placeholder-product.png",
                rating: "0",
                reviewCount: 0,
                stock: item.Qty,
                lowStockThreshold: 5,
                isNew: true,
                isBestSeller: false,
                isProductOfWeek: false,
                specifications: {
                    "المصدر": "Binzhou Houyi",
                    "السعر بالدولار": `$${item["Price USD"]}`,
                },
            };

            await db.insert(products).values(productData);

            console.log(`✅ [${item["#"]}] ${item["Product Name"]}`);
            console.log(`   💰 ${priceIQD.toLocaleString()} IQD (${item["Price USD"]} USD)`);
            console.log(`   📦 المخزون: ${item.Qty}`);
            console.log("");

            successCount++;
        } catch (error: any) {
            console.error(`❌ [${item["#"]}] فشل إضافة: ${item["Product Name"]}`);
            console.error(`   الخطأ: ${error.message}\n`);
            failCount++;
        }
    }

    console.log("═".repeat(50));
    console.log(`\n📊 النتائج:`);
    console.log(`   ✅ نجح: ${successCount}`);
    console.log(`   ❌ فشل: ${failCount}`);
    console.log(`   📦 الإجمالي: ${binzhouProducts.length}`);
}

importProducts().catch(console.error);
