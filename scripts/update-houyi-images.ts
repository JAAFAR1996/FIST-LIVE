import { getDb } from '../server/db.js';
import { products } from '../shared/schema.js';
import { eq } from 'drizzle-orm';
import { readdir } from 'fs/promises';
import { join } from 'path';

async function updateHouyiImages() {
    const db = getDb();
    if (!db) {
        console.error('❌ Database not configured');
        return;
    }

    console.log('🔄 Updating Houyi product images...\n');

    // Get all Houyi products
    const houyiProducts = await db
        .select()
        .from(products)
        .where(eq(products.brand, 'Houyi'));

    console.log(`Found ${houyiProducts.length} Houyi products\n`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const product of houyiProducts) {
        try {
            // Extract slug from ID (remove 'houyi-' prefix)
            const slug = product.id.replace('houyi-', '');
            const imagesDir = join(process.cwd(), 'client', 'public', 'images', 'products', 'houyi', slug);

            try {
                // Check if directory exists and get images
                const files = await readdir(imagesDir);
                const imageFiles = files.filter(f =>
                    /\.(jpg|jpeg|png|webp|gif)$/i.test(f)
                );

                if (imageFiles.length > 0) {
                    // Create image URLs
                    const images = imageFiles.map(file =>
                        `/images/products/houyi/${slug}/${file}`
                    );
                    const thumbnail = images[0];

                    // Update database
                    await db
                        .update(products)
                        .set({
                            images,
                            thumbnail,
                            updatedAt: new Date(),
                        })
                        .where(eq(products.id, product.id));

                    console.log(`✅ Updated: ${product.name} (${images.length} images)`);
                    updatedCount++;
                } else {
                    console.log(`⚠️  No images: ${product.name}`);
                    skippedCount++;
                }
            } catch (error) {
                // Directory doesn't exist
                console.log(`⚠️  No folder: ${product.name}`);
                skippedCount++;
            }
        } catch (error) {
            console.error(`❌ Error updating ${product.name}:`, error);
            skippedCount++;
        }
    }

    console.log(`\n✨ Update completed!`);
    console.log(`✅ Updated: ${updatedCount} products`);
    console.log(`⚠️  Skipped: ${skippedCount} products`);
}

updateHouyiImages()
    .then(() => {
        console.log('\n🎉 Done!');
        process.exit(0);
    })
    .catch(err => {
        console.error('\n💥 Error:', err);
        process.exit(1);
    });
