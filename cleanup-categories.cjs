const { neon } = require('@neondatabase/serverless');

const DATABASE_URL = 'postgresql://neondb_owner:npg_N7dEzt2pWjCi@ep-quiet-moon-a4h7tdze-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const sql = neon(DATABASE_URL);

// خريطة دمج التصنيفات (الإنجليزي -> العربي)
const categoryMergeMap = {
  'accessories': 'ملحقات ومستلزمات',
  'filtration': 'الفلترة والتنقية',
  'filters': 'الفلترة والتنقية',
  'maintenance': 'الصيانة والتنظيف',
  'substrate': 'التربة والديكور',
  'decoration': 'التربة والديكور',
  'water-treatment': 'معالجة المياه',
  'monitoring': 'الفحص والمراقبة',
  'heating': 'التحكم بالحرارة',
  'heaters': 'التحكم بالحرارة',
  'lighting': 'الإضاءة',
  'breeding': 'التفريخ والعزل',
  'fish-food': 'طعام الأسماك'
};

(async () => {
  try {
    console.log('🧹 بدء تنظيف التصنيفات...\n');

    // 1. جلب جميع التصنيفات
    const categories = await sql`SELECT * FROM categories`;
    console.log('التصنيفات الحالية: ' + categories.length);

    // إنشاء خريطة للتصنيفات
    const categoryByName = {};
    categories.forEach(c => {
      categoryByName[c.name] = c;
      categoryByName[c.display_name] = c;
    });

    // 2. دمج التصنيفات
    console.log('\n=== دمج التصنيفات ===');

    for (const [englishName, arabicName] of Object.entries(categoryMergeMap)) {
      const englishCat = categoryByName[englishName];
      const arabicCat = categoryByName[arabicName];

      if (englishCat && arabicCat && englishCat.id !== arabicCat.id) {
        // نقل المنتجات من التصنيف الإنجليزي للعربي
        await sql`UPDATE products SET category_id = ${arabicCat.id} WHERE category_id = ${englishCat.id}`;
        await sql`UPDATE products SET category = ${arabicName} WHERE category = ${englishName}`;
        await sql`DELETE FROM categories WHERE id = ${englishCat.id}`;
        console.log('  ✅ دمج: ' + englishName + ' -> ' + arabicName);
      } else if (englishCat && !arabicCat) {
        // تحديث التصنيف الإنجليزي ليصبح عربي
        await sql`UPDATE categories SET display_name = ${arabicName} WHERE id = ${englishCat.id}`;
        await sql`UPDATE products SET category = ${arabicName} WHERE category = ${englishName}`;
        console.log('  ✅ تحديث: ' + englishName + ' -> ' + arabicName);
      }
    }

    // 3. حذف التصنيفات الفارغة
    console.log('\n=== حذف التصنيفات الفارغة ===');
    const emptyCategories = await sql`
      SELECT c.id, c.name, c.display_name
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id
      GROUP BY c.id, c.name, c.display_name
      HAVING COUNT(p.id) = 0`;

    for (const cat of emptyCategories) {
      // التحقق من أن التصنيف غير مستخدم في عمود category أيضاً
      const usedInCategoryColumn = await sql`SELECT COUNT(*) as count FROM products WHERE category = ${cat.name} OR category = ${cat.display_name}`;
      if (parseInt(usedInCategoryColumn[0].count) === 0) {
        await sql`DELETE FROM categories WHERE id = ${cat.id}`;
        console.log('  🗑️ حذف: ' + cat.display_name);
      }
    }

    // 4. التحقق النهائي
    console.log('\n=== التصنيفات النهائية ===');
    const finalCategories = await sql`
      SELECT c.display_name, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id
      GROUP BY c.id, c.display_name
      ORDER BY product_count DESC`;

    console.log('عدد التصنيفات: ' + finalCategories.length);
    let total = 0;
    finalCategories.forEach(c => {
      console.log('  - ' + c.display_name + ': ' + c.product_count + ' منتج');
      total += parseInt(c.product_count);
    });
    console.log('  المجموع: ' + total + ' منتج');

    console.log('\n✅ اكتمل تنظيف التصنيفات!');

  } catch (error) {
    console.error('❌ خطأ:', error.message);
  }
})();
