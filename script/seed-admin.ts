import { db } from "../server/db.js";
import { users } from "../shared/schema";
import crypto from "crypto";
import { eq } from "drizzle-orm";

/**
 * Create admin user for the system
 * Default credentials:
 * Email: admin@fishstore.com
 * Password: Admin123!@#
 *
 * You can override using environment variables:
 * ADMIN_EMAIL=your@email.com ADMIN_PASSWORD=yourpassword tsx script/seed-admin.ts
 */

function derivePassword(password: string, salt: string) {
  return crypto
    .pbkdf2Sync(password, salt, 15000, 64, "sha512")
    .toString("hex");
}

function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const digest = derivePassword(password, salt);
  return `${salt}:${digest}`;
}

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@fishstore.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!@#";
  const adminName = process.env.ADMIN_NAME || "مدير النظام";

  console.log("🔐 Creating admin user...");
  console.log(`📧 Email: ${adminEmail}`);
  console.log(`👤 Name: ${adminName}`);

  try {
    // Check if admin already exists
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.email, adminEmail))
      .limit(1);

    if (existingAdmin.length > 0) {
      console.log("⚠️  Admin user already exists. Updating password...");

      await db
        .update(users)
        .set({
          passwordHash: hashPassword(adminPassword),
          role: "admin",
          fullName: adminName,
          updatedAt: new Date(),
        })
        .where(eq(users.email, adminEmail));

      console.log("✅ Admin password updated successfully!");
    } else {
      console.log("➕ Creating new admin user...");

      await db.insert(users).values({
        email: adminEmail,
        passwordHash: hashPassword(adminPassword),
        role: "admin",
        fullName: adminName,
      });

      console.log("✅ Admin user created successfully!");
    }

    console.log("\n🎉 Admin setup complete!");
    console.log("\n📝 Login credentials:");
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log("\n🌐 You can now login at: http://localhost:5000/admin/login");
    console.log("\n⚠️  IMPORTANT: Change the default password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    process.exit(1);
  }
}

seedAdmin();
