import { neon } from "@neondatabase/serverless";

async function checkSchema() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("❌ DATABASE_URL غير موجود في متغيرات البيئة");
    process.exit(1);
  }

  const sql = neon(databaseUrl);

  try {
    console.log("\n📋 فحص بنية جدول products\n");
    console.log("═".repeat(60));

    const columns = await sql`
      SELECT
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_name = 'products'
      ORDER BY ordinal_position
    `;

    console.log("\nالأعمدة الموجودة:");
    columns.forEach((col, i) => {
      console.log(`${i + 1}. ${col.column_name} (${col.data_type}) ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });

    console.log("\n" + "═".repeat(60) + "\n");

    // Check all tables
    console.log("📊 جميع الجداول في قاعدة البيانات:\n");
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;

    tables.forEach((t, i) => {
      console.log(`${i + 1}. ${t.table_name}`);
    });

    console.log("\n" + "═".repeat(60) + "\n");

  } catch (error: any) {
    console.error("\n❌ خطأ:", error.message);
    process.exit(1);
  }
}

checkSchema();
