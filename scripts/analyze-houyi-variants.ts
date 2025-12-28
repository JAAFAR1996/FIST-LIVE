import { getDb } from '../server/db.js';
import { products } from '../shared/schema.js';
import { eq, like, or } from 'drizzle-orm';

async function analyzeProductsForVariants() {
    const db = getDb();
    if (!db) {
        console.error('❌ Database not configured');
        return;
    }

    console.log('🔍 Analyzing Houyi products for variant grouping...\n');

    // Get all Houyi products
    const houyiProducts = await db
        .select()
        .from(products)
        .where(eq(products.brand, 'Houyi'));

    // Group products by base name (without size/color)
    const groups = new Map<string, typeof houyiProducts>();

    for (const product of houyiProducts) {
        // Extract base name (remove size indicators)
        let baseName = product.name
            .replace(/\d+-\d+cm/gi, '[SIZE]')  // 10-15cm → [SIZE]
            .replace(/\d+cm/gi, '[SIZE]')       // 50cm → [SIZE]
            .replace(/\d+mm/gi, '[SIZE]')       // 4mm → [SIZE]
            .replace(/\d+g/gi, '[SIZE]')        // 50g → [SIZE]
            .replace(/\d+ML/gi, '[SIZE]')       // 20ML → [SIZE]
            .replace(/BLACK|WHITE|GREEN|RED|blue|brown|grey/gi, '[COLOR]')
            .replace(/small|medium|large|MEDIAM/gi, '[SIZE]')
            .replace(/\(.*?\)/g, '')            // Remove parentheses
            .replace(/\s+/g, ' ')
            .trim();

        if (!groups.has(baseName)) {
            groups.set(baseName, []);
        }
        groups.get(baseName)!.push(product);
    }

    console.log('📊 Found product groups:\n');

    // Filter groups that have multiple products (potential variants)
    const variantGroups = Array.from(groups.entries())
        .filter(([_, prods]) => prods.length > 1)
        .sort((a, b) => b[1].length - a[1].length);

    for (const [baseName, prods] of variantGroups) {
        console.log(`\n🔹 ${baseName}`);
        console.log(`   Products: ${prods.length}`);
        for (const p of prods) {
            console.log(`   - ${p.name} (${p.price} IQD, Stock: ${p.stock})`);
        }
    }

    console.log(`\n\n✨ Summary:`);
    console.log(`Total products: ${houyiProducts.length}`);
    console.log(`Groups with variants: ${variantGroups.length}`);
    console.log(`Total variants: ${variantGroups.reduce((sum, [_, prods]) => sum + prods.length, 0)}`);

    return variantGroups;
}

analyzeProductsForVariants()
    .then(() => {
        console.log('\n🎉 Analysis complete!');
        process.exit(0);
    })
    .catch(err => {
        console.error('\n💥 Error:', err);
        process.exit(1);
    });
