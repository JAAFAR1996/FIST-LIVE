import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not found in environment variables");
  process.exit(1);
}

async function setupAdmin() {
  console.log("🚀 Starting admin setup...\n");

  const sql = neon(DATABASE_URL);

  try {
    // Step 1: Add role column to users table
    console.log("📝 Step 1: Adding role column to users table...");
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user'`;
      console.log("   ✓ Role column added successfully");
    } catch (error) {
      if (error.message && error.message.includes("already exists")) {
        console.log("   ⚠️  Role column already exists");
      } else {
        throw error;
      }
    }

    // Step 2: Create discounts table
    console.log("\n📝 Step 2: Creating discounts table...");
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS discounts (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
          type TEXT NOT NULL,
          value NUMERIC NOT NULL,
          start_date TIMESTAMP,
          end_date TIMESTAMP,
          is_active BOOLEAN NOT NULL DEFAULT true,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `;
      console.log("   ✓ Discounts table created successfully");
    } catch (error) {
      console.log("   ⚠️  Discounts table may already exist");
    }

    // Step 3: Create audit_logs table
    console.log("\n📝 Step 3: Creating audit_logs table...");
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS audit_logs (
          id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
          user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          action TEXT NOT NULL,
          entity_type TEXT NOT NULL,
          entity_id TEXT NOT NULL,
          changes JSONB,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        )
      `;
      console.log("   ✓ Audit logs table created successfully");
    } catch (error) {
      console.log("   ⚠️  Audit logs table may already exist");
    }

    // Step 4: Create indexes
    console.log("\n📝 Step 4: Creating indexes...");
    const indexes = [
      { name: "idx_discounts_product_id", sql: "CREATE INDEX IF NOT EXISTS idx_discounts_product_id ON discounts(product_id)" },
      { name: "idx_discounts_is_active", sql: "CREATE INDEX IF NOT EXISTS idx_discounts_is_active ON discounts(is_active)" },
      { name: "idx_audit_logs_user_id", sql: "CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id)" },
      { name: "idx_audit_logs_entity_type", sql: "CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type ON audit_logs(entity_type)" },
      { name: "idx_audit_logs_entity_id", sql: "CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_id ON audit_logs(entity_id)" },
      { name: "idx_audit_logs_created_at", sql: "CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at)" },
      { name: "idx_users_role", sql: "CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)" },
    ];

    for (const index of indexes) {
      try {
        await sql.unsafe(index.sql);
        console.log(`   ✓ Index ${index.name} created`);
      } catch (error) {
        console.log(`   ⚠️  Index ${index.name} may already exist`);
      }
    }

    console.log("\n✅ Database structure updated successfully!");
    console.log("\n📊 Summary:");
    console.log("  ✓ Added 'role' column to users table");
    console.log("  ✓ Created 'discounts' table");
    console.log("  ✓ Created 'audit_logs' table");
    console.log("  ✓ Created indexes for better performance");

    // Step 5: Setup admin user
    console.log("\n👤 Step 5: Setting up admin user...");

    // Check if admin user exists
    const existingAdmin = await sql`
      SELECT id, username FROM users WHERE role = 'admin' LIMIT 1
    `;

    if (existingAdmin.length > 0) {
      console.log(`   ✅ Admin user already exists: ${existingAdmin[0].username}`);
    } else {
      // Update first user to admin
      const firstUser = await sql`
        SELECT id, username FROM users LIMIT 1
      `;

      if (firstUser.length > 0) {
        await sql`
          UPDATE users
          SET role = 'admin'
          WHERE id = ${firstUser[0].id}
        `;
        console.log(`   ✅ Updated user '${firstUser[0].username}' to admin role`);
      } else {
        console.log("   ⚠️  No users found. Please:");
        console.log("      1. Create an account on the website");
        console.log("      2. Run: UPDATE users SET role = 'admin' WHERE username = 'your_username';");
      }
    }

    console.log("\n🎉 Setup complete!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📍 Access admin dashboard at:");
    console.log("   http://localhost:5000/admin");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  } catch (error) {
    console.error("\n❌ Setup failed:", error);
    process.exit(1);
  }
}

setupAdmin();
