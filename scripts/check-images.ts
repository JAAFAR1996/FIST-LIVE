import { getDb } from "../server/db";
import { products } from "../shared/schema";
import { like } from "drizzle-orm";

const db = getDb()!;

async function check() {
    const prods = await db
        .select({
            name: products.name,
            slug: products.slug,
            images: products.images,
            thumbnail: products.thumbnail,
        })
        .from(products)
        .where(like(products.slug, "%aquascaping%"));

    console.log(JSON.stringify(prods, null, 2));
    process.exit(0);
}

check();
