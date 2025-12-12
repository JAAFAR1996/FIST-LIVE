
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { storage } from "../server/storage";
import { getDb } from "../server/db";
import { products, userAddresses } from "../shared/schema";
import { eq } from "drizzle-orm";

async function runTest() {
  console.log("=== STARTING AUDIT FIXES VERIFICATION ===");

  try {
    // 1. Test Soft Delete for Products
    console.log("\n--- Testing Product Soft Delete ---");

    // Create a test product
    const product = await storage.createProduct({
      name: "Test Soft Delete Product",
      description: "This product should be soft deleted",
      price: "1000",
      stock: 5,
      brand: "TestBrand",
      category: "equipment",
      subcategory: "filters",
      images: [],
      thumbnail: "",
      specifications: {},
      isNew: true,
      isBestSeller: false,
      isProductOfWeek: false,
      slug: "test-soft-delete-" + Date.now()
    });
    console.log(`✓ Created product: ${product.id} (${product.name})`);

    // Verify it exists in getProducts
    let allProducts = await storage.getProducts({});
    const foundBefore = allProducts.find(p => p.id === product.id);
    if (!foundBefore) throw new Error("Product not found after creation");
    console.log("✓ Product visible in getProducts");

    // Delete it (Soft Delete)
    await storage.deleteProduct(product.id);
    console.log("✓ Called deleteProduct()");

    // Verify it is GONE from getProducts
    allProducts = await storage.getProducts({});
    const foundAfter = allProducts.find(p => p.id === product.id);
    if (foundAfter) throw new Error("Product still visible after soft delete!");
    console.log("✓ Product successfully hidden from getProducts (Soft Deleted)");

    // 2. Test User Addresses
    console.log("\n--- Testing User Addresses ---");

    // Get a user (or assume one exists, fallback to creating one if needed)
    let usersList = await storage.getUsers();
    let user = usersList[0];

    if (!user) {
      console.log("No users found, creating temporary user for test...");
      user = await storage.createUser({
        email: `testuser-${Date.now()}@example.com`,
        passwordHash: "hash",
        fullName: "Test User",
        role: "user"
      });
    }
    console.log(`Using user: ${user.id}`);

    const address = await storage.createUserAddress({
      userId: user.id,
      label: "Home",
      addressLine1: "123 Baghdad St",
      city: "Baghdad",
      country: "Iraq",
      isDefault: true
    });
    console.log(`✓ Created address: ${address.id}`);

    const addresses = await storage.getUserAddresses(user.id);
    if (addresses.length === 0) throw new Error("No addresses found for user");
    const foundAddr = addresses.find(a => a.id === address.id);
    if (!foundAddr) throw new Error("Created address not found in list");
    console.log("✓ Address successfully retrieved");

    console.log("\n=== VERIFICATION SUCCESSFUL ===");

  } catch (error) {
    console.error("\n❌ VERIFICATION FAILED:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

runTest();
