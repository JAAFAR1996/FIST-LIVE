const { neon } = require('@neondatabase/serverless');

const DATABASE_URL = 'postgresql://neondb_owner:npg_N7dEzt2pWjCi@ep-quiet-moon-a4h7tdze-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
const sql = neon(DATABASE_URL);

(async () => {
  try {
    // جلب جميع الطلبات
    const orders = await sql`SELECT id, order_number, items, total, status, created_at FROM orders ORDER BY created_at DESC`;

    console.log('=== تحليل الطلبات (' + orders.length + ' طلب) ===\n');

    for (const order of orders) {
      console.log('📦 طلب: ' + order.order_number);
      console.log('   الحالة: ' + order.status);
      console.log('   المجموع: ' + order.total + ' د.ع');

      let items = order.items;
      if (typeof items === 'string') {
        try { items = JSON.parse(items); } catch(e) { items = []; }
      }

      if (items && items.length > 0) {
        console.log('   العناصر: ' + items.length + ' منتج');
      } else {
        console.log('   ⚠️ لا توجد عناصر!');
      }
      console.log('');
    }

    // التحقق من order_items_relational
    const orderItems = await sql`SELECT COUNT(*) as count FROM order_items_relational`;
    console.log('=== جدول order_items_relational ===');
    console.log('عدد السجلات: ' + orderItems[0].count);

    if (parseInt(orderItems[0].count) === 0) {
      console.log('\n⚠️ الجدول فارغ - سأقوم بملئه من الطلبات الموجودة...');

      let inserted = 0;
      for (const order of orders) {
        let items = order.items;
        if (typeof items === 'string') {
          try { items = JSON.parse(items); } catch(e) { items = []; }
        }

        if (items && items.length > 0) {
          for (const item of items) {
            try {
              const product = await sql`SELECT id, name FROM products WHERE id = ${item.productId} LIMIT 1`;
              if (product.length > 0) {
                const quantity = parseInt(item.quantity) || 1;
                const price = parseFloat(item.priceAtPurchase) || 0;
                const totalPrice = quantity * price;

                await sql`
                  INSERT INTO order_items_relational (order_id, product_id, quantity, price_at_purchase, total_price)
                  VALUES (${order.id}, ${item.productId}, ${quantity}, ${price}, ${totalPrice})
                `;
                inserted++;
                console.log('   ✅ أضفت: ' + product[0].name);
              } else {
                console.log('   ⚠️ منتج غير موجود: ' + item.productId);
              }
            } catch (e) {
              console.log('   خطأ: ' + e.message);
            }
          }
        }
      }

      console.log('\n✅ تم إدخال ' + inserted + ' عنصر في order_items_relational');
    } else {
      console.log('✅ الجدول يحتوي على بيانات بالفعل');
    }

    // التحقق من جدول payments
    const payments = await sql`SELECT COUNT(*) as count FROM payments`;
    console.log('\n=== جدول payments ===');
    console.log('عدد السجلات: ' + payments[0].count);

    if (parseInt(payments[0].count) === 0) {
      console.log('⚠️ جدول المدفوعات فارغ - سأقوم بإنشاء سجلات للطلبات الموجودة...');

      let paymentInserted = 0;
      for (const order of orders) {
        try {
          await sql`
            INSERT INTO payments (order_id, amount, currency, method, status)
            VALUES (${order.id}, ${order.total}, 'IQD', 'cash_on_delivery', 'pending')
          `;
          paymentInserted++;
        } catch (e) {
          // قد يكون موجود بالفعل
        }
      }
      console.log('✅ تم إنشاء ' + paymentInserted + ' سجل دفع');
    }

    console.log('\n✅ اكتمل الفحص والإصلاح!');

  } catch (error) {
    console.error('خطأ:', error.message);
  }
})();
