
import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is not set in environment variables");
    process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function main() {
    console.log("🔍 Starting Database Verification...");
    console.log("-----------------------------------");

    try {
        // Check connection details
        // parsing the URL to get the host
        const dbUrl = new URL(process.env.DATABASE_URL);
        console.log(`📡 Connecting to Host: ${dbUrl.host}`);
        console.log(`💾 Database Name: ${dbUrl.pathname.split('/')[1]}`);
        console.log("-----------------------------------");

        // Also perform a query to verify what the server thinks
        const serverInfo = await sql`SELECT inet_server_addr(), current_database(), version()`;
        console.log(`ℹ️ Server Version: ${serverInfo[0].version}`);
        console.log("-----------------------------------");


        const missingItems: string[] = [];
        const foundItems: string[] = [];

        // Helper function to check table existence
        async function checkTable(tableName: string) {
            const result = await sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = ${tableName}
        );
      `;
            if (result[0].exists) {
                foundItems.push(`Table: ${tableName}`);
                return true;
            } else {
                missingItems.push(`Table: ${tableName}`);
                return false;
            }
        }

        // Helper function to check column existence
        async function checkColumn(tableName: string, columnName: string) {
            const result = await sql`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_name = ${tableName} AND column_name = ${columnName}
        );
      `;
            if (result[0].exists) {
                foundItems.push(`Column: ${tableName}.${columnName}`);
                return true;
            } else {
                missingItems.push(`Column: ${tableName}.${columnName}`);
                return false;
            }
        }

        // 1. Check Tables
        await checkTable('categories');
        await checkTable('payments');
        await checkTable('order_items_relational');
        await checkTable('user_addresses');
        await checkTable('translations');
        await checkTable('gallery_prizes');
        await checkTable('newsletter_subscriptions');

        // 2. Check Key Columns
        await checkColumn('products', 'category_id');
        await checkColumn('users', 'deleted_at');
        await checkColumn('users', 'loyalty_points');
        await checkColumn('orders', 'order_number');
        await checkColumn('orders', 'shipping_cost');

        console.log("\n📊 Verification Results:");
        console.log("-----------------------");

        if (foundItems.length > 0) {
            console.log("✅ FOUND:");
            foundItems.forEach(item => console.log(`   - ${item}`));
        }

        if (missingItems.length > 0) {
            console.log("\n❌ MISSING (Still needs fix):");
            missingItems.forEach(item => console.log(`   - ${item}`));
            process.exit(1);
        } else {
            console.log("\n✨ SUCCESS: All checked schema elements are present!");
        }

    } catch (err) {
        console.error("❌ Error during verification:", err);
        process.exit(1);
    }
}

main();
