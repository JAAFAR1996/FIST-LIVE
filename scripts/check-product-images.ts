import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.production' });

const sql = neon(process.env.DATABASE_URL!);

async function checkProductImages() {
    console.log('=== فحص صور المنتجات ===\n');

    // 1. إحصائيات الصور حسب الماركة (using thumbnail and images columns)
    console.log('--- إحصائيات الصور حسب الماركة ---');
    const brandStats = await sql`
    SELECT 
      brand, 
      COUNT(*) as total,
      COUNT(CASE WHEN thumbnail IS NOT NULL AND thumbnail != '' THEN 1 END) as with_thumbnail,
      COUNT(CASE WHEN thumbnail IS NULL OR thumbnail = '' THEN 1 END) as without_thumbnail,
      COUNT(CASE WHEN jsonb_array_length(images) > 0 THEN 1 END) as with_images_array
    FROM products 
    GROUP BY brand
    ORDER BY total DESC
  `;
    console.table(brandStats);

    // 2. منتجات YEE و Hygger بدون صور
    console.log('\n--- منتجات YEE و Hygger بدون صورة رئيسية ---');
    const productsWithoutImages = await sql`
    SELECT id, name, brand, thumbnail, slug
    FROM products 
    WHERE (brand ILIKE '%yee%' OR brand ILIKE '%hygger%')
      AND (thumbnail IS NULL OR thumbnail = '')
    ORDER BY brand, name
  `;
    console.log(`عدد المنتجات بدون thumbnail: ${productsWithoutImages.length}`);
    console.table(productsWithoutImages);

    // 3. منتجات YEE و Hygger مع صورهم
    console.log('\n--- منتجات YEE و Hygger مع صورة رئيسية ---');
    const productsWithImages = await sql`
    SELECT id, name, brand, thumbnail, jsonb_array_length(images) as images_count
    FROM products 
    WHERE (brand ILIKE '%yee%' OR brand ILIKE '%hygger%')
      AND thumbnail IS NOT NULL AND thumbnail != ''
    ORDER BY brand, name
  `;
    console.log(`عدد المنتجات مع thumbnail: ${productsWithImages.length}`);
    console.table(productsWithImages);

    // 4. فحص نوع الصور المخزنة
    console.log('\n--- أنواع روابط الصور المستخدمة ---');
    const imageTypes = await sql`
    SELECT 
      CASE 
        WHEN thumbnail LIKE '%cloudflare%' THEN 'Cloudflare R2'
        WHEN thumbnail LIKE '%r2.dev%' THEN 'Cloudflare R2'
        WHEN thumbnail LIKE '%supabase%' THEN 'Supabase'
        WHEN thumbnail LIKE '%placeholder%' THEN 'Placeholder'
        WHEN thumbnail LIKE '/attached_assets%' THEN 'Local Assets'
        WHEN thumbnail LIKE 'https://%' THEN 'External URL'
        WHEN thumbnail IS NULL OR thumbnail = '' THEN 'No Image'
        ELSE 'Other'
      END as image_source,
      COUNT(*) as count
    FROM products
    GROUP BY 
      CASE 
        WHEN thumbnail LIKE '%cloudflare%' THEN 'Cloudflare R2'
        WHEN thumbnail LIKE '%r2.dev%' THEN 'Cloudflare R2'
        WHEN thumbnail LIKE '%supabase%' THEN 'Supabase'
        WHEN thumbnail LIKE '%placeholder%' THEN 'Placeholder'
        WHEN thumbnail LIKE '/attached_assets%' THEN 'Local Assets'
        WHEN thumbnail LIKE 'https://%' THEN 'External URL'
        WHEN thumbnail IS NULL OR thumbnail = '' THEN 'No Image'
        ELSE 'Other'
      END
    ORDER BY count DESC
  `;
    console.table(imageTypes);

    // 5. عرض أمثلة على صور YEE
    console.log('\n--- أمثلة على صور منتجات YEE ---');
    const yeeExamples = await sql`
    SELECT id, name, thumbnail, images
    FROM products 
    WHERE brand ILIKE '%yee%'
    LIMIT 5
  `;
    yeeExamples.forEach((p: any) => {
        console.log(`\n${p.name}:`);
        console.log(`  Thumbnail: ${p.thumbnail}`);
        console.log(`  Images: ${JSON.stringify(p.images)}`);
    });
}

checkProductImages().catch(console.error);
