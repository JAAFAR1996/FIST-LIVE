/**
 * Update Database Image URLs from .png/.jpg to .webp
 * Run after optimize-images.ts
 */

import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.production' });

const sql = neon(process.env.DATABASE_URL!);

async function updateImageUrls() {
  console.log('🔄 Updating database image URLs to .webp...\\n');

  try {
    // Update products table - PNG files
    const pngResult = await sql`
      UPDATE products 
      SET 
        images = REPLACE(images::text, '.png', '.webp')::jsonb,
        thumbnail = REPLACE(thumbnail, '.png', '.webp')
      WHERE 
        (images::text LIKE '%/yee/%' AND images::text LIKE '%.png')
        OR (thumbnail LIKE '%/yee/%' AND thumbnail LIKE '%.png')
      RETURNING id, name
    `;

    console.log(`✅ Updated ${pngResult.length} products (.png → .webp)`);

    // Update products table - JPG files
    const jpgResult = await sql`
      UPDATE products 
      SET 
        images = REPLACE(images::text, '.jpg', '.webp')::jsonb,
        thumbnail = REPLACE(thumbnail, '.jpg', '.webp')
      WHERE 
        (images::text LIKE '%/yee/%' AND images::text LIKE '%.jpg')
        OR (thumbnail LIKE '%/yee/%' AND thumbnail LIKE '%.jpg')
      RETURNING id, name
    `;

    console.log(`✅ Updated ${jpgResult.length} products (.jpg → .webp)`);

    // Summary
    console.log('\\n📊 SUMMARY');
    console.log('='.repeat(40));
    console.log(`PNG products updated: ${pngResult.length}`);
    console.log(`JPG products updated: ${jpgResult.length}`);
    console.log(`Total: ${pngResult.length + jpgResult.length}`);

  } catch (error) {
    console.error('❌ Error updating database:', error);
    process.exit(1);
  }
}

updateImageUrls();

