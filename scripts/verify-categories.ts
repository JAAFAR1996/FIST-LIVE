import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

async function verifyCategories() {
  const results = await sql`
    SELECT
      category,
      subcategory,
      COUNT(*) as count
    FROM products
    WHERE deleted_at IS NULL
    GROUP BY category, subcategory
    ORDER BY category, subcategory
  `;

  let currentCat = '';
  let catTotal = 0;

  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║          الهيكل النهائي للفئات (بالعربية)                    ║');
  console.log('╠══════════════════════════════════════════════════════════════╣');

  for (const row of results) {
    if (row.category !== currentCat) {
      if (currentCat) {
        console.log(`║   └── إجمالي: ${catTotal} منتج`);
        console.log('╟──────────────────────────────────────────────────────────────╢');
      }
      currentCat = row.category;
      catTotal = 0;
      console.log(`║ 📁 ${row.category}`);
    }
    catTotal += parseInt(row.count as string);
    console.log(`║   ├── ${row.subcategory || 'بدون فئة فرعية'} (${row.count})`);
  }
  console.log(`║   └── إجمالي: ${catTotal} منتج`);
  console.log('╚══════════════════════════════════════════════════════════════╝');

  // Total count
  const total = await sql`SELECT COUNT(*) as total FROM products WHERE deleted_at IS NULL`;
  console.log(`\n📊 إجمالي المنتجات: ${total[0].total}`);

  // Category summary
  const summary = await sql`
    SELECT category, COUNT(*) as count
    FROM products
    WHERE deleted_at IS NULL
    GROUP BY category
    ORDER BY count DESC
  `;

  console.log('\n📋 ملخص الفئات:');
  console.log('─'.repeat(40));
  for (const cat of summary) {
    console.log(`  ${cat.category}: ${cat.count} منتج`);
  }
}

verifyCategories().catch(console.error);
