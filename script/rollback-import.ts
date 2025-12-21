import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
    console.error("❌ DATABASE_URL not found");
    process.exit(1);
}

const sql = neon(DATABASE_URL);

console.log("🗑️ جاري حذف المنتجات المضافة من Excel...\n");

try {
    // Count before delete
    const before = await sql`SELECT COUNT(*) as cnt FROM products`;
    console.log(`📊 عدد المنتجات قبل الحذف: ${before[0].cnt}`);

    // Delete products that start with 'p-'
    const deleted = await sql`DELETE FROM products WHERE id LIKE 'p-%' RETURNING id`;
    console.log(`🗑️ تم حذف: ${deleted.length} منتج`);

    // Count after delete
    const after = await sql`SELECT COUNT(*) as cnt FROM products`;
    console.log(`📊 عدد المنتجات بعد الحذف: ${after[0].cnt}`);

    console.log("\n✅ تم التراجع بنجاح!");
} catch (error: any) {
    console.error("❌ خطأ:", error.message);
}
