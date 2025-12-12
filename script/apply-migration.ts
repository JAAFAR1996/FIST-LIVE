import { neon } from "@neondatabase/serverless";
import * as fs from "fs";
import * as path from "path";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not found in environment variables");
  process.exit(1);
}

async function applyMigration() {
  console.log("🚀 Starting migration...");

  const sql = neon(DATABASE_URL);

  try {
    // Read migration file
    const migrationPath = path.join(process.cwd(), "migrations", "001_add_admin_features.sql");
    const migrationSQL = fs.readFileSync(migrationPath, "utf-8");

    // Split by semicolons and execute each statement
    const statements = migrationSQL
      .split(";")
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith("--"));

    console.log(`📝 Found ${statements.length} SQL statements to execute`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement) {
        console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
        await sql(statement);
      }
    }

    console.log("✅ Migration completed successfully!");
    console.log("\n📊 Database structure updated:");
    console.log("  ✓ Added 'role' column to users table");
    console.log("  ✓ Created 'discounts' table");
    console.log("  ✓ Created 'audit_logs' table");
    console.log("  ✓ Created indexes for better performance");

    // Now create an admin user
    console.log("\n👤 Creating admin user...");

    // Check if admin user exists
    const existingAdmin = await sql`
      SELECT id, username FROM users WHERE role = 'admin' LIMIT 1
    `;

    if (existingAdmin.length > 0) {
      console.log(`✅ Admin user already exists: ${existingAdmin[0].username}`);
    } else {
      // Update first user to admin or create new one
      const firstUser = await sql`
        SELECT id, username FROM users LIMIT 1
      `;

      if (firstUser.length > 0) {
        await sql`
          UPDATE users
          SET role = 'admin'
          WHERE id = ${firstUser[0].id}
        `;
        console.log(`✅ Updated user '${firstUser[0].username}' to admin role`);
      } else {
        console.log("⚠️  No users found. Please create a user first, then run:");
        console.log("   UPDATE users SET role = 'admin' WHERE username = 'your_username';");
      }
    }

    console.log("\n🎉 Setup complete!");
    console.log("📍 Access admin dashboard at: http://localhost:5000/admin");

  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

applyMigration();
