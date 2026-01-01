/**
 * Script to add YEE Fish Tank to database
 * Run with: npx tsx script/add-yee-tank.ts
 */

import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import * as schema from '../shared/schema.js';
import 'dotenv/config';

// Configure Neon WebSocket
neonConfig.webSocketConstructor = ws;

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    console.error('❌ DATABASE_URL is not set');
    process.exit(1);
}

const pool = new Pool({ connectionString: databaseUrl });
const db = drizzle(pool, { schema });

async function addProduct() {
    console.log('Adding YEE Fish Tank product...');

    const productData = {
        id: 'yee-tank-601515',
        slug: 'yee-bare-side-stream-tank-601515cm',
        name: 'YEE حوض سمك جانبي 60×15×15 سم مع مضخة مياه',
        brand: 'YEE',
        category: 'أحواض',
        subcategory: 'أحواض زجاجية',
        description: 'حوض أسماك زجاجي أنيق بتصميم جانبي مفتوح مع مضخة مياه مدمجة. مصنوع من زجاج عالي الجودة بسمك 6 مم. مثالي لتربية الأسماك الصغيرة والمتوسطة.',
        price: '65000',
        originalPrice: '75000',
        currency: 'IQD',
        images: [
            '/images/products/yee/Bare side stream tank 601515cm 6mm water pump/Gemini_Generated_Image_253dek253dek253d.png',
            '/images/products/yee/Bare side stream tank 601515cm 6mm water pump/Gemini_Generated_Image_feruw4feruw4feru.png',
            '/images/products/yee/Bare side stream tank 601515cm 6mm water pump/Gemini_Generated_Image_l68c7yl68c7yl68c.png',
            '/images/products/yee/Bare side stream tank 601515cm 6mm water pump/Gemini_Generated_Image_pqqyytpqqyytpqqy.png',
            '/images/products/yee/Bare side stream tank 601515cm 6mm water pump/Gemini_Generated_Image_sksqwjsksqwjsksq.png',
            '/images/products/yee/Bare side stream tank 601515cm 6mm water pump/Gemini_Generated_Image_w3ybrcw3ybrcw3yb.png',
            '/images/products/yee/Bare side stream tank 601515cm 6mm water pump/Gemini_Generated_Image_yets5myets5myets.png'
        ],
        thumbnail: '/images/products/yee/Bare side stream tank 601515cm 6mm water pump/Gemini_Generated_Image_253dek253dek253d.png',
        rating: '0',
        reviewCount: 0,
        stock: 10,
        lowStockThreshold: 5,
        isNew: true,
        isBestSeller: false,
        isProductOfWeek: false,
        hasVariants: false,
        specifications: {
            'النوع': 'حوض أسماك',
            'الأبعاد': '60×15×15 سم',
            'المادة': 'زجاج + ABS',
            'سمك الزجاج': '6 مم',
            'الشكل': 'مستطيل',
            'يشمل': 'مضخة مياه',
            'العلامة التجارية': 'YEE',
            'رقم الموديل': 'YEE-1270',
            'بلد المنشأ': 'الصين',
            'الموسم': 'جميع المواسم'
        }
    };

    try {
        const [newProduct] = await db.insert(schema.products).values(productData).returning();
        console.log(`✅ Product added with ID: ${newProduct.id}`);
        console.log('🎉 Done!');
    } catch (error) {
        console.error('❌ Error:', error);
    }

    await pool.end();
    process.exit(0);
}

addProduct();
