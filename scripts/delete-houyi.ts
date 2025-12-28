import { getDb } from '../server/db.js';
import { products } from '../shared/schema.js';
import { eq } from 'drizzle-orm';
import { rm } from 'fs/promises';
import { join } from 'path';

async function deleteAllHouyi() {
    const db = getDb();
    if (!db) {
        console.error('❌ Database not configured');
        return;
    }

    console.log('🗑️  Deleting all Houyi products...\n');

    // 1. Delete from database
    const deleted = await db
        .delete(products)
        .where(eq(products.brand, 'Houyi'))
        .returning();

    console.log(`✅ Deleted ${deleted.length} products from database`);

    // 2. Delete images folder
    const imagesDir = join(process.cwd(), 'client', 'public', 'images', 'products', 'houyi');

    try {
        await rm(imagesDir, { recursive: true, force: true });
        console.log(`✅ Deleted images folder: ${imagesDir}`);
    } catch (error) {
        console.log(`⚠️  Images folder not found or already deleted`);
    }

    console.log('\n✨ All Houyi data deleted!');
}

deleteAllHouyi()
    .then(() => {
        console.log('\n🎉 Done!');
        process.exit(0);
    })
    .catch(err => {
        console.error('\n💥 Error:', err);
        process.exit(1);
    });
