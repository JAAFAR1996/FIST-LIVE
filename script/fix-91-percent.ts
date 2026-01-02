import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.production' });

const sql = neon(process.env.DATABASE_URL!);

async function updateProduct() {
    // Find products with 91% in description
    const products = await sql`
    SELECT id, name, description 
    FROM products 
    WHERE description LIKE '%91%' 
    OR name LIKE '%91%'
  `;
    console.log('Products with 91%:', JSON.stringify(products, null, 2));

    if (products.length > 0) {
        // Update 91% to 93%
        for (const product of products) {
            const newDescription = product.description?.replace(/91%/g, '93%') || '';
            await sql`
        UPDATE products 
        SET description = ${newDescription}
        WHERE id = ${product.id}
      `;
            console.log(`Updated product ${product.id}: ${product.name}`);
        }
    }
}

updateProduct().then(() => {
    console.log('Done!');
    process.exit(0);
}).catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
