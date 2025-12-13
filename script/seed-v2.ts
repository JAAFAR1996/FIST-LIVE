
import { neon } from "@neondatabase/serverless";
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Load env vars logic if needed, but we'll assume npx tsx --env-file handles it
// or we check process.env

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
const workbookPath = path.resolve(__dirname, "../aquarium-export-20251104-1762270489031.xlsx");
const localImageDir = path.resolve(__dirname, "../client/public/products");

// Reuse logic from seed.ts
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

const deriveBrand = (row: any) => {
    const name = (row.Name || "").toString().trim();
    const supplier = (row.Supplier || "").toString().trim();
    const firstToken = name.split(/\s+/)[0]?.replace(/[^A-Za-z0-9-]/g, "");
    if (firstToken && firstToken.length >= 2) return firstToken.toUpperCase();
    if (supplier) return supplier;
    return "Generic";
};

const buildDescription = (row: any, priceIQD: number, stock: number) => {
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

async function seed() {
    console.log("🚀 Starting seed process (v2)...");

    try {
        const workbook = XLSX.readFile(workbookPath, { cellDates: false });
        const sheet = workbook.Sheets["Products"];
        if (!sheet) throw new Error("Products sheet not found in workbook");

        const rawProducts: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });
        console.log(`📊 Found ${rawProducts.length} products in Excel.`);

        // Clear existing products
        // Note: We use raw sql
        console.log("🧹 Clearing existing products...");
        await sql`DELETE FROM products`;
        console.log("   ✓ Products cleared");

        let count = 0;
        for (const row of rawProducts) {
            const priceIQD = toNumber(row["Price IQD"]);
            const priceUSD = toNumber(row["Price USD"]);
            const stock = toNumber(row.Quantity);
            const nameEn = (row.Name || "").toString().trim();
            const slugBase = slugify(nameEn || row["Name (Arabic)"] || `product-${row["#"]}`);
            const slug = slugBase ? `${slugBase}-${row["#"]}` : `product-${row["#"]}`;
            const displayName = row["Name (Arabic)"]
                ? `${row["Name (Arabic)"]} | ${nameEn || row["Name (Arabic)"]}`
                : nameEn || `Product ${row["#"]}`;
            const lowStock = Math.max(1, Math.min(5, Math.floor(stock / 3) || 2));
            const baseDesc = (row.Description || "").toString().trim();

            const imagePath = `/products/${slug}.jpg`;
            const localPath = path.join(localImageDir, `${slug}.jpg`);
            const thumbnail =
                fs.existsSync(localPath) && fs.statSync(localPath).size > 0
                    ? imagePath
                    : categoryFallback[row.Category] || "/stock_images/aquarium_canister_fi_ebe5d7af.jpg";

            const product = {
                id: `p-${row["#"]}-${slugBase || "item"}`,
                slug,
                name: displayName,
                brand: deriveBrand(row),
                category: (row.Category || "Other").toString().trim(),
                subcategory: (row.Category || "General").toString().trim(),
                description: buildDescription(row, priceIQD, stock),
                price: priceIQD
                    ? priceIQD.toString()
                    : priceUSD
                        ? Math.round(priceUSD * 1300).toString()
                        : "0",
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
                specifications: JSON.stringify({
                    supplier: row.Supplier || "N/A",
                    status: row.Status || "unspecified",
                    baseDescription: baseDesc,
                    category: row.Category,
                    sheetRow: row["#"],
                    quantity: stock,
                    priceUSD: priceUSD || undefined,
                    totalUSD: toNumber(row["Total USD"]) || undefined,
                    totalIQD: toNumber(row["Total IQD"]) || undefined,
                }),
            };

            // Insert logic
            // We map object keys to columns manually to be safe with snake_case
            await sql`
        INSERT INTO products (
          id, slug, name, brand, category, subcategory, description, price, original_price, currency, images, thumbnail, rating, review_count, stock, low_stock_threshold, is_new, is_best_seller, specifications
        ) VALUES (
          ${product.id}, ${product.slug}, ${product.name}, ${product.brand}, ${product.category}, ${product.subcategory}, ${product.description}, ${product.price}, ${product.original_price}, ${product.currency}, ${product.images}::jsonb, ${product.thumbnail}, ${product.rating}, ${product.review_count}, ${product.stock}, ${product.low_stock_threshold}, ${product.is_new}, ${product.is_best_seller}, ${product.specifications}::jsonb
        )
        ON CONFLICT (id) DO NOTHING
      `;
            count++;
            if (count % 10 === 0) process.stdout.write(".");
        }

        console.log(`\n✅ Seed complete. Inserted ${count} products.`);
        process.exit(0);

    } catch (err) {
        console.error("\n❌ Error during seed:", err);
        process.exit(1);
    }
}

seed();
