import { getDb } from "../server/db";
import { products } from "../shared/schema";
import { like } from "drizzle-orm";

const db = getDb()!;
await db.update(products)
    .set({
        images: [
            "/images/products/hygger/hgy0001m/1.png",
            "/images/products/hygger/hgy0001m/2.png",
            "/images/products/hygger/hgy0001m/3.png",
            "/images/products/hygger/hgy0001m/4.png",
            "/images/products/hygger/hgy0001m/5.png"
        ],
        thumbnail: "/images/products/hygger/hgy0001m/1.png",
    })
    .where(like(products.slug, "%black-knight%"));

console.log("✅ Fixed black-knight images");
process.exit(0);
