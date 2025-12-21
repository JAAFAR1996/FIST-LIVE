import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
    console.error("❌ DATABASE_URL not found");
    process.exit(1);
}

console.log("🔗 Testing connection...");
console.log("   URL:", DATABASE_URL.replace(/:[^:@]+@/, ':****@'));

const sql = neon(DATABASE_URL);

try {
    const result = await sql`SELECT COUNT(*) as cnt FROM products WHERE deleted_at IS NULL`;
    console.log("✅ Connection successful!");
    console.log("📊 Products count:", result[0].cnt);
} catch (error: any) {
    console.error("❌ Connection failed:", error.message);
}
