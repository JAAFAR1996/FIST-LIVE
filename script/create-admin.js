import { neon } from "@neondatabase/serverless";
import crypto from "crypto";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not found in environment variables");
  console.log("💡 Run with: DATABASE_URL='your-db-url' node script/create-admin.js");
  process.exit(1);
}

/**
 * Password hashing functions (matching server/routes.ts)
 */
function derivePassword(password, salt) {
  return crypto
    .pbkdf2Sync(password, salt, 15000, 64, "sha512")
    .toString("hex");
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const digest = derivePassword(password, salt);
  return `${salt}:${digest}`;
}

async function createAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@fishstore.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!@#";
  const adminName = process.env.ADMIN_NAME || "مدير النظام";

  console.log("🔐 Creating admin user...");
  console.log(`📧 Email: ${adminEmail}`);
  console.log(`👤 Name: ${adminName}`);

  const sql = neon(DATABASE_URL);

  try {
    // First, ensure role column exists
    console.log("\n📝 Step 1: Ensuring role column exists...");
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user'`;
      console.log("   ✓ Role column ready");
    } catch (error) {
      if (!error.message?.includes("already exists")) {
        console.error("   ⚠️  Error adding role column:", error.message);
      }
    }

    // Check if admin already exists
    console.log("\n📝 Step 2: Checking for existing admin...");
    const existingAdmin = await sql`
      SELECT id, email, role FROM users WHERE email = ${adminEmail}
    `;

    const passwordHash = hashPassword(adminPassword);

    if (existingAdmin.length > 0) {
      console.log("   ⚠️  Admin user already exists. Updating password...");

      await sql`
        UPDATE users
        SET
          password_hash = ${passwordHash},
          role = 'admin',
          full_name = ${adminName},
          updated_at = NOW()
        WHERE email = ${adminEmail}
      `;

      console.log("   ✅ Admin password updated successfully!");
    } else {
      console.log("   ➕ Creating new admin user...");

      await sql`
        INSERT INTO users (email, password_hash, role, full_name)
        VALUES (${adminEmail}, ${passwordHash}, 'admin', ${adminName})
      `;

      console.log("   ✅ Admin user created successfully!");
    }

    // Verify admin user
    console.log("\n📝 Step 3: Verifying admin user...");
    const adminUsers = await sql`
      SELECT id, email, full_name, role, created_at
      FROM users
      WHERE role = 'admin'
      ORDER BY created_at DESC
    `;

    console.log(`\n✅ Found ${adminUsers.length} admin user(s):`);
    adminUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email} (${user.full_name || 'No name'})`);
    });

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🎉 Admin setup complete!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n📝 Login credentials:");
    console.log(`   Email:    ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log("\n🌐 Access admin panel at:");
    console.log("   http://localhost:5000/admin/login");
    console.log("\n⚠️  SECURITY WARNING:");
    console.log("   Please change the default password after first login!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error creating admin user:", error);
    console.error("Error details:", error.message);
    process.exit(1);
  }
}

createAdmin();
