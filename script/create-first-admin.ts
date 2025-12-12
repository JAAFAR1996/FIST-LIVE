import { getDb } from "../server/db.js";
import { users } from "../shared/schema.js";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const digest = crypto
    .pbkdf2Sync(password, salt, 15000, 64, "sha512")
    .toString("hex");
  return `${salt}:${digest}`;
}

async function createFirstAdmin() {
  console.log("\n🔐 إنشاء حساب الأدمن الأول\n");
  console.log("════════════════════════════════════════\n");

  const db = getDb();

  if (!db) {
    console.error("❌ فشل الاتصال بقاعدة البيانات. تأكد من إعداد DATABASE_URL في .env");
    process.exit(1);
  }

  try {
    // Check if admin already exists
    const existingAdmins = await db
      .select()
      .from(users)
      .where(eq(users.role, "admin"))
      .limit(1);

    if (existingAdmins.length > 0) {
      console.log("⚠️  يوجد حساب أدمن مسبقاً في النظام:");
      console.log(`   البريد: ${existingAdmins[0].email}`);
      console.log(`   الاسم: ${existingAdmins[0].fullName || "غير محدد"}`);

      const overwrite = await question("\nهل تريد إنشاء أدمن جديد على أي حال؟ (yes/no): ");

      if (overwrite.toLowerCase() !== "yes" && overwrite.toLowerCase() !== "y") {
        console.log("\n✅ تم الإلغاء.");
        rl.close();
        process.exit(0);
      }
    }

    // Get admin details
    const email = await question("\n📧 البريد الإلكتروني للأدمن: ");

    if (!email || !email.includes("@")) {
      throw new Error("البريد الإلكتروني غير صحيح");
    }

    // Check if email already exists
    const existingUser = await db!
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      console.log("\n⚠️  هذا البريد مستخدم مسبقاً!");
      const updateRole = await question("هل تريد ترقية هذا الحساب لأدمن؟ (yes/no): ");

      if (updateRole.toLowerCase() === "yes" || updateRole.toLowerCase() === "y") {
        await db!
          .update(users)
          .set({ role: "admin" })
          .where(eq(users.email, email));

        console.log("\n✅ تم ترقية الحساب لأدمن بنجاح!");
        rl.close();
        process.exit(0);
      } else {
        throw new Error("البريد الإلكتروني مستخدم مسبقاً");
      }
    }

    const fullName = await question("👤 الاسم الكامل: ");
    const phone = await question("📱 رقم الهاتف (اختياري): ");
    const password = await question("🔑 كلمة المرور (8 أحرف على الأقل): ");

    if (password.length < 8) {
      throw new Error("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
    }

    const confirmPassword = await question("🔑 تأكيد كلمة المرور: ");

    if (password !== confirmPassword) {
      throw new Error("كلمات المرور غير متطابقة");
    }

    // Create admin user
    console.log("\n⏳ جاري إنشاء حساب الأدمن...");

    const hashedPassword = hashPassword(password);

    const [newAdmin] = await db!.insert(users).values({
      email: email.toLowerCase().trim(),
      passwordHash: hashedPassword,
      fullName: fullName.trim() || email.split("@")[0],
      phone: phone.trim() || null,
      role: "admin",
      emailVerified: true, // Auto-verify admin
    }).returning();

    console.log("\n" + "═".repeat(50));
    console.log("✅ تم إنشاء حساب الأدمن بنجاح!");
    console.log("═".repeat(50));
    console.log(`\n📧 البريد: ${newAdmin.email}`);
    console.log(`👤 الاسم: ${newAdmin.fullName}`);
    console.log(`🆔 المعرف: ${newAdmin.id}`);
    console.log(`\n🔐 يمكنك الآن تسجيل الدخول على:`);
    console.log(`   ${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/login`);
    console.log("\n");

  } catch (error: any) {
    console.error("\n❌ خطأ:", error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

createFirstAdmin();
