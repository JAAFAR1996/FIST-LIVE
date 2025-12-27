/**
 * check-products.ts
 * Quick script to check current products in database
 */

import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not found");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function checkProducts() {
  console.log("📊 Checking current products in database...\n");

  // Get counts by category
  const categoryCounts = await sql`
        SELECT category, COUNT(*) as total 
        FROM products 
        WHERE deleted_at IS NULL 
        GROUP BY category 
        ORDER BY total DESC
    `;

  console.log("📦 Products by Category:");
  console.log("─".repeat(40));
  let total = 0;
  for (const row of categoryCounts) {
    console.log(`  ${row.category}: ${row.total}`);
    total += parseInt(row.total);
  }
  console.log("─".repeat(40));
  console.log(`  📊 Total: ${total} products\n`);

  // Get sample products
  const samples = await sql`
        SELECT id, name, category, price, stock 
        FROM products 
        WHERE deleted_at IS NULL 
        LIMIT 5
    `;

  console.log("🔍 Sample Products:");
  for (const p of samples) {
    console.log(`  - ${p.name} (${p.category}) - ${p.price} IQD`);
  }
}

checkProducts().catch(console.error);
