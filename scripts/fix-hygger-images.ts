/**
 * Check and fix product images for HYGGER products
 */
import { getDb } from "../server/db";
import { products } from "../shared/schema";
import { eq } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

const db = getDb();
if (!db) {
    console.error("❌ Database connection failed");
    process.exit(1);
}

// Image folder path
const IMAGE_BASE_PATH = "client/public/images/products/hygger";

// Mapping of product ID patterns to image folders
const productImageFolders: Record<string, string> = {
    "hygger-hg978": "hg978",
    "hygger-hg957": "hg957",
    "hygger-hg085": "hg085",
    "hygger-hg101": "hg101",
    "hygger-hg153": "hg153",
    "hygger-hg150": "hg150",
    "hygger-hg037": "hg037",
    "hygger-hc004": "hc004",
    "hygger-hg124": "hg124",
    "hygger-hg006": "hg006",
    "hygger-hg073": "hg073",
    "hygger-hg030": "hg030",
    "hygger-hgy0001m": "hgy0001m",
    "hygger-hg087": "hg087",
    "hygger-hg958": "hg958",
    "hygger-hg953": "hg953",
    "hygger-hg239": "hg239",
};

async function checkAndFixImages() {
    console.log("\n🔍 Checking HYGGER product images...\n");

    // Get all HYGGER products
    const allProducts = await db.select().from(products).where(eq(products.brand, "HYGGER"));
    console.log(`Found ${allProducts.length} HYGGER products\n`);

    let fixed = 0;

    for (const product of allProducts) {
        // Find the matching folder
        let folder = "";
        for (const [pattern, folderName] of Object.entries(productImageFolders)) {
            if (product.id.toLowerCase().startsWith(pattern.toLowerCase()) ||
                product.slug.toLowerCase().includes(folderName.toLowerCase())) {
                folder = folderName;
                break;
            }
        }

        if (!folder) {
            // Try extracting from slug
            const match = product.slug.match(/hg\d{3}|hc\d{3}|hgy\d+m/i);
            if (match) {
                folder = match[0].toLowerCase();
            }
        }

        if (!folder) {
            console.log(`⏭️  No folder mapping for: ${product.slug}`);
            continue;
        }

        const folderPath = path.join(IMAGE_BASE_PATH, folder);

        // Check if folder exists
        if (!fs.existsSync(folderPath)) {
            console.log(`❌ Folder not found: ${folderPath}`);
            continue;
        }

        // Get all images in folder
        const files = fs.readdirSync(folderPath);
        const imageFiles = files.filter(f => /\.(png|jpg|jpeg|webp|gif)$/i.test(f));

        if (imageFiles.length === 0) {
            console.log(`❌ No images in: ${folderPath}`);
            continue;
        }

        // Sort by filename (1.png, 2.png, etc.)
        imageFiles.sort((a, b) => {
            const numA = parseInt(a.match(/\d+/)?.[0] || "0");
            const numB = parseInt(b.match(/\d+/)?.[0] || "0");
            return numA - numB;
        });

        // Create image URLs
        const imageUrls = imageFiles.map(f => `/images/products/hygger/${folder}/${f}`);
        const thumbnail = imageUrls[0];

        // Check if update needed
        const currentImagesCount = (product.images as string[])?.length || 0;

        if (currentImagesCount < imageFiles.length) {
            console.log(`📸 ${product.name}: ${currentImagesCount} → ${imageFiles.length} images`);

            await db.update(products)
                .set({
                    images: imageUrls,
                    thumbnail: thumbnail,
                    updatedAt: new Date(),
                })
                .where(eq(products.id, product.id));

            console.log(`   ✅ Updated with ${imageFiles.length} images`);
            fixed++;
        } else {
            console.log(`✓ ${product.name}: ${currentImagesCount} images OK`);
        }
    }

    console.log(`\n✅ Fixed ${fixed} products`);
}

checkAndFixImages()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error("Error:", err);
        process.exit(1);
    });
