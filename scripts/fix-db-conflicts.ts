
import { getDb } from "../server/db";
import { sql } from "drizzle-orm";

async function fixConflicts() {
    const db = getDb();
    if (!db) throw new Error("Database connection failed. Ensure DATABASE_URL is set.");

    console.log("🔧 Starting Database Conflict Resolution...");

    try {
        console.log("🗑️  Dropping 'sessions' table to resolve Primary Key conflict...");
        // We use a raw query to drop the table. 
        // Note: Drizzle's execute might need the driver directly or we can use the sql template tag.
        await db.execute(sql`DROP TABLE IF EXISTS "sessions";`);
        console.log("✅ 'sessions' table dropped successfully.");
    } catch (error) {
        console.error("❌ Failed to drop 'sessions' table:", error);
    }

    process.exit(0);
}

fixConflicts().catch((err) => {
    console.error("❌ Fix Script Failed:", err);
    process.exit(1);
});
