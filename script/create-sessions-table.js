import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not found in environment variables");
  process.exit(1);
}

async function createSessionsTable() {
  console.log("🔧 Creating sessions table for Vercel deployment...\n");

  const sql = neon(DATABASE_URL);

  try {
    // Drop existing table if it exists (to recreate properly)
    console.log("📝 Dropping old sessions table if exists...");
    await sql`DROP TABLE IF EXISTS sessions CASCADE;`;
    console.log("   ✅ Old table dropped");

    // Create sessions table
    console.log("\n📝 Creating sessions table...");
    await sql`
      CREATE TABLE sessions (
        sid TEXT PRIMARY KEY,
        sess JSONB NOT NULL,
        expire TIMESTAMP NOT NULL
      );
    `;
    console.log("   ✅ Sessions table created");

    // Create index on expire column for efficient cleanup
    console.log("\n📝 Creating index on expire column...");
    await sql`
      CREATE INDEX sessions_expire_idx ON sessions(expire);
    `;
    console.log("   ✅ Index created");

    // Verify table exists
    console.log("\n🔍 Verifying table...");
    const result = await sql`
      SELECT COUNT(*) as count FROM sessions;
    `;
    console.log(`   ✅ Sessions table verified (${result[0].count} sessions)`);

    console.log("\n✅ Sessions table setup complete!");
    console.log("\n📊 Summary:");
    console.log("  ✓ sessions table created");
    console.log("  ✓ expire index created");
    console.log("  ✓ Ready for Vercel deployment");
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🎉 Your database is now ready for production!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error creating sessions table:", error);
    console.error("Error details:", error.message);
    process.exit(1);
  }
}

createSessionsTable();
