/**
 * Migrate HYGGER products to use variants system
 * Consolidates multiple size products into single products with variants
 */
import { getDb } from "../server/db";
import { products } from "../shared/schema";
import { eq, like, sql } from "drizzle-orm";

const db = getDb();
if (!db) {
    console.error("❌ Database connection failed");
    process.exit(1);
}

interface ProductVariant {
    id: string;
    label: string;
    price: number;
    originalPrice?: number;
    stock: number;
    isDefault?: boolean;
    specifications?: Record<string, any>;
}

// Define variant groups - products that should be consolidated
const variantGroups = [
    {
        baseName: "إضاءة هيغر LED بالطيف الكامل",
        variantType: "watt", // Extract wattage
    },
    {
        baseName: "فلتر هيغر غاطس 4 في 1",
        variantType: "watt",
    },
    {
        baseName: "فلتر هيغر كانيستر مع معقم UV",
        variantType: "flow", // Extract flow rate
    },
    {
        baseName: "إضاءة هيغر LED RGB مع متحكم خارجي",
        variantType: "watt",
    },
    {
        baseName: "منظف زجاج هيغر مغناطيسي",
        variantType: "size", // Extract size name
    },
    {
        baseName: "خلفية حوض هيغر كهروستاتيكية",
        variantType: "size",
    },
];

// Extract variant label from product name
function getVariantLabel(name: string, type: string): string {
    if (type === "watt") {
        const match = name.match(/(\d+)\s*واط/);
        return match ? `${match[1]} واط` : name;
    }
    if (type === "flow") {
        const match = name.match(/(\d+)\s*لتر\/ساعة/);
        return match ? `${match[1]} ل/س` : name;
    }
    if (type === "size") {
        const match = name.match(/-\s*(صغير|متوسط|كبير|كبير جداً)$/);
        return match ? match[1] : name;
    }
    return name;
}

// Get variant ID from label
function getVariantId(label: string): string {
    const sizeMap: Record<string, string> = {
        "صغير": "S",
        "متوسط": "M",
        "كبير": "L",
        "كبير جداً": "XL",
    };
    if (sizeMap[label]) return sizeMap[label];

    // For wattage, use the number
    const num = label.match(/\d+/);
    return num ? num[0] : label;
}

async function migrateProducts() {
    console.log("\n🔄 Starting HYGGER products migration...\n");

    // Get all HYGGER products
    const allProducts = await db.select().from(products).where(eq(products.brand, "HYGGER"));
    console.log(`Found ${allProducts.length} HYGGER products\n`);

    let consolidated = 0;
    let deleted = 0;

    for (const group of variantGroups) {
        // Find products matching this group
        const groupProducts = allProducts.filter(p =>
            p.name.startsWith(group.baseName)
        );

        if (groupProducts.length <= 1) {
            console.log(`⏭️  ${group.baseName}: Only ${groupProducts.length} product, skipping`);
            continue;
        }

        console.log(`\n📦 Processing: ${group.baseName}`);
        console.log(`   Found ${groupProducts.length} variants`);

        // Sort by price to find most popular (middle price = default)
        groupProducts.sort((a, b) => Number(a.price) - Number(b.price));
        const defaultIndex = Math.floor(groupProducts.length / 2);

        // Create variants array
        const variants: ProductVariant[] = groupProducts.map((p, i) => ({
            id: getVariantId(getVariantLabel(p.name, group.variantType)),
            label: getVariantLabel(p.name, group.variantType),
            price: Number(p.price),
            originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
            stock: p.stock,
            isDefault: i === defaultIndex,
            specifications: p.specifications as Record<string, any>,
        }));

        console.log(`   Variants: ${variants.map(v => v.label).join(", ")}`);

        // Use first product as the main one, update its name
        const mainProduct = groupProducts[0];
        const defaultVariant = variants.find(v => v.isDefault) || variants[0];

        // Update main product with variants
        await db.update(products)
            .set({
                name: group.baseName, // Remove size suffix
                price: defaultVariant.price.toString(),
                stock: variants.reduce((sum, v) => sum + v.stock, 0), // Total stock
                variants: variants,
                hasVariants: true,
                updatedAt: new Date(),
            })
            .where(eq(products.id, mainProduct.id));

        console.log(`   ✅ Updated: ${mainProduct.id}`);
        consolidated++;

        // Delete other products in the group
        for (let i = 1; i < groupProducts.length; i++) {
            await db.delete(products).where(eq(products.id, groupProducts[i].id));
            console.log(`   🗑️  Deleted: ${groupProducts[i].id}`);
            deleted++;
        }
    }

    console.log(`\n✅ Migration complete!`);
    console.log(`   Consolidated: ${consolidated} product groups`);
    console.log(`   Deleted: ${deleted} duplicate products`);
}

migrateProducts()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error("Migration failed:", err);
        process.exit(1);
    });
