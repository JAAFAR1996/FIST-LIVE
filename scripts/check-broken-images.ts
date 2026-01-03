import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.production' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sql = neon(process.env.DATABASE_URL!);
const PUBLIC_DIR = path.join(__dirname, '..', 'client', 'public');

async function checkBrokenImages() {
    console.log('=== فحص الصور المكسورة ===\n');

    // Get all products with their images
    const products = await sql`
    SELECT id, name, brand, thumbnail, images, slug
    FROM products 
    WHERE brand IN ('YEE', 'HYGGER', 'HOUYI')
    ORDER BY brand, name
  `;

    const brokenProducts: any[] = [];
    const workingProducts: any[] = [];

    for (const product of products) {
        const thumbnail = product.thumbnail as string;

        if (!thumbnail) {
            brokenProducts.push({
                id: product.id,
                name: product.name,
                brand: product.brand,
                issue: 'No thumbnail path',
                thumbnail: null,
                slug: product.slug
            });
            continue;
        }

        // Clean the path (remove URL encoding and leading slash)
        const decodedPath = decodeURIComponent(thumbnail);
        const fullPath = path.join(PUBLIC_DIR, decodedPath);

        // Check if file exists
        if (!fs.existsSync(fullPath)) {
            brokenProducts.push({
                id: product.id,
                name: product.name,
                brand: product.brand,
                issue: 'File not found',
                thumbnail: decodedPath,
                expectedPath: fullPath,
                slug: product.slug
            });
        } else {
            workingProducts.push({
                id: product.id,
                name: product.name,
                brand: product.brand,
                thumbnail: decodedPath
            });
        }
    }

    console.log(`\n=== ملخص ===`);
    console.log(`إجمالي المنتجات: ${products.length}`);
    console.log(`صور تعمل: ${workingProducts.length}`);
    console.log(`صور مكسورة: ${brokenProducts.length}`);

    if (brokenProducts.length > 0) {
        console.log(`\n=== المنتجات ذات الصور المكسورة (${brokenProducts.length}) ===\n`);

        // Group by brand
        const byBrand: Record<string, any[]> = {};
        for (const p of brokenProducts) {
            if (!byBrand[p.brand]) byBrand[p.brand] = [];
            byBrand[p.brand].push(p);
        }

        for (const [brand, products] of Object.entries(byBrand)) {
            console.log(`\n--- ${brand} (${products.length} broken) ---`);
            for (const p of products) {
                console.log(`\n• ${p.name}`);
                console.log(`  ID: ${p.id}`);
                console.log(`  Slug: ${p.slug}`);
                console.log(`  Issue: ${p.issue}`);
                console.log(`  Path: ${p.thumbnail}`);
            }
        }
    }

    // Also show some working examples for comparison
    if (workingProducts.length > 0) {
        console.log(`\n\n=== أمثلة على صور تعمل (أول 5) ===\n`);
        for (const p of workingProducts.slice(0, 5)) {
            console.log(`✓ ${p.name}`);
            console.log(`  Path: ${p.thumbnail}\n`);
        }
    }

    // List available folders in yee directory
    console.log(`\n\n=== المجلدات المتاحة في yee ===\n`);
    const yeeDir = path.join(PUBLIC_DIR, 'images', 'products', 'yee');
    if (fs.existsSync(yeeDir)) {
        const folders = fs.readdirSync(yeeDir).filter(f =>
            fs.statSync(path.join(yeeDir, f)).isDirectory()
        );
        console.log(`عدد المجلدات: ${folders.length}`);
        folders.forEach(f => console.log(`  - ${f}`));
    }
}

checkBrokenImages().catch(console.error);
