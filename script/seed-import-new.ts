/**
 * seed-import-new.ts
 * Imports products from Excel file WITHOUT deleting existing products
 * Uses INSERT ... ON CONFLICT DO UPDATE to handle duplicates
 */

import { neon } from "@neondatabase/serverless";
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const require = createRequire(import.meta.url);
const XLSX = require("xlsx");

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
    console.error("❌ DATABASE_URL not found. Run with --env-file=.env.local");
    process.exit(1);
}

const sql = neon(DATABASE_URL);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use the new Excel file
const workbookPath = path.resolve(__dirname, "../aquarium-export-20251104-1762273765845.xlsx");
const localImageDir = path.resolve(__dirname, "../client/public/products");

// Fallback images per category
const categoryFallback: Record<string, string> = {
    "إضاءات": "/stock_images/aquarium_canister_fi_ebe5d7af.jpg",
    "طعام الأسماك": "/stock_images/aquarium_water_condi_76f4e911.jpg",
    "الأدوية": "/stock_images/aquarium_water_condi_76f4e911.jpg",
    "معالجة المياه": "/stock_images/aquarium_water_condi_76f4e911.jpg",
    "مجموعات الاختبار": "/stock_images/aquarium_water_condi_76f4e911.jpg",
    "الملح والمعادن": "/stock_images/aquarium_water_condi_76f4e911.jpg",
    "البكتيريا النافعة": "/stock_images/aquarium_water_condi_76f4e911.jpg",
    "مكافحة الطحالب": "/stock_images/aquarium_water_condi_76f4e911.jpg",
    "فيتامينات المياه العذبة": "/stock_images/aquarium_water_condi_76f4e911.jpg",
    "مكملات غذائية": "/stock_images/aquarium_water_condi_76f4e911.jpg",
    "اكسسوارات": "/stock_images/aquarium_canister_fi_ebe5d7af.jpg",
    "اكسسوارات ": "/stock_images/aquarium_canister_fi_ebe5d7af.jpg",
    "ادوات فلتر": "/stock_images/aquarium_canister_fi_ebe5d7af.jpg",
    "أجهزة القياس والحرارة": "/stock_images/aquarium_heater_prod_b5512720.jpg",
    "سخانات": "/stock_images/aquarium_heater_prod_b5512720.jpg",
    "فلاتر ماء": "/stock_images/aquarium_canister_fi_ebe5d7af.jpg",
    "مضخات هواء": "/stock_images/aquarium_canister_fi_ebe5d7af.jpg",
    "ديكور": "/stock_images/anubias_nana_aquariu_554af5dc.jpg",
    "صخور": "/stock_images/anubias_nana_aquariu_554af5dc.jpg",
    "خلفيات أحواض": "/stock_images/anubias_nana_aquariu_554af5dc.jpg",
    "ترب نباتية": "/stock_images/anubias_nana_aquariu_554af5dc.jpg",
};

const slugify = (value: string) =>
    value
        .normalize("NFKD")
        .replace(/[^\w\s-]/g, " ")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

const toNumber = (value: unknown) => {
    const num = typeof value === "number" ? value : Number(value);
    return Number.isFinite(num) ? num : 0;
};

const deriveBrand = (row: Record<string, unknown>) => {
    const name = (row.Name || "").toString().trim();
    const supplier = (row.Supplier || "").toString().trim();
    const firstToken = name.split(/\s+/)[0]?.replace(/[^A-Za-z0-9-]/g, "");
    if (firstToken && firstToken.length >= 2) return firstToken.toUpperCase();
    if (supplier) return supplier;
    return "Generic";
};

const buildDescription = (row: Record<string, unknown>, priceIQD: number, stock: number) => {
    const arName = (row["Name (Arabic)"] || row.Name || "منتج").toString().trim();
    const enName = (row.Name || row["Name (Arabic)"] || "Product").toString().trim();
    const short = (row.Description || "").toString().trim();
    const supplier = (row.Supplier || "غير محدد").toString().trim();
    const availability = stock <= 3 ? "الكمية محدودة، احجز الآن." : "متوفر للشحن السريع.";
    const priceText = priceIQD > 0 ? priceIQD.toLocaleString("en-US") : "--";
    const benefit = short || "تحسين صحة الأسماك وجودة الماء بخامات أصلية موثوقة";
    const englishBenefit = short || "Original quality to boost fish health and water clarity";

    const arCopy = `${arName} — ${benefit}. السعر ${priceText} د.ع للقطعة؛ المتوفر ${stock} قطعة. المورد: ${supplier}. ${availability}`;
    const enCopy = `${enName} — ${englishBenefit}. Price ${priceText} IQD each; stock ${stock}. Supplier: ${supplier}. ${stock <= 3 ? "Low stock—reserve yours now." : "Fast dispatch available."}`;
    return `${arCopy} | ${enCopy}`;
};

