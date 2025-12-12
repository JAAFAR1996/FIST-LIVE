import { getDb } from "../server/db.js";
import { users } from "../shared/schema.js";
import { eq } from "drizzle-orm";

async function checkAdmins() {
  const db = getDb();

  if (!db) {
    console.log("❌ فشل الاتصال بقاعدة البيانات. تأكد من إعداد DATABASE_URL");
    process.exit(1);
  }

  try {
    const admins = await db
      .select()
      .from(users)
      .where(eq(users.role, "admin"));

    console.log("\n📊 حسابات الأدمن الموجودة:", admins.length);
    console.log("═".repeat(50));

    if (admins.length === 0) {
      console.log("\n⚠️  لا توجد حسابات أدمن في النظام!");
      console.log("💡 قم بتشغيل: npm run create-admin");
    } else {
      admins.forEach((admin, i) => {
        console.log(`\n${i + 1}. البريد: ${admin.email}`);
        console.log(`   الاسم: ${admin.fullName || "غير محدد"}`);
        console.log(`   الهاتف: ${admin.phone || "غير محدد"}`);
        console.log(`   تم الإنشاء: ${admin.createdAt}`);
      });
    }

    console.log("\n" + "═".repeat(50) + "\n");
  } catch (error: any) {
    console.error("❌ خطأ:", error.message);
    process.exit(1);
  }
}

checkAdmins();
