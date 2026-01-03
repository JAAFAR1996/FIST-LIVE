import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.production' });

const sql = neon(process.env.DATABASE_URL!);

// Fixes for broken image paths
const fixes = [
    {
        id: 'yee-cylinder-air-stone',
        oldThumbnail: '/images/products/yee/cylinder-air-stone/all-sizes.png',
        newThumbnail: '/images/products/yee/cylinder-air-stone/all-sizes.webp',
        newImages: [
            '/images/products/yee/cylinder-air-stone/all-sizes.webp',
            '/images/products/yee/cylinder-air-stone/shape1-small.webp',
            '/images/products/yee/cylinder-air-stone/shape2-medium.webp',
            '/images/products/yee/cylinder-air-stone/shape3-tall.webp',
            '/images/products/yee/cylinder-air-stone/shape4-large.webp',
            '/images/products/yee/cylinder-air-stone/shape5-xlarge.webp',
            '/images/products/yee/cylinder-air-stone/shape6-wide.webp'
        ]
    },
    {
        id: 'yee-sponge-filter',
        oldThumbnail: '/images/products/yee/sponge-filter/all-models.png',
        newThumbnail: '/images/products/yee/sponge-filter/all-models.webp',
        newImages: [
            '/images/products/yee/sponge-filter/all-models.webp',
            '/images/products/yee/sponge-filter/xy-180-specs.webp',
            '/images/products/yee/sponge-filter/xy-2835-box.webp'
        ]
    },
    {
        id: 'yee-yee-black-warrior-heater-100w',
        oldThumbnail: '/images/products/yee/YEE Black Warrior Heater 100W/Ac8e3c68a83594f24bf7cfbbc7fda56e7z.avif',
        newThumbnail: '/images/products/yee/YEE Black Warrior Heater 100W/Ac8e3c68a83594f24bf7cfbbc7fda56e7z.png',
        newImages: [
            '/images/products/yee/YEE Black Warrior Heater 100W/Ac8e3c68a83594f24bf7cfbbc7fda56e7z.png'
        ]
    },
    {
        id: 'yee-fish-tank-descaling-agent-200ml',
        oldThumbnail: '/images/products/yee/Fish tank descaling agent 200ml/H0b6002bf33ce4c1ba57339c3a37b4aaeH.webp',
        newThumbnail: '/images/products/yee/Fish tank descaling agent 200ml/H0b6002bf33ce4c1ba57339c3a37b4aaeH.png',
        newImages: [
            '/images/products/yee/Fish tank descaling agent 200ml/H0b6002bf33ce4c1ba57339c3a37b4aaeH.png',
            '/images/products/yee/Fish tank descaling agent 200ml/Gemini_Generated_Image_zfgr7xzfgr7xzfgr.webp'
        ]
    },
    {
        // Use Ultra-Clear Glass Tank images for the 601515 tank
        id: 'yee-tank-601515',
        oldThumbnail: '/images/products/yee/Bare side stream tank 601515cm 6mm water pump/Gemini_Generated_Image_sksqwjsksqwjsksq.webp',
        newThumbnail: '/images/products/yee/YEE Ultra-Clear Glass Tank/yee_tank_60x30cm.webp',
        newImages: [
            '/images/products/yee/YEE Ultra-Clear Glass Tank/yee_tank_60x30cm.webp',
            '/images/products/yee/YEE Ultra-Clear Glass Tank/main.webp'
        ]
    },
    {
        // UK plug adapter - use a generic placeholder or generate
        id: 'yee-uk-plug-adapter',
        oldThumbnail: '/images/products/yee/uk-plug-adapter/main.webp',
        // We need to add an image for this - for now use a placeholder
        newThumbnail: '/images/placeholder-product.webp',
        newImages: [
            '/images/placeholder-product.webp'
        ],
        needsImage: true
    }
];

async function fixBrokenImages() {
    console.log('=== إصلاح مسارات الصور ===\n');

    for (const fix of fixes) {
        console.log(`\nإصلاح: ${fix.id}`);
        console.log(`  من: ${fix.oldThumbnail}`);
        console.log(`  إلى: ${fix.newThumbnail}`);

        if (fix.needsImage) {
            console.log(`  ⚠️ هذا المنتج يحتاج صورة جديدة!`);
        }

        try {
            await sql`
        UPDATE products 
        SET 
          thumbnail = ${fix.newThumbnail},
          images = ${JSON.stringify(fix.newImages)}::jsonb,
          updated_at = NOW()
        WHERE id = ${fix.id}
      `;
            console.log(`  ✓ تم التحديث`);
        } catch (error) {
            console.error(`  ✗ خطأ: ${error}`);
        }
    }

    console.log('\n=== تم الانتهاء ===');
    console.log(`تم إصلاح ${fixes.length} منتجات`);
    console.log('\n⚠️ ملاحظة: محول UK يحتاج صورة حقيقية!');
}

fixBrokenImages().catch(console.error);
