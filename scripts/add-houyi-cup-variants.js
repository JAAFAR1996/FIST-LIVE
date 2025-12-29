/**
 * Script to add color variants to HOUYI Feeding Cup product
 * Run this script to add green and white color options
 */

const PRODUCT_NAME = "HOUYI كوب تغذية";

// Variants configuration
const variants = [
    {
        id: "green",
        label: "أخضر",
        price: 0, // Will use product's base price
        stock: 50, // Adjust as needed
        isDefault: true,
        specifications: {
            color: "أخضر",
            colorCode: "#4CAF50"
        }
    },
    {
        id: "white",
        label: "أبيض",
        price: 0, // Will use product's base price
        stock: 50, // Adjust as needed
        isDefault: false,
        specifications: {
            color: "أبيض",
            colorCode: "#FFFFFF"
        }
    }
];

async function addVariantsToProduct() {
    try {
        console.log(`🔍 Searching for product: ${PRODUCT_NAME}...`);

        // 1. Find the product
        const response = await fetch('http://localhost:5000/api/products');
        const products = await response.json();

        const product = products.find(p =>
            p.name.includes("كوب تغذية") && p.brand === "HOUYI"
        );

        if (!product) {
            console.error("❌ Product not found!");
            console.log("Available HOUYI products:");
            products.filter(p => p.brand === "HOUYI").forEach(p => {
                console.log(`  - ${p.name} (ID: ${p.id})`);
            });
            return;
        }

        console.log(`✅ Found product: ${product.name}`);
        console.log(`   ID: ${product.id}`);

        // 2. Update variants with actual price
        const variantsWithPrice = variants.map(v => ({
            ...v,
            price: parseFloat(product.price),
            originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : undefined
        }));

        // 3. Update product with variants
        console.log(`\n🔄 Adding ${variants.length} color variants...`);

        const updateResponse = await fetch(`http://localhost:5000/api/products/${product.id}/variants`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                // Add admin authentication if needed
            },
            body: JSON.stringify({
                hasVariants: true,
                variants: variantsWithPrice
            })
        });

        if (!updateResponse.ok) {
            const error = await updateResponse.text();
            throw new Error(`Failed to update product: ${error}`);
        }

        console.log(`\n✅ Successfully added color variants!`);
        console.log(`\nVariants added:`);
        variantsWithPrice.forEach(v => {
            console.log(`  ✓ ${v.label} (${v.id})`);
            console.log(`    Price: ${v.price.toLocaleString()} د.ع`);
            console.log(`    Stock: ${v.stock} قطعة`);
        });

        console.log(`\n🎨 Next steps:`);
        console.log(`1. Go to /admin and edit the product`);
        console.log(`2. Assign images to each variant (green and white)`);
        console.log(`3. Save the changes`);

    } catch (error) {
        console.error("\n❌ Error:", error.message);
    }
}

// Run the script
addVariantsToProduct();
