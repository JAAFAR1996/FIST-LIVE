import { neon } from "@neondatabase/serverless";

async function checkDatabase() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("❌ DATABASE_URL غير موجود في متغيرات البيئة");
    process.exit(1);
  }

  const sql = neon(databaseUrl);

  try {
    console.log("\n🔍 فحص قاعدة البيانات\n");
    console.log("═".repeat(60));

    // 1. Check Products
    console.log("\n📦 المنتجات:");
    const products = await sql`
      SELECT
        id,
        name,
        price,
        stock,
        category,
        is_best_seller,
        is_new,
        created_at
      FROM products
      ORDER BY created_at DESC
      LIMIT 10
    `;
    console.log(`   إجمالي عدد المنتجات: ${products.length}`);

    if (products.length > 0) {
      console.log("\n   آخر 5 منتجات:");
      products.slice(0, 5).forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.name}`);
        console.log(`      السعر: ${p.price} IQD | المخزون: ${p.stock}`);
        console.log(`      الفئة: ${p.category || 'غير محدد'}`);
        if (p.is_best_seller) console.log(`      🔥 الأكثر مبيعاً`);
        if (p.is_new) console.log(`      ✨ جديد`);
      });
    } else {
      console.log("   ⚠️  لا توجد منتجات في قاعدة البيانات!");
    }

    // 2. Check Stock Levels
    console.log("\n\n📊 تحليل المخزون:");
    const stockStats = await sql`
      SELECT
        COUNT(*) FILTER (WHERE stock = 0) as out_of_stock,
        COUNT(*) FILTER (WHERE stock > 0 AND stock <= 10) as low_stock,
        COUNT(*) FILTER (WHERE stock > 10) as in_stock,
        COUNT(*) as total
      FROM products
    `;

    if (stockStats.length > 0) {
      const s = stockStats[0];
      console.log(`   منتجات نفذت من المخزون: ${s.out_of_stock}`);
      console.log(`   منتجات مخزون منخفض (1-10): ${s.low_stock}`);
      console.log(`   منتجات متوفرة (>10): ${s.in_stock}`);
      console.log(`   إجمالي المنتجات النشطة: ${s.total}`);
    }

    // 3. Check Orders
    console.log("\n\n🛒 الطلبات:");
    const orders = await sql`
      SELECT
        status,
        COUNT(*) as count,
        SUM(total) as total_amount
      FROM orders
      GROUP BY status
    `;

    if (orders.length > 0) {
      orders.forEach(o => {
        console.log(`   ${o.status}: ${o.count} طلب - إجمالي: ${o.total_amount || 0} IQD`);
      });
    } else {
      console.log("   ⚠️  لا توجد طلبات بعد");
    }

    // 4. Check Recent Orders
    const recentOrders = await sql`
      SELECT
        id,
        order_number,
        status,
        total,
        created_at,
        shipping_address
      FROM orders
      ORDER BY created_at DESC
      LIMIT 5
    `;

    if (recentOrders.length > 0) {
      console.log("\n   آخر 5 طلبات:");
      recentOrders.forEach((o, i) => {
        const customerName = o.shipping_address?.fullName || 'غير محدد';
        console.log(`   ${i + 1}. طلب #${o.order_number} - ${customerName}`);
        console.log(`      الحالة: ${o.status} | المبلغ: ${o.total} IQD`);
        console.log(`      التاريخ: ${new Date(o.created_at).toLocaleDateString('ar-IQ')}`);
      });
    }

    // 5. Check Coupons
    console.log("\n\n🎫 الكوبونات:");
    const coupons = await sql`
      SELECT
        code,
        discount_type,
        discount_value,
        is_active,
        used_count,
        max_uses
      FROM coupons
      WHERE is_active = true
      ORDER BY created_at DESC
      LIMIT 10
    `;

    if (coupons.length > 0) {
      console.log(`   عدد الكوبونات النشطة: ${coupons.length}`);
      coupons.forEach((c, i) => {
        let discountText = '';
        if (c.discount_type === 'percentage') {
          discountText = `${c.discount_value}%`;
        } else if (c.discount_type === 'fixed') {
          discountText = `${c.discount_value} IQD`;
        } else {
          discountText = 'شحن مجاني';
        }
        console.log(`   ${i + 1}. ${c.code}: ${discountText} | الاستخدام: ${c.used_count || 0}/${c.max_uses || '∞'}`);
      });
    } else {
      console.log("   ⚠️  لا توجد كوبونات نشطة");
    }

    // 6. Check Users
    console.log("\n\n👥 المستخدمون:");
    const userStats = await sql`
      SELECT
        role,
        COUNT(*) as count
      FROM users
      GROUP BY role
    `;

    if (userStats.length > 0) {
      userStats.forEach(u => {
        console.log(`   ${u.role}: ${u.count} مستخدم`);
      });
    }

    // 7. Check Gallery Prizes
    console.log("\n\n🏆 جوائز المعرض:");
    const prizes = await sql`
      SELECT
        month,
        prize,
        discount_code,
        discount_percentage,
        is_active
      FROM gallery_prizes
      ORDER BY created_at DESC
      LIMIT 5
    `;

    if (prizes.length > 0) {
      prizes.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.month}: ${p.prize}`);
        if (p.discount_code) {
          console.log(`      كود: ${p.discount_code} (${p.discount_percentage}%)`);
        }
        console.log(`      حالة: ${p.is_active ? 'نشط ✅' : 'غير نشط ❌'}`);
      });
    } else {
      console.log("   ⚠️  لا توجد جوائز مسجلة");
    }

    console.log("\n" + "═".repeat(60));
    console.log("✅ اكتمل فحص قاعدة البيانات");
    console.log("═".repeat(60) + "\n");

  } catch (error: any) {
    console.error("\n❌ خطأ في فحص قاعدة البيانات:");
    console.error(error.message);
    console.error("\nالتفاصيل:", error);
    process.exit(1);
  }
}

checkDatabase();
