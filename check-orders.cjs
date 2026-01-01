const { neon } = require('@neondatabase/serverless');

const DATABASE_URL = 'postgresql://neondb_owner:npg_N7dEzt2pWjCi@ep-quiet-moon-a4h7tdze-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const sql = neon(DATABASE_URL);

(async () => {
  try {
    // فحص الطلبات
    const orders = await sql`SELECT id, order_number, items, total, status FROM orders`;

    console.log('=== تفاصيل الطلبات القديمة ===\n');

    let problematicOrders = [];

    for (const order of orders) {
      let items = order.items;
      if (typeof items === 'string') {
        try { items = JSON.parse(items); } catch(e) { items = []; }
      }

      let hasIssue = false;
      if (!order.order_number) hasIssue = true;

      if (items) {
        for (const item of items) {
          if (!item.productId || item.productId === 'undefined') {
            hasIssue = true;
          }
        }
      }

      if (hasIssue) {
        problematicOrders.push(order);
        console.log('⚠️ طلب به مشكلة:');
        console.log('   ID: ' + order.id);
        console.log('   Order Number: ' + (order.order_number || 'NULL'));
        console.log('   Status: ' + order.status);
        console.log('   Total: ' + order.total);
        console.log('   Items: ' + JSON.stringify(items));
        console.log('');
      }
    }

    console.log('\n📊 الملخص:');
    console.log('- إجمالي الطلبات: ' + orders.length);
    console.log('- طلبات بها مشاكل: ' + problematicOrders.length);
    console.log('- طلبات سليمة: ' + (orders.length - problematicOrders.length));

    // إصلاح الطلبات بدون رقم
    console.log('\n=== إصلاح الطلبات ===');

    for (const order of orders) {
      if (!order.order_number) {
        const newOrderNumber = 'ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        await sql`UPDATE orders SET order_number = ${newOrderNumber} WHERE id = ${order.id}`;
        console.log('✅ تم إضافة رقم للطلب: ' + order.id + ' -> ' + newOrderNumber);
      }
    }

    // التحقق من التصنيفات
    console.log('\n=== التحقق من التصنيفات ===');
    const categories = await sql`SELECT * FROM categories ORDER BY sort_order`;
    console.log('عدد التصنيفات: ' + categories.length);
    categories.forEach(c => {
      console.log('- ' + c.name + ' (' + c.display_name + ')' + (c.parent_id ? ' [فرعي من: ' + c.parent_id + ']' : ' [رئيسي]'));
    });

    // التحقق من ربط المنتجات بالتصنيفات
    console.log('\n=== التحقق من ربط المنتجات بالتصنيفات ===');
    const productsWithoutCategory = await sql`SELECT COUNT(*) as count FROM products WHERE category IS NULL OR category = ''`;
    console.log('منتجات بدون تصنيف: ' + productsWithoutCategory[0].count);

    const productsWithCategoryId = await sql`SELECT COUNT(*) as count FROM products WHERE category_id IS NOT NULL`;
    console.log('منتجات مربوطة بـ category_id: ' + productsWithCategoryId[0].count);

    console.log('\n✅ اكتمل الفحص!');

  } catch (error) {
    console.error('خطأ:', error.message);
  }
})();
