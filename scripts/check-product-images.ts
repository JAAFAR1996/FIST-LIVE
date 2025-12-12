/**
 * سكريبت للتحقق من مسارات الصور في قاعدة البيانات
 * 
 * للتشغيل: npx tsx scripts/check-product-images.ts
 */

import { storage } from '../server/storage.js';

async function checkProductImages() {
    console.log('\n🔍 فحص مسارات الصور في قاعدة البيانات...\n');
    console.log('='.repeat(80));

    try {
        const allProducts = await storage.getProducts({});

        if (allProducts.length === 0) {
            console.log('⚠️ لا توجد منتجات في قاعدة البيانات!');
            process.exit(0);
            return;
        }

        console.log(`📦 عدد المنتجات: ${allProducts.length}\n`);

        for (const product of allProducts) {
            console.log(`\n📌 المنتج: ${product.name} (${product.id})`);
            console.log(`   🌟 منتج الأسبوع: ${product.isProductOfWeek ? '✅ نعم' : '❌ لا'}`);
            console.log(`   🖼️ Thumbnail: ${product.thumbnail || '❌ غير محدد'}`);
            console.log(`   📷 Images: ${JSON.stringify(product.images) || '❌ غير محدد'}`);

            // فحص المسارات
            const expectedPath = `/assets/products/${product.id}.png`;
            const thumbnailMatch = product.thumbnail === expectedPath;

            if (!thumbnailMatch) {
                console.log(`   ⚠️ المسار المتوقع: ${expectedPath}`);
                console.log(`   ⚠️ المسار الفعلي: ${product.thumbnail}`);
            } else {
                console.log(`   ✅ المسار صحيح`);
            }
        }

        console.log('\n' + '='.repeat(80));
        console.log('\n✅ انتهى الفحص\n');

        // ملخص
        const withCorrectPaths = allProducts.filter(p =>
            p.thumbnail?.startsWith('/assets/products/')
        );
        const productOfWeek = allProducts.filter(p => p.isProductOfWeek);

        console.log('📊 ملخص:');
        console.log(`   - منتجات بمسارات صحيحة (/assets/products/): ${withCorrectPaths.length}/${allProducts.length}`);
        console.log(`   - منتجات الأسبوع: ${productOfWeek.length}`);

        if (productOfWeek.length > 0) {
            console.log('\n🌟 منتجات الأسبوع:');
            productOfWeek.forEach(p => {
                console.log(`   - ${p.name}: ${p.thumbnail}`);
            });
        }

    } catch (error) {
        console.error('❌ خطأ في الاتصال بقاعدة البيانات:', error);
    }

    process.exit(0);
}

checkProductImages();
