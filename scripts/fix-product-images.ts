/**
 * سكريبت لإصلاح مسارات الصور في قاعدة البيانات
 * 
 * للتشغيل: npx tsx scripts/fix-product-images.ts
 */

import { storage } from '../server/storage.js';

const CORRECT_IMAGE_PATHS: Record<string, string> = {
    'fluval-407': '/assets/products/fluval-407.png',
    'aquaclear-70': '/assets/products/aquaclear-70.png',
    'seachem-prime': '/assets/products/seachem-prime.png',
    'eheim-jager-200w': '/assets/products/eheim-jager-200w.png',
};

async function fixProductImages() {
    console.log('\n🔧 إصلاح مسارات الصور في قاعدة البيانات...\n');
    console.log('='.repeat(80));

    try {
        const allProducts = await storage.getProducts({});

        if (allProducts.length === 0) {
            console.log('⚠️ لا توجد منتجات في قاعدة البيانات!');
            process.exit(0);
            return;
        }

        let fixedCount = 0;

        for (const product of allProducts) {
            const correctPath = CORRECT_IMAGE_PATHS[product.id] || `/assets/products/${product.id}.png`;

            if (product.thumbnail !== correctPath) {
                console.log(`\n📌 إصلاح: ${product.name} (${product.id})`);
                console.log(`   من: ${product.thumbnail}`);
                console.log(`   إلى: ${correctPath}`);

                const updated = await storage.updateProduct(product.id, {
                    thumbnail: correctPath,
                    images: [correctPath],
                });

                if (updated) {
                    fixedCount++;
                    console.log(`   ✅ تم الإصلاح!`);
                } else {
                    console.log(`   ❌ فشل الإصلاح`);
                }
            } else {
                console.log(`\n📌 ${product.name}: ✅ المسار صحيح بالفعل`);
            }
        }

        console.log('\n' + '='.repeat(80));
        console.log(`\n✅ تم إصلاح ${fixedCount} منتج(ات)\n`);

    } catch (error) {
        console.error('❌ خطأ:', error);
    }

    process.exit(0);
}

fixProductImages();
