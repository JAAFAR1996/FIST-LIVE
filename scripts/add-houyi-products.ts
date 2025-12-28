import { readFile } from 'fs/promises';
import { copyFile, mkdir } from 'fs/promises';
import { dirname, join, basename } from 'path';
import { parse } from 'csv-parse/sync';
import { getDb } from '../server/db.js';
import { products as productsTable } from '../shared/schema.js';
import { readdir } from 'fs/promises';

// التحويل: 1 USD = 1310 IQD
const USD_TO_IQD = 1310;

// السعر الافتراضي للمنتجات بدون سعر
const DEFAULT_PRICE_USD = 1.0;
const DEFAULT_PRICE_IQD = DEFAULT_PRICE_USD * USD_TO_IQD;

// Mapping الفئات من CSV إلى الفئات الجديدة
const categoryMapping: Record<string, string> = {
    'tools': 'معدات',
    'Measurement & Thermometers': 'إكسسوارات',
    'Water filters': 'معدات',
    'decor': 'ديكور',
    'Substrates & Plant Soils': 'ديكور',
    'rock': 'ديكور',
    'Lighting': 'إضاءة',
    'Accessories': 'إكسسوارات',
    'Filter media': 'معدات',
    'Air Pumps': 'معدات',
    'New - Alibaba': 'إكسسوارات',
};

// وظيفة لإنشاء slug
function createSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

// وظيفة لإيجاد مجلد الصور
async function findImageFolder(productName: string, houyiDir: string): Promise<string | null> {
    try {
        const folders = await readdir(houyiDir, { withFileTypes: true });

        // محاولة مطابقة دقيقة
        const exactMatch = folders.find(
            f => f.isDirectory() && f.name.toLowerCase() === productName.toLowerCase()
        );

        if (exactMatch) {
            return exactMatch.name;
        }

        // محاولة مطابقة جزئية
        const partialMatch = folders.find(
            f => f.isDirectory() && (
                productName.toLowerCase().includes(f.name.toLowerCase().substring(0, 20)) ||
                f.name.toLowerCase().includes(productName.toLowerCase().substring(0, 20))
            )
        );

        if (partialMatch) {
            return partialMatch.name;
        }

        return null;
    } catch (error) {
        console.error(`Error finding folder for "${productName}":`, error);
        return null;
    }
}

// وظيفة لنسخ الصور
async function copyProductImages(
    sourceFolder: string,
    productSlug: string
): Promise<string[]> {
    const houyiDir = join(process.cwd(), 'Houyi');
    const sourcePath = join(houyiDir, sourceFolder);
    const targetDir = join(process.cwd(), 'client', 'public', 'images', 'products', 'houyi', productSlug);

    try {
        // إنشاء المجلد الهدف
        await mkdir(targetDir, { recursive: true });

        // قراءة الصور من المجلد المصدر
        const files = await readdir(sourcePath);
        const imageFiles = files.filter(f =>
            /\.(jpg|jpeg|png|webp|gif)$/i.test(f)
        );

        const copiedImages: string[] = [];

        for (const file of imageFiles) {
            const sourcefile = join(sourcePath, file);
            const targetFile = join(targetDir, file);

            await copyFile(sourcefile, targetFile);

            // المسار النسبي للاستخدام في قاعدة البيانات
            const relativePath = `/images/products/houyi/${productSlug}/${file}`;
            copiedImages.push(relativePath);
        }

        return copiedImages;
    } catch (error) {
        console.error(`Error copying images for "${productSlug}":`, error);
        return [];
    }
}

// الدالة الرئيسية
async function addHouyiProducts() {
    console.log('🚀 Starting Houyi products import...\n');

    // الحصول على قاعدة البيانات
    const db = getDb();
    if (!db) {
        console.error('❌ Database not configured!');
        return;
    }

    // قراءة CSV
    const csvPath = join(process.cwd(), 'houyi_products.csv');
    const csvContent = await readFile(csvPath, 'utf-8');

    const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
    });

    let successCount = 0;
    let skipCount = 0;
    const houyiDir = join(process.cwd(), 'Houyi');

    for (const record of records) {
        try {
            const productName = record['Product Name'];
            const categoryCSV = record['Category'];
            const priceUSD = parseFloat(record['Price USD']) || DEFAULT_PRICE_USD;
            const qty = parseInt(record['Qty']) || 10;

            // تحويل الفئة
            const category = categoryMapping[categoryCSV] || 'إكسسوارات';

            // إنشاء slug
            const slug = createSlug(productName);
            const id = `houyi-${slug}`;

            // إيجاد مجلد الصور
            const imageFolder = await findImageFolder(productName, houyiDir);

            let images: string[] = [];
            let thumbnail = '/logo_aquavo.png';

            if (imageFolder) {
                console.log(`📸 Found images for: ${productName}`);
                images = await copyProductImages(imageFolder, slug);

                if (images.length > 0) {
                    thumbnail = images[0];
                }
            } else {
                console.log(`⚠️  No images found for: ${productName}`);
            }

            // حساب السعر بالدينار العراقي
            const priceIQD = Math.round(priceUSD * USD_TO_IQD);

            // إنشاء وصف بسيط
            const description = `منتج ${productName} من علامة Houyi التجارية المعروفة. منتج عالي الجودة لأحواض الأسماك.`;

            // إضافة للداتابيز
            await db.insert(productsTable).values({
                id,
                slug,
                name: productName,
                brand: 'Houyi',
                category,
                subcategory: category,
                description,
                price: priceIQD.toString(),
                currency: 'IQD',
                images,
                thumbnail,
                rating: '4.5',
                reviewCount: 0,
                stock: qty,
                lowStockThreshold: 5,
                isNew: true,
                isBestSeller: false,
                isProductOfWeek: false,
                specifications: {
                    'العلامة التجارية': 'Houyi',
                    'المنشأ': 'الصين',
                },
                hasVariants: false,
            }).onConflictDoUpdate({
                target: productsTable.id,
                set: {
                    name: productName,
                    price: priceIQD.toString(),
                    stock: qty,
                    images,
                    thumbnail,
                    updatedAt: new Date(),
                },
            });

            successCount++;
            console.log(`✅ Added: ${productName} (${priceIQD} IQD, ${images.length} images)`);

        } catch (error) {
            console.error(`❌ Error adding product:`, error);
            skipCount++;
        }
    }

    console.log(`\n✨ Import completed!`);
    console.log(`✅ Successfully added: ${successCount} products`);
    console.log(`⚠️  Skipped: ${skipCount} products`);
}

// تشغيل
addHouyiProducts()
    .then(() => {
        console.log('\n🎉 Done!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Fatal error:', error);
        process.exit(1);
    });
