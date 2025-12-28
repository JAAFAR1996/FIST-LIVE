import { getDb } from '../server/db.js';
import { products } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

async function checkHouyiProducts() {
    const db = getDb();
    if (!db) {
        console.error('Database not configured');
        return;
    }

    // Get all Houyi products
    const houyiProducts = await db
        .select()
        .from(products)
        .where(eq(products.brand, 'Houyi'))
        .limit(10);

    console.log(`\nFound ${houyiProducts.length} Houyi products:\n`);

    for (const product of houyiProducts) {
        const hasImages = product.images && Array.isArray(product.images) && product.images.length > 0;
        console.log(`${product.name}`);
        console.log(`  ID: ${product.id}`);
        console.log(`  Images: ${hasImages ? product.images.length + ' images' : 'NO IMAGES ❌'}`);
        if (hasImages) {
            console.log(`  First image: ${product.images[0]}`);
        }
        console.log('');
    }
}

checkHouyiProducts()
    .then(() => process.exit(0))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
