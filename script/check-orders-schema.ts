import { neon } from "@neondatabase/serverless";

async function checkOrdersSchema() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("❌ DATABASE_URL غير موجود");
    process.exit(1);
  }

  const sql = neon(databaseUrl);

  try {
    console.log("\n📋 فحص بنية جدول orders\n");

    const columns = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'orders'
      ORDER BY ordinal_position
    `;

    columns.forEach((col, i) => {
      console.log(`${i + 1}. ${col.column_name} (${col.data_type})`);
    });

  } catch (error: any) {
    console.error("❌ خطأ:", error.message);
  }
}

checkOrdersSchema();
