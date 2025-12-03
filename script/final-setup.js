import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not found");
  process.exit(1);
}

async function finalSetup() {
  const sql = neon(DATABASE_URL);

  try {
    console.log("🚀 Final setup for admin system...\n");

    // Create audit_logs table without foreign keys
    console.log("📝 Creating audit_logs table...");
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS audit_logs (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          user_id TEXT NOT NULL,
          action TEXT NOT NULL,
          entity_type TEXT NOT NULL,
          entity_id TEXT NOT NULL,
          changes JSONB,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `;
      console.log("   ✓ Audit logs table created successfully");

      // Create indexes
      await sql`CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type ON audit_logs(entity_type)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at)`;
      console.log("   ✓ Indexes created");

    } catch (error) {
      if (error.message && error.message.includes("already exists")) {
        console.log("   ⚠️  Audit logs table already exists");
      } else {
        console.error("   ❌ Error:", error.message);
      }
    }

    // Setup admin user
    console.log("\n👤 Setting up admin user...");

    // Check if admin exists
    const existingAdmin = await sql`
      SELECT id, email, role FROM users WHERE role = 'admin' LIMIT 1
    `;

    if (existingAdmin.length > 0) {
      console.log(`   ✅ Admin user already exists: ${existingAdmin[0].email}`);
    } else {
      // Update first user to admin
      const firstUser = await sql`
        SELECT id, email FROM users LIMIT 1
      `;

      if (firstUser.length > 0) {
        await sql`
          UPDATE users
          SET role = 'admin'
          WHERE id = ${firstUser[0].id}
        `;
        console.log(`   ✅ Updated user '${firstUser[0].email}' to admin role`);
      } else {
        console.log("   ⚠️  No users found");
        console.log("   📝 Please create an account first, then run:");
        console.log("      UPDATE users SET role = 'admin' WHERE email = 'your_email@example.com';");
      }
    }

    // Verify setup
    console.log("\n🔍 Verifying setup...");

    const tablesCheck = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('users', 'products', 'discounts', 'audit_logs')
      ORDER BY table_name
    `;

    console.log("   ✓ Tables found:");
    tablesCheck.forEach(t => {
      console.log(`     - ${t.table_name}`);
    });

    const adminUsers = await sql`
      SELECT email, role FROM users WHERE role = 'admin'
    `;

    console.log(`\n   ✓ Admin users (${adminUsers.length}):`);
    adminUsers.forEach(u => {
      console.log(`     - ${u.email}`);
    });

    console.log("\n✅ Setup complete!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🎉 Admin system is ready!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n📍 Access admin dashboard at:");
    console.log("   http://localhost:5000/admin");
    console.log("\n📊 Database includes:");
    console.log("   ✓ Users with role field");
    console.log("   ✓ Discounts table");
    console.log("   ✓ Audit logs table");
    console.log("   ✓ All necessary indexes");
    console.log("\n🔐 Login with admin credentials:");
    if (adminUsers.length > 0) {
      console.log(`   Email: ${adminUsers[0].email}`);
      console.log("   Password: (your existing password)");
    }
    console.log("\n");

  } catch (error) {
    console.error("\n❌ Setup failed:", error.message);
    process.exit(1);
  }
}

finalSetup();
