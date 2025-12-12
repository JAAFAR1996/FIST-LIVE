import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { join } from "path";

async function runMigration(migrationFile: string) {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("❌ DATABASE_URL غير موجود في متغيرات البيئة");
    process.exit(1);
  }

  try {
    console.log(`\n⏳ تطبيق Migration: ${migrationFile}\n`);
    console.log("═".repeat(50));

    const sql = neon(databaseUrl);

    // Read migration file
    const migrationPath = join(process.cwd(), "migrations", migrationFile);
    const migrationSQL = readFileSync(migrationPath, "utf-8");

    console.log("\n📄 محتوى Migration:");
    console.log(migrationSQL);
    console.log("\n" + "═".repeat(50));

    // Split migration into individual statements
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`\n⏳ تنفيذ ${statements.length} أوامر SQL...\n`);

    // Execute each statement separately
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement) {
        console.log(`  [${i + 1}/${statements.length}] تنفيذ...`);
        await sql(statement);
      }
    }

    console.log("\n✅ تم تطبيق Migration بنجاح!");
    console.log("═".repeat(50) + "\n");

    // Verify table exists
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'gallery_prizes'
      );
    `;

    if (result[0]?.exists) {
      console.log("✅ جدول gallery_prizes موجود الآن في قاعدة البيانات");

      // Check if data was inserted
      const count = await sql`SELECT COUNT(*) as count FROM gallery_prizes`;
      console.log(`📊 عدد السجلات: ${count[0]?.count || 0}`);
    } else {
      console.log("⚠️  تحذير: لم يتم إنشاء الجدول!");
    }

  } catch (error: any) {
    console.error("\n❌ خطأ في تطبيق Migration:");
    console.error(error.message);
    process.exit(1);
  }
}

const migrationFile = process.argv[2] || "0003_add_gallery_prizes.sql";
runMigration(migrationFile);
