const XLSX = require('xlsx');
const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

interface ExcelProduct {
    name: string;
    brand?: string;
    source: string;
}

async function main() {
    // Get all products from database
    const dbProducts = await sql`SELECT name, brand FROM products WHERE deleted_at IS NULL`;
    const dbProductNames = new Set(dbProducts.map((p: any) => p.name?.toLowerCase().trim()));

    console.log(`\n📊 المنتجات في قاعدة البيانات: ${dbProducts.length}\n`);

    const files = [
        'Binzhou_Houyi (1) (1).xlsx',
        'MG-TP20251227-updated (2).xlsm',
        '客户伊拉克Jaafar-1.3 (1).xlsx'
    ];

    const allExcelProducts: ExcelProduct[] = [];
    const missingProducts: ExcelProduct[] = [];

    for (const file of files) {
        try {
            const wb = XLSX.readFile(file);
            const ws = wb.Sheets[wb.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json(ws) as any[];

            console.log(`\n📁 ${file}:`);
            console.log(`   إجمالي الصفوف: ${data.length}`);

            // Try to find name column (could be different names)
            const nameColumns = ['name', 'Name', 'اسم المنتج', 'Product Name', 'المنتج', 'عنوان المنتج'];
            const brandColumns = ['brand', 'Brand', 'العلامة التجارية', 'الماركة'];

            let foundNameCol = '';
            let foundBrandCol = '';

            if (data.length > 0) {
                const firstRow = data[0];
                for (const col of nameColumns) {
                    if (firstRow[col] !== undefined) {
                        foundNameCol = col;
                        break;
                    }
                }
                for (const col of brandColumns) {
                    if (firstRow[col] !== undefined) {
                        foundBrandCol = col;
                        break;
                    }
                }

                // If no standard column found, show available columns
                if (!foundNameCol) {
                    console.log(`   ⚠️ أعمدة متوفرة: ${Object.keys(firstRow).join(', ')}`);
                }
            }

            let fileMissing = 0;
            let fileExisting = 0;

            for (const row of data) {
                const name = row[foundNameCol] || row['name'] || row['Product Name'] || row['المنتج'] || Object.values(row)[0];
                const brand = row[foundBrandCol] || row['brand'] || '';

                if (name && typeof name === 'string' && name.trim()) {
                    const product: ExcelProduct = {
                        name: name.trim(),
                        brand: brand?.toString().trim(),
                        source: file
                    };

                    allExcelProducts.push(product);

                    // Check if exists in database
                    if (!dbProductNames.has(name.toLowerCase().trim())) {
                        missingProducts.push(product);
                        fileMissing++;
                    } else {
                        fileExisting++;
                    }
                }
            }

            console.log(`   ✅ موجود في قاعدة البيانات: ${fileExisting}`);
            console.log(`   ❌ غير موجود: ${fileMissing}`);

        } catch (e: any) {
            console.log(`   ❌ خطأ: ${e.message}`);
        }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`\n📋 ملخص التحليل:`);
    console.log(`   إجمالي المنتجات في الملفات: ${allExcelProducts.length}`);
    console.log(`   موجود في قاعدة البيانات: ${allExcelProducts.length - missingProducts.length}`);
    console.log(`   غير موجود (يحتاج استيراد): ${missingProducts.length}`);

    if (missingProducts.length > 0) {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`\n❌ المنتجات غير الموجودة في قاعدة البيانات:\n`);

        // Group by source file
        const bySource: Record<string, ExcelProduct[]> = {};
        for (const p of missingProducts) {
            if (!bySource[p.source]) bySource[p.source] = [];
            bySource[p.source].push(p);
        }

        for (const [source, products] of Object.entries(bySource)) {
            console.log(`\n📁 من ${source} (${products.length} منتج):`);
            products.forEach((p, i) => {
                console.log(`   ${i + 1}. ${p.name}${p.brand ? ` [${p.brand}]` : ''}`);
            });
        }
    }
}

main().catch(console.error);
