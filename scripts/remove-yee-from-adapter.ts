import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { products } from "../shared/schema";
import { like, eq } from "drizzle-orm";

// Configure WebSockets for Neon
neonConfig.webSocketConstructor = ws;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
}

const pool = new Pool({ connectionString: databaseUrl });
const db = drizzle(pool);

async function renameHeaterProduct() {
    try {
        // Find the product with المحارب (warrior heater)
        const foundProducts = await db.select().from(products).where(like(products.name, '%المحارب%'));

        console.log("Found products:", foundProducts.length);

        for (const product of foundProducts) {
            console.log(`Current name: ${product.name}`);

            // Replace المحارب with الساموراي
            const newName = product.name.replace('المحارب', 'الساموراي');

            console.log(`New name: ${newName}`);

            // Update the product name
            await db.update(products)
                .set({ name: newName })
                .where(eq(products.id, product.id));

            console.log(`✅ Updated product ID ${product.id}`);
        }

        console.log("Done!");
        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        await pool.end();
        process.exit(1);
    }
}

renameHeaterProduct();
