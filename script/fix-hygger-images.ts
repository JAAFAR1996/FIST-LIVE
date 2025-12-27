/**
 * Fix HYGGER HG978-18W images with working URLs
 * Run: npx tsx script/fix-hygger-images.ts
 */

import { neon } from "@neondatabase/serverless";

const DATABASE_URL = "postgresql://neondb_owner:npg_N7dEzt2pWjCi@ep-quiet-moon-a4h7tdze-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require";

const sql = neon(DATABASE_URL);

async function fixHyggerImages() {
    console.log("🔧 Fixing HYGGER HG978-18W images...");

    // Using placeholder images that work (Unsplash aquarium LED light images)
    const workingImages = [
        "https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=800&q=80", // Aquarium with LED
        "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=800&q=80", // Fish in lit tank
        "https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?w=800&q=80", // Aquarium setup
        "https://images.unsplash.com/photo-1559825481-12a05cc00344?w=800&q=80", // Tropical aquarium
    ];

    try {
        const updateResult = await sql`
            UPDATE products 
            SET 
                images = ${JSON.stringify(workingImages)}::jsonb,
                thumbnail = ${workingImages[0]},
                updated_at = NOW()
            WHERE id = 'hygger-hg978-18w'
            RETURNING id, name, images
        `;

        if (updateResult.length > 0) {
            console.log("✅ Successfully updated product:", updateResult[0].name);
            console.log("📸 New images:", updateResult[0].images);
        } else {
            console.log("❌ Product not found");
        }

    } catch (error) {
        console.error("❌ Error:", error);
    }
}

fixHyggerImages();
