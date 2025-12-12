
import { getDb } from "../server/db";
import { users, orders } from "../shared/schema";

async function verifyRefactor() {
    console.log("🔍 Starting Verification...");
    const db = getDb();
    if (!db) throw new Error("DB Connection failed");

    // 1. Verify Schema Registration (Query API)
    console.log("👉 Testing Query API (Relations)...");
    try {
        const recentOrders = await db.query.orders.findMany({
            limit: 5,
            with: {
                items: true,
                payment: true,
                user: true,
            }
        });
        console.log(`✅ Successfully fetched ${recentOrders.length} orders with relations.`);
        if (recentOrders.length > 0) {
            console.log("   Sample Order Items:", recentOrders[0].items);
        }
    } catch (error) {
        console.error("❌ Basic Query API failed:", error);
    }

    // 2. Verify Categories
    console.log("👉 Testing Categories...");
    try {
        const categoriesCount = await db.query.categories.findMany();
        console.log(`✅ Found ${categoriesCount.length} categories.`);
    } catch (error) {
        console.error("❌ Category fetch failed:", error);
    }

    process.exit(0);
}

verifyRefactor().catch(console.error);
