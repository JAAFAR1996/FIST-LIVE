const XLSX = require('xlsx');
const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function main() {
    // Get all products from database
    const dbProducts = await sql`SELECT name, brand FROM products WHERE deleted_at IS NULL`;
    const dbProductNames = new Set(dbProducts.map((p) => p.name?.toLowerCase().trim()));

    console.log(`\n📊 المنتجات في قاعدة البيانات: ${dbProducts.length}\n`);
    console.log('='.repeat(70));

    const allMissingProducts = [];

    // ===== FILE 1: MG-TP20251227-updated (HYGGER) =====
    console.log('\n📁 ملف HYGGER (MG-TP20251227-updated (2).xlsm):\n');
    try {
        const wb1 = XLSX.readFile('MG-TP20251227-updated (2).xlsm');
        const ws1 = wb1.Sheets[wb1.SheetNames[0]];
        const data1 = XLSX.utils.sheet_to_json(ws1, { header: 1 });

        // Find header row and actual products (skip company info)
        let foundProducts = 0;
        let lastProductName = '';

        for (let i = 14; i < data1.length; i++) {
            const row = data1[i];
            if (!row || row.length === 0) continue;

            const productName = row[0]; // First column is Product Name
            const itemNo = row[3]; // Item No is 4th column

            // If first column has product name, remember it
            if (productName && typeof productName === 'string' && productName.trim() && !productName.includes('Bank') && !productName.includes('Total')) {
                lastProductName = productName.trim();
            }

            // If we have an Item No (like HG-978-18W), this is a product row
            if (itemNo && typeof itemNo === 'string' && itemNo.startsWith('HG')) {
                const fullName = `${lastProductName} ${itemNo}`.trim();
                if (!dbProductNames.has(fullName.toLowerCase())) {
                    allMissingProducts.push({ name: fullName, brand: 'HYGGER', source: 'HYGGER' });
                    console.log(`   ❌ ${fullName}`);
                    foundProducts++;
                }
            }
        }
        console.log(`\n   المنتجات غير الموجودة: ${foundProducts}`);
    } catch (e) {
        console.log(`   خطأ: ${e.message}`);
    }

    // ===== FILE 2: Binzhou_Houyi =====
    console.log('\n' + '='.repeat(70));
    console.log('\n📁 ملف Binzhou_Houyi:\n');
    try {
        const wb2 = XLSX.readFile('Binzhou_Houyi (1) (1).xlsx');
        const ws2 = wb2.Sheets[wb2.SheetNames[0]];
        const data2 = XLSX.utils.sheet_to_json(ws2, { header: 1 });

        let foundProducts = 0;

        for (let i = 1; i < data2.length; i++) { // Skip header
            const row = data2[i];
            if (!row || row.length === 0) continue;

            // First column should be product name
            const productName = row[0];
            if (productName && typeof productName === 'string' && productName.trim()) {
                if (!dbProductNames.has(productName.toLowerCase().trim())) {
                    allMissingProducts.push({ name: productName.trim(), brand: 'HOUYI', source: 'Binzhou_Houyi' });
                    console.log(`   ❌ ${productName.trim()}`);
                    foundProducts++;
                }
            }
        }
        console.log(`\n   المنتجات غير الموجودة: ${foundProducts}`);
    } catch (e) {
        console.log(`   خطأ: ${e.message}`);
    }

    // ===== FILE 3: YEE (客户伊拉克Jaafar) =====
    console.log('\n' + '='.repeat(70));
    console.log('\n📁 ملف YEE (客户伊拉克Jaafar-1.3):\n');
    try {
        const wb3 = XLSX.readFile('客户伊拉克Jaafar-1.3 (1).xlsx');

        // Check all sheets
        let foundProducts = 0;
        for (const sheetName of wb3.SheetNames) {
            const ws3 = wb3.Sheets[sheetName];
            const data3 = XLSX.utils.sheet_to_json(ws3, { header: 1 });

            for (let i = 0; i < data3.length; i++) {
                const row = data3[i];
                if (!row || row.length < 2) continue;

                // Look for product names - usually have Item No or specific format
                const col0 = row[0];
                const col1 = row[1];
                const col2 = row[2];

                // Skip rows that look like headers or metadata
                if (col0 && typeof col0 === 'string') {
                    const lower = col0.toLowerCase();
                    if (lower.includes('invoice') || lower.includes('add:') || lower.includes('shipping') ||
                        lower.includes('payment') || lower.includes('total') || lower.includes('item')) {
                        continue;
                    }
                }

                // Check if this looks like a product row (has item number in first columns)
                let productName = null;
                if (col1 && typeof col1 === 'string' && col1.trim().length > 5 && !col1.includes('@')) {
                    productName = col1.trim();
                } else if (col2 && typeof col2 === 'string' && col2.trim().length > 5 && !col2.includes('@')) {
                    productName = col2.trim();
                }

                if (productName && !dbProductNames.has(productName.toLowerCase())) {
                    allMissingProducts.push({ name: productName, brand: 'YEE', source: 'YEE' });
                    console.log(`   ❌ ${productName}`);
                    foundProducts++;
                }
            }
        }
        console.log(`\n   المنتجات غير الموجودة: ${foundProducts}`);
    } catch (e) {
        console.log(`   خطأ: ${e.message}`);
    }

    // ===== SUMMARY =====
    console.log('\n' + '='.repeat(70));
    console.log('\n📋 الملخص النهائي:');
    console.log(`   إجمالي المنتجات غير الموجودة: ${allMissingProducts.length}`);

    // Group by brand
    const byBrand = {};
    for (const p of allMissingProducts) {
        if (!byBrand[p.brand]) byBrand[p.brand] = [];
        byBrand[p.brand].push(p);
    }

    console.log('\n   حسب العلامة التجارية:');
    for (const [brand, products] of Object.entries(byBrand)) {
        console.log(`   - ${brand}: ${products.length} منتج`);
    }
}

main().catch(console.error);
