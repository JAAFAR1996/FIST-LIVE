import { neon } from "@neondatabase/serverless";

async function applyGalleryMigration() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("❌ DATABASE_URL غير موجود في متغيرات البيئة");
    process.exit(1);
  }

  const sql = neon(databaseUrl);

  try {
    console.log("\n⏳ تطبيق Migration لـ Gallery Prizes\n");
    console.log("═".repeat(50));

    // Check if table already exists
    console.log("\n1️⃣ التحقق من وجود الجدول...");
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'gallery_prizes'
      ) as exists;
    `;

    if (tableCheck[0]?.exists) {
      console.log("✅ جدول gallery_prizes موجود بالفعل");
      const count = await sql`SELECT COUNT(*) as count FROM gallery_prizes`;
      console.log(`📊 عدد السجلات الحالية: ${count[0]?.count || 0}`);
      console.log("\n✅ Migration مطبّق مسبقاً - لا حاجة لإعادة التطبيق\n");
      return;
    }

    console.log("⚠️  الجدول غير موجود - سيتم إنشاؤه الآن...\n");

    // Create table
    console.log("2️⃣ إنشاء جدول gallery_prizes...");
    await sql`
      CREATE TABLE gallery_prizes (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        month TEXT NOT NULL UNIQUE,
        prize TEXT NOT NULL,
        discount_code TEXT,
        discount_percentage INTEGER,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;
    console.log("✅ تم إنشاء الجدول");

    // Create indexes
    console.log("\n3️⃣ إنشاء الفهارس...");
    await sql`CREATE INDEX idx_gallery_prizes_month ON gallery_prizes(month)`;
    await sql`CREATE INDEX idx_gallery_prizes_active ON gallery_prizes(is_active)`;
    console.log("✅ تم إنشاء الفهارس");

    // Insert default data
    console.log("\n4️⃣ إضافة بيانات افتراضية...");
    const result = await sql`
      INSERT INTO gallery_prizes (month, prize, discount_code, discount_percentage, is_active)
      VALUES (
        to_char(CURRENT_DATE, 'TMMonth YYYY'),
        'كوبون خصم 20%',
        'GALLERY20',
        20,
        true
      )
      RETURNING *
    `;

    if (result.length > 0) {
      console.log("✅ تمت إضافة الجائزة الافتراضية:");
      console.log(`   الشهر: ${result[0].month}`);
      console.log(`   الجائزة: ${result[0].prize}`);
      console.log(`   كود الخصم: ${result[0].discount_code}`);
      console.log(`   نسبة الخصم: ${result[0].discount_percentage}%`);
    }

    // Verify
    console.log("\n5️⃣ التحقق من النتيجة...");
    const finalCount = await sql`SELECT COUNT(*) as count FROM gallery_prizes`;
    console.log(`📊 عدد السجلات: ${finalCount[0]?.count || 0}`);

    console.log("\n" + "═".repeat(50));
    console.log("✅ تم تطبيق Migration بنجاح!");
    console.log("═".repeat(50) + "\n");

  } catch (error: any) {
    console.error("\n❌ خطأ في تطبيق Migration:");
    console.error(error.message);
    console.error("\nالتفاصيل:", error);
    process.exit(1);
  }
}

applyGalleryMigration();
