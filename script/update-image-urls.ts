/**
 * Update Database Image URLs from .png to .webp
 * Run after optimize-images.ts
 */

import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.production' });

const sql = neon(process.env.DATABASE_URL!);

async function updateImageUrls() {
    console.log('🔄 Updating database image URLs from .png to .webp...\n');

    try {
        // Update products table - main images (column is 'images' not 'image')
        const productsResult = await sql`
      UPDATE products 
      SET 
        images = REPLACE(images::text, '.png', '.webp')::jsonb,
        thumbnail = REPLACE(thumbnail, '.png', '.webp')
      WHERE 
        (images::text LIKE '%/yee/%' AND images::text LIKE '%.png')
        OR (thumbnail LIKE '%/yee/%' AND thumbnail LIKE '%.png')
      RETURNING id, name, thumbnail
    `;

        console.log(`✅ Updated ${productsResult.length} products main images`);

        // Update product_images table
        const imagesResult = await sql`
      UPDATE product_images 
      SET url = REPLACE(url, '.png', '.webp')
      WHERE 
        url LIKE '%/yee/%' 
        AND url LIKE '%.png'
      RETURNING id, url
    `;

        console.log(`✅ Updated ${imagesResult.length} product gallery images`);

        // Summary
        console.log('\n📊 SUMMARY');
        console.log('='.repeat(40));
        console.log(`Products updated: ${productsResult.length}`);
        console.log(`Gallery images updated: ${imagesResult.length}`);

        // Show some examples
        if (productsResult.length > 0) {
            console.log('\n📦 Sample updated products:');
            productsResult.slice(0, 5).forEach((p: any) => {
                console.log(`  - ${p.name}: ${p.image}`);
            });
        }

    } catch (error) {
        console.error('❌ Error updating database:', error);
        process.exit(1);
    }
}

updateImageUrls();
