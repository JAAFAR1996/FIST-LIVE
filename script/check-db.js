import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not found");
  process.exit(1);
}

async function checkDatabase() {
  const sql = neon(DATABASE_URL);

  try {
    console.log("🔍 Checking database structure...\n");

    // Check users table structure
    console.log("📊 Users table columns:");
    const usersColumns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `;

    if (usersColumns.length > 0) {
      usersColumns.forEach(col => {
        console.log(`   - ${col.column_name}: ${col.data_type}`);
      });
    } else {
      console.log("   ⚠️  No users table found");
    }

    // Check if there are any users
    console.log("\n👥 Users in database:");
    const users = await sql`SELECT * FROM users LIMIT 5`;
    if (users.length > 0) {
      users.forEach((user, idx) => {
        const keys = Object.keys(user);
        console.log(`   ${idx + 1}. ID: ${user.id}`);
        console.log(`      Keys: ${keys.join(", ")}`);
      });
    } else {
      console.log("   ⚠️  No users found");
    }

    // Check products table
    console.log("\n📦 Products in database:");
    const products = await sql`SELECT id, name, slug FROM products LIMIT 3`;
    console.log(`   Found ${products.length} products`);
    products.forEach((p, idx) => {
      console.log(`   ${idx + 1}. ${p.name} (${p.slug})`);
    });

    // Check discounts table
    console.log("\n💰 Discounts table:");
    const discountsCount = await sql`SELECT COUNT(*) as count FROM discounts`;
    console.log(`   Found ${discountsCount[0].count} discounts`);

    // Check audit_logs table
    console.log("\n📝 Audit logs table:");
    const logsCount = await sql`SELECT COUNT(*) as count FROM audit_logs`;
    console.log(`   Found ${logsCount[0].count} audit logs`);

    console.log("\n✅ Database check complete!\n");

  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

checkDatabase();
