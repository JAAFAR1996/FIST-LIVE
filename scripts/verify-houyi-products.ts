/**
 * Deep Verification Script
 * Compares image folders with database products
 */

import { getDb } from "../server/db";
import { products } from "../shared/schema";
import { readdirSync, statSync } from "fs";
import { join } from "path";
import { like } from "drizzle-orm";

const db = getDb();
if (!db) {
    console.error("❌ Database connection failed.");
    process.exit(1);
}

async function deepVerification() {
    console.log("\n🔍 فحص شامل لمنتجات HOUYI...\n");
    console.log("=".repeat(60));

    // 1. Get all image folders
    const houyiDir = join(process.cwd(), "client", "public", "images", "products", "houyi");
    const folders = readdirSync(houyiDir).filter(f => {
        const fullPath = join(houyiDir, f);
        return statSync(fullPath).isDirectory();
    });

    console.log(`📁 مجلدات الصور: ${folders.length}\n`);

    // 2. Get all HOUYI products from database
    const dbProducts = await db
        .select({ id: products.id, name: products.name, images: products.images })
        .from(products)
        .where(like(products.brand, '%HOUYI%'));

    console.log(`🗃️  منتجات في قاعدة البيانات: ${dbProducts.length}\n`);
    console.log("=".repeat(60));

    // 3. Check each folder
    const missing: string[] = [];
    const found: string[] = [];
    const noImages: string[] = [];

    for (const folder of folders) {
        // Skip non-product folders
        if (folder.includes("Professional Image") || folder.includes("Task")) {
            continue;
        }

        // Check if folder has images
        const folderPath = join(houyiDir, folder);
        const files = readdirSync(folderPath);
        const imageFiles = files.filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));

        if (imageFiles.length === 0) {
            noImages.push(folder);
            continue;
        }

        // Check if product exists in database
        const imagePath = `/images/products/houyi/${folder}/`;
        const productExists = dbProducts.some(p => {
            const images = p.images as string[] | null;
            return images && images.some(img => img.includes(folder));
        });

        if (productExists) {
            found.push(folder);
        } else {
            missing.push(folder);
        }
    }

    // 4. Print results
    console.log("\n✅ المجلدات الموجود لها منتجات:");
    console.log("-".repeat(40));
    found.forEach((f, i) => console.log(`   ${i + 1}. ${f}`));

    if (missing.length > 0) {
        console.log("\n❌ المجلدات الناقصة (ليس لها منتج):");
        console.log("-".repeat(40));
        missing.forEach((f, i) => console.log(`   ${i + 1}. ${f}`));
    }

    if (noImages.length > 0) {
        console.log("\n⚠️  مجلدات بدون صور:");
        console.log("-".repeat(40));
        noImages.forEach((f, i) => console.log(`   ${i + 1}. ${f}`));
    }

    // 5. Summary
    console.log("\n" + "=".repeat(60));
    console.log("📊 ملخص الفحص:");
    console.log(`   ✅ موجود: ${found.length} منتج`);
    console.log(`   ❌ ناقص: ${missing.length} منتج`);
    console.log(`   ⚠️  بدون صور: ${noImages.length} مجلد`);
    console.log("=".repeat(60));

    if (missing.length === 0) {
        console.log("\n🎉 جميع المنتجات موجودة! لا يوجد شيء ناقص.\n");
    } else {
        console.log("\n⚠️  هناك منتجات ناقصة تحتاج استيراد!\n");
    }

    process.exit(0);
}

deepVerification();
