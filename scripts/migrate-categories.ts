
import { getDb } from "../server/db";
import { products, categories } from "../shared/schema";
import { eq } from "drizzle-orm";

async function migrateCategories() {
  console.log("🚀 Starting Category Migration...");

  const db = getDb();
  if (!db) {
    throw new Error("Database connection failed. Ensure DATABASE_URL is set.");
  }

  // 1. Fetch all products
  const allProducts = await db.select().from(products);
  console.log(`📦 Found ${allProducts.length} products.`);

  // 2. Extract unique categories (using the string column)
  const uniqueCategories = new Set<string>();
  allProducts.forEach((p) => {
    if (p.category) {
      uniqueCategories.add(p.category);
    }
  });

  console.log(`🏷️ Found ${uniqueCategories.size} unique categories:`, [...uniqueCategories]);

  // 3. Insert or Get Categories
  const categoryMap = new Map<string, string>(); // Name -> ID

  for (const catName of uniqueCategories) {
    if (!catName) continue;

    // Check if exists
    let [existingCat] = await db
      .select()
      .from(categories)
      .where(eq(categories.name, catName));

    if (!existingCat) {
      console.log(`✨ Creating new category: ${catName}`);
      try {
        const [newCat] = await db
          .insert(categories)
          .values({
            name: catName,
            displayName: catName, // Default to same name, can be updated later
            isActive: true,
          })
          .returning();
        existingCat = newCat;
      } catch (e) {
        console.log(`⚠️ Could not insert category ${catName}, might already exist (race condition). Fetching again.`);
        const [retryCat] = await db.select().from(categories).where(eq(categories.name, catName));
        existingCat = retryCat;
      }
    }

    if (existingCat) {
      categoryMap.set(catName, existingCat.id);
    }
  }

  // 4. Update Products with new Category ID
  let updatedCount = 0;
  for (const product of allProducts) {
    if (product.category && !product.categoryId) {
      const newCatId = categoryMap.get(product.category);
      if (newCatId) {
        await db
          .update(products)
          .set({ categoryId: newCatId })
          .where(eq(products.id, product.id));
        updatedCount++;
      }
    }
  }

  console.log(`✅ Migration Complete! Updated ${updatedCount} products with Category IDs.`);
  process.exit(0);
}

migrateCategories().catch((err) => {
  console.error("❌ Migration Failed:", err);
  process.exit(1);
});
