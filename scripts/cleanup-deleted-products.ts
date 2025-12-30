/**
 * Permanently Delete Soft-Deleted Products
 */

import { getDb } from "../server/db";
import { products, cartItems, favorites } from "../shared/schema";
import { isNotNull, inArray } from "drizzle-orm";

const db = getDb();
if (!db) {
    console.error("❌ Database connection failed.");
    process.exit(1);
}

async function cleanupDeletedProducts() {
    console.log("\n🗑️ تنظيف المنتجات المحذوفة...\n");

    try {
        // Find soft-deleted products
        const deletedProducts = await db.select({
            id: products.id,
            name: products.name,
            brand: products.brand,
            deletedAt: products.deletedAt
        }).from(products).where(isNotNull(products.deletedAt));

        console.log(`📊 المنتجات المحذوفة ناعمياً: ${deletedProducts.length}`);

        if (deletedProducts.length > 0) {
            console.log("\n📋 القائمة:");
            for (const p of deletedProducts) {
                console.log(`   ❌ ${p.brand} - ${p.name}`);
            }

            const ids = deletedProducts.map(p => p.id);

            // Delete related cart items first
            console.log("\n🛒 حذف عناصر السلة المرتبطة...");
            await db.delete(cartItems).where(inArray(cartItems.productId, ids));

            // Delete related favorites
            console.log("❤️ حذف المفضلات المرتبطة...");
            await db.delete(favorites).where(inArray(favorites.productId, ids));

            // Now permanently delete products
            console.log("🗑️ حذف المنتجات نهائياً...");
            await db.delete(products).where(inArray(products.id, ids));

            console.log(`\n✅ تم الحذف النهائي لـ ${deletedProducts.length} منتج`);
        } else {
            console.log("✅ لا توجد منتجات محذوفة ناعمياً");
        }

        // Also check for the specific brands mentioned
        const brandsToCheck = ['AquaClear', 'EHEIM', 'Fluval', 'Seachem'];
        const remainingProducts = await db.select({
            id: products.id,
            name: products.name,
            brand: products.brand
        }).from(products).where(inArray(products.brand, brandsToCheck));

        if (remainingProducts.length > 0) {
            console.log(`\n⚠️ لا تزال هناك منتجات من هذه العلامات:`);
            for (const p of remainingProducts) {
                console.log(`   • ${p.brand} - ${p.name} (ID: ${p.id})`);
            }
            console.log("\n🗑️ جاري حذفها نهائياً...");

            const idsToDelete = remainingProducts.map(p => p.id);
            await db.delete(cartItems).where(inArray(cartItems.productId, idsToDelete));
            await db.delete(favorites).where(inArray(favorites.productId, idsToDelete));
            await db.delete(products).where(inArray(products.id, idsToDelete));
            console.log(`✅ تم حذف ${remainingProducts.length} منتج نهائياً`);
        }

    } catch (error: any) {
        console.error("❌ خطأ:", error.message);
    }

    console.log("\n" + "━".repeat(50));
}

cleanupDeletedProducts().catch(console.error);
