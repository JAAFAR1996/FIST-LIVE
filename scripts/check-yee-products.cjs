const XLSX = require('xlsx');
const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function main() {
    // Get all YEE products from database
    const dbProducts = await sql`SELECT name FROM products WHERE deleted_at IS NULL AND brand = 'YEE'`;
    const dbNames = new Set(dbProducts.map(p => p.name?.toLowerCase().trim()));

    console.log(`\n📊 منتجات YEE في قاعدة البيانات: ${dbProducts.length}\n`);

    // Read Excel file
    const wb = XLSX.readFile('客户伊拉克Jaafar-1.3 (1).xlsx');
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

    const excelProducts = [];
    const missingProducts = [];

    // Start from row 9 (products start there)
    for (let i = 9; i < data.length; i++) {
        const row = data[i];
        if (row && row[5] && typeof row[5] === 'string' && row[5].trim().length > 3) {
            const productName = row[5].trim();
            excelProducts.push(productName);

            if (!dbNames.has(productName.toLowerCase().trim())) {
                missingProducts.push(productName);
            }
        }
    }

    console.log(`📋 منتجات YEE في ملف Excel: ${excelProducts.length}`);
    console.log(`✅ موجود في قاعدة البيانات: ${excelProducts.length - missingProducts.length}`);
    console.log(`❌ غير موجود (يحتاج استيراد): ${missingProducts.length}`);

    if (missingProducts.length > 0) {
        console.log('\n' + '='.repeat(60));
        console.log('\n❌ منتجات YEE غير الموجودة:\n');
        missingProducts.forEach((p, i) => {
            console.log(`   ${i + 1}. ${p}`);
        });
    }
}

main().catch(console.error);
