
import { neon } from "@neondatabase/serverless";
import crypto from "crypto";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error("❌ DATABASE_URL not found in environment variables");
    process.exit(1);
}

const sql = neon(DATABASE_URL);

function derivePassword(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}

function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString("hex");
    const digest = derivePassword(password, salt);
    return `${salt}:${digest}`;
}

async function main() {
    console.log("🎣 checking database state...");

    try {
        // 1. Check Products
        const products = await sql`SELECT count(*) FROM products`;
        console.log(`📦 Total Products in DB: ${products[0].count}`);

        // 2. Reset Admin
        const adminEmail = "admin@fishstore.com";
        const adminPassword = "Admin123!@#";

        console.log(`\n🔄 Resetting Admin User (${adminEmail})...`);

        // Delete existing admin
        await sql`DELETE FROM users WHERE email = ${adminEmail}`;
        console.log("   ✓ Deleted existing admin user (if any)");

        // Create new admin
        const passwordHash = hashPassword(adminPassword);

        // Ensure role column exists (just in case)
        await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user'`;

        await sql`
      INSERT INTO users (email, password_hash, role, full_name, created_at)
      VALUES (${adminEmail}, ${passwordHash}, 'admin', 'مدير النظام', NOW())
    `;

        console.log("   ✅ Created new admin user successfully!");
        console.log(`   🔑 Password: ${adminPassword}`);

    } catch (error) {
        console.error("❌ Error:", error);
    }
}

main();
