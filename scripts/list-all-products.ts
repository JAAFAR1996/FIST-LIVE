/**
 * List All Products in Database
 */

import { getDb } from "../server/db";
import { products } from "../shared/schema";

const db = getDb();
if (!db) {
    console.error("❌ Database connection failed.");
    process.exit(1);
}

async function listProducts() {
    console.log("\n📦 قائمة جميع المنتجات في قاعدة البيانات:\n");
    console.log("━".repeat(80));

    try {
        const allProducts = await db.select({
            id: products.id,
            name: products.name,
            brand: products.brand,
            category: products.category,
            price: products.price,
            stock: products.stock,
            hasVariants: products.hasVariants
        }).from(products).orderBy(products.brand, products.name);

        console.log(`\n📊 إجمالي المنتجات: ${allProducts.length}\n`);

        // Group by brand
        const brands: Record<string, typeof allProducts> = {};
        for (const p of allProducts) {
            if (!brands[p.brand]) brands[p.brand] = [];
            brands[p.brand].push(p);
        }

        for (const [brand, prods] of Object.entries(brands)) {
            console.log(`\n🏷️ ${brand} (${prods.length} منتج):`);
            console.log("-".repeat(60));
            for (const p of prods) {
                const variantTag = p.hasVariants ? "📦" : "  ";
                console.log(`${variantTag} ${p.name}`);
                console.log(`   💰 ${p.price} IQD | 📊 مخزون: ${p.stock} | 📁 ${p.category}`);
            }
        }

    } catch (error: any) {
        console.error("❌ خطأ:", error.message);
    }

    console.log("\n" + "━".repeat(80));
}

listProducts().catch(console.error);
