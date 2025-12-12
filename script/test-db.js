import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

// Load environment variables from .env if present
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

console.log("----------------------------------------");
console.log("🧪 Database Connection Test");
console.log("----------------------------------------");

if (!DATABASE_URL) {
    console.error("❌ DATABASE_URL is not set in environment");
    process.exit(1);
}

// Mask the password for display
const maskedUrl = DATABASE_URL.replace(/:([^:@]+)@/, ":****@");
console.log(`📡 URL Configured: ${maskedUrl}`);

async function testConnection() {
    try {
        const sql = neon(DATABASE_URL);
        const start = Date.now();
        console.log("⏳ Attempting to connect...");

        const result = await sql`SELECT 1 as connected`;

        const duration = Date.now() - start;
        console.log(`✅ Success! Connected in ${duration}ms`);
        console.log("📊 Result:", result);
    } catch (error) {
        console.error("❌ Connection Failed:");
        if (error.cause) {
            console.error("   Cause:", error.cause);
        }
        console.error("   Message:", error.message);
        console.error("   Stack:", error.stack);
    }
}

testConnection();
