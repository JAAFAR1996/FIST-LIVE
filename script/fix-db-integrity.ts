
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from "ws";
import * as schema from "../shared/schema";
import { sql } from "drizzle-orm";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

async function main() {
    console.log("🔧 Fixing database integrity issues...");

    try {
        // 1. Ensure system-admin user exists for audit logs
        console.log("Checking for 'system-admin' user...");
        await db.execute(sql`
      INSERT INTO users (id, email, password_hash, role, full_name, created_at, updated_at)
      VALUES ('system-admin', 'system@admin.local', 'system_placeholder_hash', 'admin', 'System Admin', NOW(), NOW())
      ON CONFLICT (id) DO NOTHING;
    `);
        console.log("✅ 'system-admin' user ensured.");

        console.log("🎉 Database integrity fixed! You can now run 'npm run db:push'.");
    } catch (error) {
        console.error("❌ Error fixing database:", error);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

main();
