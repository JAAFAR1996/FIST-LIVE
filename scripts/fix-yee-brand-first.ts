/**
 * Fix YEE Product Names - Brand First Format
 * Like HYGGER: "YEE مضخة أكسجين" instead of "مضخة YEE أكسجين"
 */

import { getDb } from "../server/db";
import { products } from "../shared/schema";
import { like, eq } from "drizzle-orm";

const db = getDb();
if (!db) {
    console.error("❌ Database connection failed");
    process.exit(1);
}

async function fixNames() {
    console.log("\n🔄 تصحيح أسماء YEE - العلامة أولاً...\n");

    const yeeProducts = await db.select().from(products).where(like(products.brand, 'YEE'));
    let count = 0;

    for (const p of yeeProducts) {
        // Remove YEE from anywhere in the name
        let cleanName = p.name.replace(/YEE\s*/g, '').replace(/\s+/g, ' ').trim();
        // Add YEE at the beginning
        let newName = 'YEE ' + cleanName;

        if (newName !== p.name) {
            await db.update(products).set({ name: newName }).where(eq(products.id, p.id));
            console.log('✅ ' + newName.substring(0, 60));
            count++;
        }
    }

    console.log('\n📊 تم تحديث ' + count + ' منتج');
    console.log('🎉 تم الانتهاء!\n');
    process.exit(0);
}

fixNames();
