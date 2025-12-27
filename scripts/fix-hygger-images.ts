
import { getDb } from "../server/db";
import { products } from "../shared/schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("Starting product image update...");

  const db = getDb();
  if (!db) {
    console.error("Failed to initialize database connection. Check DATABASE_URL.");
    process.exit(1);
  }

  const productSlug = "hygger-black-knight-cleaning-kit";

  // New images path based on where we copied them
  const newImages = [
    "/images/products/hygger/cleaning-kit/hygger-black-knight-cleaning-kit2.jpg", // Main View
    "/images/products/hygger/cleaning-kit/hygger-black-knight-cleaning-kit3.webp", // Parts
    "/images/products/hygger/cleaning-kit/hygger-black-knight-cleaning-kit5.webp", // Usage
    "/images/products/hygger/cleaning-kit/hygger-black-knight-cleaning-kit6.webp", // Features
  ];

  try {
    const result = await db
      .update(products)
      .set({
        images: newImages,
        thumbnail: newImages[0],
      })
      .where(eq(products.slug, productSlug))
      .returning();

    if (result.length > 0) {
      console.log(`Successfully updated product: ${result[0].name} `);
      console.log(`New images count: ${result[0].images.length} `);
    } else {
      console.error(`Product with slug '${productSlug}' not found!`);

      // Try searching for it if exact slug matches failed
      console.log("Searching for similar products...");
      const allProducts = await db.query.products.findMany();
      const match = allProducts.find(p => p.slug.includes("cleaning") || p.name.includes("تنظيف"));
      if (match) {
        console.log(`Did you mean: ${match.name} (Slug: ${match.slug})?`);
      }
    }
  } catch (error) {
    console.error("Error updating product:", error);
  }

  process.exit(0);
}

main();
