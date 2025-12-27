/**
 * Check HYGGER product names in Neon database
 */
import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const sql = neon(process.env.DATABASE_URL);

async function checkProductNames() {
  try {
    console.log('🔍 فحص أسماء منتجات HYGGER في قاعدة البيانات...\n');

    // البحث عن منتجات تحتوي على "هيغر"
    const oldNames = await sql`
      SELECT id, name, brand
      FROM products
      WHERE name LIKE '%هيغر%'
      ORDER BY name
    `;

    console.log(`📊 منتجات تحتوي على "هيغر": ${oldNames.length}`);
    if (oldNames.length > 0) {
      console.log('\n❌ تحتاج للتحديث:');
      oldNames.slice(0, 5).forEach((p, i) => {
        console.log(`${i + 1}. ${p.name}`);
      });
      if (oldNames.length > 5) {
        console.log(`   ... و ${oldNames.length - 5} منتج آخر`);
      }
    }

    // البحث عن منتجات HYGGER بالاسم الصحيح
    const hyggerProducts = await sql`
      SELECT id, name, brand
      FROM products
      WHERE brand = 'HYGGER' OR name LIKE '%HYGGER%'
      ORDER BY name
    `;

    console.log(`\n✅ منتجات HYGGER (بالاسم الصحيح): ${hyggerProducts.length}`);
    if (hyggerProducts.length > 0) {
      console.log('\nأمثلة:');
      hyggerProducts.slice(0, 5).forEach((p, i) => {
        console.log(`${i + 1}. ${p.name}`);
      });
      if (hyggerProducts.length > 5) {
        console.log(`   ... و ${hyggerProducts.length - 5} منتج آخر`);
      }
    }

    // إحصائيات إجمالية
    const total = await sql`SELECT COUNT(*) as count FROM products`;
    console.log(`\n📈 إجمالي المنتجات في القاعدة: ${total[0].count}`);

  } catch (error) {
    console.error('❌ خطأ:', error.message);
  }
}

checkProductNames();
