import { getDb } from '../server/db.js';
import { products } from '../shared/schema.js';
import { eq, inArray } from 'drizzle-orm';
import type { ProductVariant } from '../shared/schema.js';

// تعريف المجموعات التي سندمجها
const variantGroups = [
    {
        baseName: 'Polished Driftwood',
        mainProductId: 'houyi-polished-driftwood10-15cm', // المنتج الرئيسي (الأكثر شيوعاً)
        products: [
            { id: 'houyi-polished-driftwood5-8cm', size: '5-8cm' },
            { id: 'houyi-polished-driftwood8-10cm', size: '8-10cm' },
            { id: 'houyi-polished-driftwood10-15cm', size: '10-15cm', isDefault: true },
            { id: 'houyi-polished-driftwood15-20cm', size: '15-20cm' },
        ]
    },
    {
        baseName: 'Fish Tank Color Oxygen Tube',
        mainProductId: 'houyi-fish-tank-color-oxygen-tube-black',
        products: [
            { id: 'houyi-fish-tank-color-oxygen-tube-black', size: 'عادي', color: 'أسود', isDefault: true },
            { id: 'houyi-fish-tank-color-oxygen-tube-white', size: 'عادي', color: 'أبيض' },
            { id: 'houyi-fish-tank-color-oxygen-tube-black-large', size: 'كبير', color: 'أسود' },
            { id: 'houyi-fish-tank-color-oxygen-tube-white-large', size: 'كبير', color: 'أبيض' },
        ]
    },
    {
        baseName: 'Moss Glue',
        mainProductId: 'houyi-moss-glue-20g-white',
        products: [
            { id: 'houyi-moss-glue-5g-white-ca-gel', size: '5g' },
            { id: 'houyi-moss-glue-20g-white', size: '20g', isDefault: true },
        ]
    },
    {
        baseName: 'Medium cotton',
        mainProductId: 'houyi-medium-cotton-brown-50g',
        products: [
            { id: 'houyi-medium-cotton-brown-50g', color: 'بني', isDefault: true },
            { id: 'houyi-medium-cotton-grey-50g', color: 'رمادي' },
        ]
    },
    {
        baseName: 'Aquarium Fish tank Plastic',
        mainProductId: 'houyi-aquarium-fish-tank-plastic-white',
        products: [
            { id: 'houyi-aquarium-fish-tank-plastic-white', color: 'أبيض', isDefault: true },
            { id: 'houyi-aquarium-fish-tank-plastic-green', color: 'أخضر' },
        ]
    },
];

async function mergeProductsToVariants() {
    const db = getDb();
    if (!db) {
        console.error('❌ Database not configured');
        return;
    }

    console.log('🔄 Merging Houyi products into variants...\n');

    for (const group of variantGroups) {
        console.log(`\n📦 Processing: ${group.baseName}`);

        try {
            // Get all products in this group
            const productIds = group.products.map(p => p.id);
            const dbProducts = await db
                .select()
                .from(products)
                .where(inArray(products.id, productIds));

            if (dbProducts.length === 0) {
                console.log(`  ⚠️  No products found`);
                continue;
            }

            // Find the main product
            const mainProduct = dbProducts.find(p => p.id === group.mainProductId);
            if (!mainProduct) {
                console.log(`  ❌ Main product not found: ${group.mainProductId}`);
                continue;
            }

            // Create variants from all products
            const variants: ProductVariant[] = [];

            for (const productConfig of group.products) {
                const dbProduct = dbProducts.find(p => p.id === productConfig.id);
                if (!dbProduct) continue;

                // Create variant label
                let label = '';
                if (productConfig.size && productConfig.color) {
                    label = `${productConfig.size} - ${productConfig.color}`;
                } else if (productConfig.size) {
                    label = productConfig.size;
                } else if (productConfig.color) {
                    label = productConfig.color;
                }

                const variant: ProductVariant = {
                    id: productConfig.size || productConfig.color || 'default',
                    label,
                    price: parseInt(dbProduct.price),
                    stock: dbProduct.stock,
                    isDefault: productConfig.isDefault || false,
                    specifications: {
                        ...(productConfig.size ? { 'الحجم': productConfig.size } : {}),
                        ...(productConfig.color ? { 'اللون': productConfig.color } : {}),
                    }
                };

                variants.push(variant);
            }

            // Update main product with variants
            await db
                .update(products)
                .set({
                    hasVariants: true,
                    variants,
                    name: group.baseName, // Use base name
                    updatedAt: new Date(),
                })
                .where(eq(products.id, group.mainProductId));

            console.log(`  ✅ Updated main product with ${variants.length} variants`);

            // Delete other products
            const productsToDelete = group.products
                .filter(p => p.id !== group.mainProductId)
                .map(p => p.id);

            if (productsToDelete.length > 0) {
                await db
                    .delete(products)
                    .where(inArray(products.id, productsToDelete));

                console.log(`  🗑️  Deleted ${productsToDelete.length} duplicate products`);
            }

        } catch (error) {
            console.error(`  ❌ Error processing ${group.baseName}:`, error);
        }
    }

    console.log('\n✨ Merge completed!');
}

mergeProductsToVariants()
    .then(() => {
        console.log('\n🎉 Done!');
        process.exit(0);
    })
    .catch(err => {
        console.error('\n💥 Error:', err);
        process.exit(1);
    });
