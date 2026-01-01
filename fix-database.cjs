const { neon } = require('@neondatabase/serverless');

const DATABASE_URL = 'postgresql://neondb_owner:npg_N7dEzt2pWjCi@ep-quiet-moon-a4h7tdze-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const sql = neon(DATABASE_URL);

(async () => {
  try {
    console.log('🔧 بدء إصلاح قاعدة البيانات...\n');

    // 1. فحص المنتجات الحالية
    console.log('=== 1. فحص المنتجات ===');
    const products = await sql`SELECT id, slug, name, category, category_id FROM products`;
    console.log('إجمالي المنتجات: ' + products.length);

    // إنشاء خريطة للبحث السريع
    const productsBySlug = {};
    const productsByName = {};
    products.forEach(p => {
      productsBySlug[p.slug] = p;
      productsByName[p.name.toLowerCase()] = p;
    });

    // 2. إنشاء/تحديث التصنيفات المطلوبة
    console.log('\n=== 2. تحديث التصنيفات ===');

    // التصنيفات المستخدمة فعلياً في المنتجات
    const usedCategories = await sql`SELECT DISTINCT category FROM products WHERE category IS NOT NULL`;
    const usedCategoryNames = usedCategories.map(c => c.category);
    console.log('التصنيفات المستخدمة: ' + usedCategoryNames.length);

    // إنشاء أو تحديث كل تصنيف مستخدم
    for (const categoryName of usedCategoryNames) {
      const existing = await sql`SELECT id FROM categories WHERE name = ${categoryName} OR display_name = ${categoryName} LIMIT 1`;

      if (existing.length === 0) {
        // إنشاء تصنيف جديد
        await sql`INSERT INTO categories (name, display_name, is_active) VALUES (${categoryName}, ${categoryName}, true)`;
        console.log('  ✅ أنشئ: ' + categoryName);
      }
    }

    // 3. ربط المنتجات بالتصنيفات (category_id)
    console.log('\n=== 3. ربط المنتجات بالتصنيفات ===');

    // أولاً، إزالة أي category_id يشير لتصنيفات غير موجودة
    await sql`UPDATE products SET category_id = NULL WHERE category_id IS NOT NULL AND category_id NOT IN (SELECT id FROM categories)`;

    const productsToLink = await sql`SELECT id, name, category FROM products WHERE category_id IS NULL AND category IS NOT NULL`;
    console.log('منتجات تحتاج ربط: ' + productsToLink.length);

    let linked = 0;
    for (const p of productsToLink) {
      const matchingCategory = await sql`SELECT id FROM categories WHERE name = ${p.category} OR display_name = ${p.category} LIMIT 1`;
      if (matchingCategory.length > 0) {
        await sql`UPDATE products SET category_id = ${matchingCategory[0].id} WHERE id = ${p.id}`;
        linked++;
      }
    }
    console.log('✅ تم ربط: ' + linked + ' منتج');

    // 4. حذف التصنيفات غير المستخدمة (بعد إزالة الروابط)
    console.log('\n=== 4. تنظيف التصنيفات القديمة ===');
    const allCategories = await sql`SELECT * FROM categories`;

    for (const cat of allCategories) {
      // التحقق من عدم استخدام التصنيف
      const linkedProducts = await sql`SELECT COUNT(*) as count FROM products WHERE category_id = ${cat.id}`;
      const usedInCategory = usedCategoryNames.includes(cat.name) || usedCategoryNames.includes(cat.display_name);

      if (parseInt(linkedProducts[0].count) === 0 && !usedInCategory) {
        await sql`DELETE FROM categories WHERE id = ${cat.id}`;
        console.log('  🗑️ حذف: ' + cat.name);
      }
    }

    // 5. إصلاح جدول order_items من الطلبات القديمة
    console.log('\n=== 5. ربط عناصر الطلبات ===');
    const orders = await sql`SELECT id, order_number, items FROM orders`;

    let linkedItems = 0;
    let unlinkedItems = 0;

    for (const order of orders) {
      let items = order.items;
      if (typeof items === 'string') {
        try { items = JSON.parse(items); } catch(e) { items = []; }
      }

      if (items && items.length > 0) {
        for (const item of items) {
          let product = null;

          // البحث بالـ slug
          if (item.slug && productsBySlug[item.slug]) {
            product = productsBySlug[item.slug];
          }
          // البحث بالـ id كـ slug
          else if (item.id && productsBySlug[item.id]) {
            product = productsBySlug[item.id];
          }
          // البحث بالاسم
          else if (item.name && productsByName[item.name.toLowerCase()]) {
            product = productsByName[item.name.toLowerCase()];
          }

          if (product) {
            const existing = await sql`SELECT id FROM order_items_relational WHERE order_id = ${order.id} AND product_id = ${product.id}`;
            if (existing.length === 0) {
              const quantity = parseInt(item.quantity) || 1;
              const price = parseFloat(item.price || item.priceAtPurchase) || 0;
              const totalPrice = quantity * price;

              await sql`
                INSERT INTO order_items_relational (order_id, product_id, quantity, price_at_purchase, total_price)
                VALUES (${order.id}, ${product.id}, ${quantity}, ${price}, ${totalPrice})
              `;
              linkedItems++;
            }
          } else {
            unlinkedItems++;
          }
        }
      }
    }

    console.log('  ✅ عناصر تم ربطها: ' + linkedItems);
    console.log('  ⚠️ عناصر غير موجودة: ' + unlinkedItems);

    // 6. التحقق النهائي
    console.log('\n=== 6. التحقق النهائي ===');

    const finalProducts = await sql`SELECT COUNT(*) as count FROM products`;
    const finalCategories = await sql`SELECT COUNT(*) as count FROM categories`;
    const finalLinked = await sql`SELECT COUNT(*) as count FROM products WHERE category_id IS NOT NULL`;
    const finalOrders = await sql`SELECT COUNT(*) as count FROM orders`;
    const finalOrderItems = await sql`SELECT COUNT(*) as count FROM order_items_relational`;
    const finalPayments = await sql`SELECT COUNT(*) as count FROM payments`;

    console.log('📦 المنتجات: ' + finalProducts[0].count);
    console.log('📁 التصنيفات: ' + finalCategories[0].count);
    console.log('🔗 منتجات مربوطة: ' + finalLinked[0].count + '/' + finalProducts[0].count);
    console.log('🛒 الطلبات: ' + finalOrders[0].count);
    console.log('📋 عناصر الطلبات: ' + finalOrderItems[0].count);
    console.log('💳 المدفوعات: ' + finalPayments[0].count);

    // عرض التصنيفات النهائية
    console.log('\n=== التصنيفات النهائية ===');
    const cats = await sql`SELECT c.name, c.display_name, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id
      GROUP BY c.id, c.name, c.display_name
      ORDER BY product_count DESC`;

    cats.forEach(c => {
      console.log('  - ' + c.display_name + ': ' + c.product_count + ' منتج');
    });

    console.log('\n✅ اكتمل إصلاح قاعدة البيانات!');

  } catch (error) {
    console.error('❌ خطأ:', error.message);
    console.error(error.stack);
  }
})();
