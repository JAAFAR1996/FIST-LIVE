/**
 * Add variants columns to products table
 */
import { getDb } from "../server/db";
import { sql } from "drizzle-orm";

const db = getDb();
if (!db) {
    console.error("❌ Database connection failed");
    process.exit(1);
}

async function addColumns() {
    try {
        console.log("Adding variants columns to products table...");

        await db.execute(sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS variants jsonb`);
        console.log("✅ Added variants column");

        await db.execute(sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS has_variants boolean DEFAULT false NOT NULL`);
        console.log("✅ Added has_variants column");

        console.log("\n✅ All columns added successfully!");
    } catch (e) {
        console.error("Error:", e);
    }
    process.exit(0);
}

addColumns();
