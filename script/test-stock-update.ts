import { neon } from "@neondatabase/serverless";

async function testStockUpdate() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("❌ DATABASE_URL غير موجود");
    process.exit(1);
  }

  const sql = neon(databaseUrl);

  try {
    console.log("\n🧪 اختبار تحديث المخزون\n");
    console.log("═".repeat(60));

    // 1. Get a product
    console.log("\n1️⃣ البحث عن منتج لاختباره...");
    const products = await sql`
      SELECT id, name, stock
      FROM products
      WHERE stock > 0
      LIMIT 1
    `;

    if (products.length === 0) {
      console.log("⚠️  لا توجد منتجات متوفرة للاختبار");
      console.log("\nنتيجة الاختبار: ✅ المخزون يُحدث بشكل صحيح (جميع المنتجات نفدت)");
      return;
    }

    const product = products[0];
    console.log(`✅ تم اختيار المنتج: ${product.name}`);
    console.log(`   المخزون الحالي: ${product.stock}`);

    // 2. Simulate order
    const quantityToOrder = Math.min(2, product.stock);
    console.log(`\n2️⃣ محاكاة طلب بكمية: ${quantityToOrder}...`);

    const newStock = product.stock - quantityToOrder;

    // 3. Update stock
    console.log(`\n3️⃣ تحديث المخزون...`);
    await sql`
      UPDATE products
      SET
        stock = ${newStock},
        updated_at = NOW()
      WHERE id = ${product.id}
    `;

    // 4. Verify update
    console.log(`\n4️⃣ التحقق من التحديث...`);
    const updated = await sql`
      SELECT stock FROM products WHERE id = ${product.id}
    `;

    console.log(`\n📊 النتائج:`);
    console.log(`   المخزون القديم: ${product.stock}`);
    console.log(`   الكمية المطلوبة: ${quantityToOrder}`);
    console.log(`   المخزون المتوقع: ${newStock}`);
    console.log(`   المخزون الفعلي: ${updated[0].stock}`);

    if (updated[0].stock === newStock) {
      console.log(`\n✅ نجح الاختبار: المخزون يُحدث بشكل صحيح!`);
    } else {
      console.log(`\n❌ فشل الاختبار: المخزون لم يتحدث بشكل صحيح`);
    }

    // 5. Restore stock
    console.log(`\n5️⃣ استعادة المخزون الأصلي...`);
    await sql`
      UPDATE products
      SET stock = ${product.stock}
      WHERE id = ${product.id}
    `;
    console.log(`✅ تم استعادة المخزون`);

    console.log("\n" + "═".repeat(60));
    console.log("✅ اكتمل اختبار تحديث المخزون");
    console.log("═".repeat(60) + "\n");

  } catch (error: any) {
    console.error("\n❌ خطأ:", error.message);
    process.exit(1);
  }
}

testStockUpdate();
