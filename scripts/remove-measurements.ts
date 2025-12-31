import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { products } from "../shared/schema";
import { or, like, eq } from "drizzle-orm";

// Configure WebSockets for Neon
neonConfig.webSocketConstructor = ws;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
}

const pool = new Pool({ connectionString: databaseUrl });
const db = drizzle(pool);

async function removeMeasurementsFromNames() {
    try {
        // Get all products
        const allProducts = await db.select().from(products);

        console.log("Total products:", allProducts.length);
        console.log("\n--- Products with measurements ---\n");

        // Patterns to match and remove:
        // - Dimensions like "10×10×20 سم" or "10x10x20 سم"
        // - Sizes like "100 واط" (wattage)
        // - Sizes like "4 مم" or "6 مم" (mm)
        // - Volume like "500 مل" or "1 لتر"

        const measurementPatterns = [
            // Dimensions: 10×10×20 سم or similar
            /\s*\d+[×xX]\d+[×xX]\d+\s*سم/g,
            /\s*\d+[×xX]\d+\s*سم/g,
            // Wattage: 100 واط
            /\s*\d+\s*واط/g,
            // Millimeters: 4 مم
            /\s*\d+\s*مم/g,
            // Volume: 500 مل, 1 لتر
            /\s*\d+\s*مل/g,
            /\s*\d+\s*لتر/g,
            // Centimeters alone: 10 سم
            /\s*\d+\s*سم$/g,
        ];

        let updatedCount = 0;

        for (const product of allProducts) {
            let newName = product.name;
            let hasChange = false;

            for (const pattern of measurementPatterns) {
                if (pattern.test(newName)) {
                    hasChange = true;
                    newName = newName.replace(pattern, '');
                }
                // Reset regex lastIndex
                pattern.lastIndex = 0;
            }

            // Clean up extra spaces
            newName = newName.trim().replace(/\s+/g, ' ');

            if (hasChange && newName !== product.name) {
                console.log(`Current: ${product.name}`);
                console.log(`New:     ${newName}`);
                console.log(`ID:      ${product.id}`);
                console.log('---');

                // Update the product name
                await db.update(products)
                    .set({ name: newName })
                    .where(eq(products.id, product.id));

                updatedCount++;
            }
        }

        console.log(`\n✅ Updated ${updatedCount} products`);
        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        await pool.end();
        process.exit(1);
    }
}

removeMeasurementsFromNames();
