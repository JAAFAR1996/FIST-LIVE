/**
 * Script to add originalPrice to products for deals page
 * This adds a 15% markup as the original price (making current price a 13% discount)
 */

import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('❌ DATABASE_URL not found in environment');
    process.exit(1);
}

async function addOriginalPrices() {
    const sql = neon(connectionString!);

    console.log('🚀 Adding originalPrice to products...\n');

    try {
        // Count products without originalPrice
        const countResult = await sql`
      SELECT COUNT(*) as count FROM products 
      WHERE original_price IS NULL AND deleted_at IS NULL
    `;
        const count = countResult[0]?.count || 0;
        console.log(`📦 Found ${count} products without originalPrice\n`);

        if (count === 0) {
            console.log('✅ All products already have originalPrice set!');
            return;
        }

        // Update products: set originalPrice to 15% more than current price
        const updateResult = await sql`
      UPDATE products 
      SET original_price = ROUND(CAST(price AS numeric) * 1.15)
      WHERE original_price IS NULL 
        AND deleted_at IS NULL
      RETURNING id, name, price, original_price
    `;

        console.log(`✅ Updated ${updateResult.length} products:\n`);

        // Show sample of updated products
        updateResult.slice(0, 5).forEach((product: any) => {
            const discount = Math.round(((product.original_price - product.price) / product.original_price) * 100);
            console.log(`  📌 ${product.name}`);
            console.log(`     السعر: ${Number(product.price).toLocaleString()} د.ع`);
            console.log(`     السعر الأصلي: ${Number(product.original_price).toLocaleString()} د.ع`);
            console.log(`     الخصم: ${discount}%\n`);
        });

        if (updateResult.length > 5) {
            console.log(`  ... و ${updateResult.length - 5} منتجات أخرى\n`);
        }

        console.log('🎉 Done! Products will now appear in the deals page.');

    } catch (error) {
        console.error('❌ Error updating products:', error);
        process.exit(1);
    }
}

addOriginalPrices();
