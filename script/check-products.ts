/**
 * Script to check products status for deals page
 */

import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('❌ DATABASE_URL not found');
    process.exit(1);
}

async function checkProducts() {
    const sql = neon(connectionString!);

    console.log('📊 Checking products status...\n');

    // Check total products
    const totalResult = await sql`
    SELECT COUNT(*) as count FROM products WHERE deleted_at IS NULL
  `;
    console.log(`📦 Total active products: ${totalResult[0]?.count}\n`);

    // Check products with deals (originalPrice > price)
    const dealsResult = await sql`
    SELECT id, name, price, original_price,
           ROUND(((CAST(original_price AS numeric) - CAST(price AS numeric)) / CAST(original_price AS numeric)) * 100) as discount
    FROM products 
    WHERE original_price IS NOT NULL 
      AND CAST(original_price AS numeric) > CAST(price AS numeric)
      AND deleted_at IS NULL
    ORDER BY discount DESC
    LIMIT 10
  `;

    console.log(`🎯 Products with discounts (originalPrice > price): ${dealsResult.length}\n`);

    if (dealsResult.length > 0) {
        console.log('Sample deals:');
        dealsResult.forEach((p: any) => {
            console.log(`  - ${p.name}: ${p.discount}% off (${p.price} -> ${p.original_price})`);
        });
    } else {
        // Check if originalPrice equals price
        const equalResult = await sql`
      SELECT COUNT(*) as count FROM products 
      WHERE original_price IS NOT NULL 
        AND CAST(original_price AS numeric) = CAST(price AS numeric)
        AND deleted_at IS NULL
    `;
        console.log(`⚠️ Products where originalPrice = price: ${equalResult[0]?.count}`);

        // Show sample
        const sampleResult = await sql`
      SELECT name, price, original_price FROM products 
      WHERE deleted_at IS NULL
      LIMIT 5
    `;
        console.log('\nSample products:');
        sampleResult.forEach((p: any) => {
            console.log(`  - ${p.name}: price=${p.price}, original=${p.original_price}`);
        });
    }
}

checkProducts();