async function importProducts() {
    console.log("🚀 Starting product import (adding new products)...\n");

    try {
        // Check if file exists
        if (!fs.existsSync(workbookPath)) {
            console.error(`❌ Excel file not found: ${workbookPath}`);
            process.exit(1);
        }

        const workbook = XLSX.readFile(workbookPath, { cellDates: false });

        // Try to find the sheet - might be "Products" or first sheet
        let sheet = workbook.Sheets["Products"];
        if (!sheet) {
            const firstSheetName = workbook.SheetNames[0];
            sheet = workbook.Sheets[firstSheetName];
            console.log(`📋 Using sheet: ${firstSheetName}`);
        }

        if (!sheet) throw new Error("No sheets found in workbook");

        const rawProducts: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        console.log(`📊 Found ${rawProducts.length} products in Excel.\n`);

        let insertedCount = 0;
        let updatedCount = 0;
        let errorCount = 0;

        for (const row of rawProducts) {
            try {
                const rowNum = row["#"] as number;
                const priceIQD = toNumber(row["Price IQD"]);
                const priceUSD = toNumber(row["Price USD"]);
                const stock = toNumber(row.Quantity);
                const nameEn = (row.Name || "").toString().trim();
                const nameAr = (row["Name (Arabic)"] || "").toString().trim();
                const category = (row.Category || "Other").toString().trim();

                // Skip rows without a valid row number
                if (!rowNum) continue;

                const slugBase = slugify(nameEn || nameAr || `product-${rowNum}`);
                const slug = slugBase ? `${slugBase}-${rowNum}` : `product-${rowNum}`;

                const displayName = nameAr
                    ? `${nameAr} | ${nameEn || nameAr}`
                    : nameEn || `Product ${rowNum}`;

                const lowStock = Math.max(1, Math.min(5, Math.floor(stock / 3) || 2));

                const imagePath = `/products/${slug}.jpg`;
                const localPath = path.join(localImageDir, `${slug}.jpg`);
                const thumbnail =
                    fs.existsSync(localPath) && fs.statSync(localPath).size > 0
                        ? imagePath
                        : categoryFallback[category] || "/stock_images/aquarium_canister_fi_ebe5d7af.jpg";

                const productId = `p-${rowNum}-${slugBase || "item"}`;
                const finalPrice = priceIQD
                    ? priceIQD.toString()
                    : priceUSD
                        ? Math.round(priceUSD * 1410).toString() // Updated exchange rate
                        : "0";

                const product = {
                    id: productId,
                    slug,
                    name: displayName,
                    brand: deriveBrand(row),
                    category,
                    subcategory: category,
                    description: buildDescription(row, priceIQD || (priceUSD * 1410), stock),
                    price: finalPrice,
                    original_price: priceIQD ? Math.round(priceIQD * 1.1).toString() : null,
                    currency: "IQD",
                    images: JSON.stringify([fs.existsSync(localPath) ? imagePath : thumbnail]),
                    thumbnail,
                    rating: "4.8",
                    review_count: 0,
                    stock,
                    low_stock_threshold: lowStock,
                    is_new: true,
                    is_best_seller: stock >= 15,
                    is_product_of_week: false,
                    specifications: JSON.stringify({
                        supplier: row.Supplier || "N/A",
                        status: row.Status || "unspecified",
                        baseDescription: (row.Description || "").toString().trim(),
                        category,
                        sheetRow: rowNum,
                        quantity: stock,
                        priceUSD: priceUSD || undefined,
                        totalUSD: toNumber(row["Total USD"]) || undefined,
                        totalIQD: toNumber(row["Total IQD"]) || undefined,
                    }),
                };

                // Use UPSERT (INSERT ... ON CONFLICT DO UPDATE)
                const result = await sql`
                    INSERT INTO products (
                        id, slug, name, brand, category, subcategory, description, 
                        price, original_price, currency, images, thumbnail, 
                        rating, review_count, stock, low_stock_threshold, 
                        is_new, is_best_seller, is_product_of_week, specifications
                    ) VALUES (
                        ${product.id}, ${product.slug}, ${product.name}, ${product.brand}, 
                        ${product.category}, ${product.subcategory}, ${product.description}, 
                        ${product.price}, ${product.original_price}, ${product.currency}, 
                        ${product.images}::jsonb, ${product.thumbnail}, 
                        ${product.rating}, ${product.review_count}, ${product.stock}, 
                        ${product.low_stock_threshold}, ${product.is_new}, ${product.is_best_seller}, 
                        ${product.is_product_of_week}, ${product.specifications}::jsonb
                    )
                    ON CONFLICT (id) DO UPDATE SET
                        name = EXCLUDED.name,
                        brand = EXCLUDED.brand,
                        category = EXCLUDED.category,
                        subcategory = EXCLUDED.subcategory,
                        description = EXCLUDED.description,
                        price = EXCLUDED.price,
                        original_price = EXCLUDED.original_price,
                        images = EXCLUDED.images,
                        thumbnail = EXCLUDED.thumbnail,
                        stock = EXCLUDED.stock,
                        low_stock_threshold = EXCLUDED.low_stock_threshold,
                        is_new = EXCLUDED.is_new,
                        is_best_seller = EXCLUDED.is_best_seller,
                        specifications = EXCLUDED.specifications,
                        updated_at = NOW()
                    RETURNING id, (xmax = 0) as was_inserted
                `;

                if (result[0]?.was_inserted) {
                    insertedCount++;
                } else {
                    updatedCount++;
                }

                if ((insertedCount + updatedCount) % 20 === 0) {
                    process.stdout.write(`\r📦 Processed ${insertedCount + updatedCount} products...`);
                }

            } catch (rowError) {
                errorCount++;
                console.error(`\n⚠️ Error on row ${row["#"]}: ${rowError}`);
            }
        }

        console.log(`\n\n${"═".repeat(50)}`);
        console.log(`✅ Import complete!`);
        console.log(`   📥 Inserted: ${insertedCount} new products`);
        console.log(`   🔄 Updated: ${updatedCount} existing products`);
        if (errorCount > 0) {
            console.log(`   ⚠️ Errors: ${errorCount}`);
        }
        console.log(`${"═".repeat(50)}\n`);

        // Get total count
        const totalResult = await sql`SELECT COUNT(*) as count FROM products WHERE deleted_at IS NULL`;
        console.log(`📊 Total products in database: ${totalResult[0]?.count}\n`);

        process.exit(0);

    } catch (err) {
        console.error("\n❌ Error during import:", err);
        process.exit(1);
    }
}

importProducts();
