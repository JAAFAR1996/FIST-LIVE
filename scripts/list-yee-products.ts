import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { products } from "../shared/schema";
import { like } from "drizzle-orm";

// Configure WebSockets for Neon
neonConfig.webSocketConstructor = ws;

// Use the connection string directly
const databaseUrl = "postgresql://neondb_owner:npg_N7dEzt2pWjCi@ep-quiet-moon-a4h7tdze-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require";

const pool = new Pool({ connectionString: databaseUrl });
const db = drizzle(pool);

async function listYeeProducts() {
    try {
        // Find all YEE products
        const yeeProducts = await db.select({
            id: products.id,
            name: products.name,
            category: products.category,
            description: products.description,
        }).from(products).where(like(products.brand, '%YEE%'));

        console.log("YEE Products found:", yeeProducts.length);
        console.log("\n--- YEE Products ---\n");

        yeeProducts.forEach((p, index) => {
            console.log(`${index + 1}. ${p.name}`);
            console.log(`   ID: ${p.id}`);
            console.log(`   Category: ${p.category}`);
            console.log(`   Description: ${p.description?.substring(0, 100)}...`);
            console.log('');
        });

        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        await pool.end();
        process.exit(1);
    }
}

listYeeProducts();
