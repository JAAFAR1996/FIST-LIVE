
import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is not set in environment variables");
    process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function main() {
    console.log("🚀 Starting Database Schema Fix...");

    try {
        // 1. Create Categories Table
        console.log("Creating 'categories' table...");
        await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL UNIQUE,
        display_name TEXT NOT NULL,
        description TEXT,
        slug TEXT UNIQUE,
        image_url TEXT,
        parent_id TEXT,
        is_active BOOLEAN DEFAULT true,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `;

        // 2. Create Payments Table
        console.log("Creating 'payments' table...");
        await sql`
      CREATE TABLE IF NOT EXISTS payments (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id TEXT NOT NULL UNIQUE, -- Will add Reference later to allow table creation order independence
        amount NUMERIC NOT NULL,
        currency TEXT DEFAULT 'IQD',
        method TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        transaction_id TEXT,
        provider_response JSONB,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `;

        // 3. Create Order Items Relational Table (New Standard)
        console.log("Creating 'order_items_relational' table...");
        await sql`
      CREATE TABLE IF NOT EXISTS order_items_relational (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price_at_purchase NUMERIC NOT NULL,
        total_price NUMERIC NOT NULL,
        metadata JSONB
      );
    `;

        // 4. Create User Addresses Table
        console.log("Creating 'user_addresses' table...");
        await sql`
      CREATE TABLE IF NOT EXISTS user_addresses (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL,
        label TEXT,
        address_line1 TEXT NOT NULL,
        city TEXT NOT NULL,
        country TEXT DEFAULT 'Iraq',
        is_default BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `;

        // 5. Create Translations Table
        console.log("Creating 'translations' table...");
        await sql`
      CREATE TABLE IF NOT EXISTS translations (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        field TEXT NOT NULL,
        language TEXT NOT NULL,
        value TEXT NOT NULL
      );
    `;

        // 6. Create Gallery Prizes Table
        console.log("Creating 'gallery_prizes' table...");
        await sql`
      CREATE TABLE IF NOT EXISTS gallery_prizes (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        month TEXT NOT NULL UNIQUE,
        prize TEXT NOT NULL,
        discount_code TEXT,
        discount_percentage INTEGER,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `;

        // 7. Create Newsletter Subscriptions Table
        console.log("Creating 'newsletter_subscriptions' table...");
        await sql`
      CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT NOT NULL UNIQUE,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      );
    `;

        // --- UPDATING EXISTING TABLES ---

        // 8. Update Users Table
        console.log("Updating 'users' table columns...");
        await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE`;
        await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS loyalty_points INTEGER DEFAULT 0`;
        await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS loyalty_tier TEXT DEFAULT 'bronze'`;

        // 9. Update Products Table
        console.log("Updating 'products' table columns...");
        await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS category_id TEXT`; // Reference added later
        await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS is_product_of_week BOOLEAN NOT NULL DEFAULT false`;
        await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS original_price NUMERIC`;

        // 10. Update Orders Table
        console.log("Updating 'orders' table columns...");
        await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_number TEXT UNIQUE`;
        await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_cost NUMERIC NOT NULL DEFAULT '0'`;
        await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_address JSONB`;
        await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_id TEXT`;
        await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_total NUMERIC DEFAULT '0'`;
        await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS items JSONB NOT NULL DEFAULT '[]'::jsonb`;

        // 11. Update Coupons Table
        console.log("Updating 'coupons' table columns...");
        await sql`ALTER TABLE coupons ADD COLUMN IF NOT EXISTS user_id TEXT`; // Reference added later

        // --- ADDING FOREIGN KEYS (Safe Mode) ---
        console.log("Adding Foreign Keys...");

        try {
            await sql`ALTER TABLE products ADD CONSTRAINT products_category_fk FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL`;
        } catch (e) { /* Ignore if exists */ }

        try {
            await sql`ALTER TABLE orders ADD CONSTRAINT orders_user_fk FOREIGN KEY (user_id) REFERENCES users(id)`;
        } catch (e) { /* Ignore if exists */ }

        try {
            await sql`ALTER TABLE payments ADD CONSTRAINT payments_order_fk FOREIGN KEY (order_id) REFERENCES orders(id)`;
        } catch (e) { /* Ignore if exists */ }

        try {
            await sql`ALTER TABLE order_items_relational ADD CONSTRAINT order_items_order_fk FOREIGN KEY (order_id) REFERENCES orders(id)`;
        } catch (e) { /* Ignore if exists */ }

        try {
            await sql`ALTER TABLE order_items_relational ADD CONSTRAINT order_items_product_fk FOREIGN KEY (product_id) REFERENCES products(id)`;
        } catch (e) { /* Ignore if exists */ }

        try {
            await sql`ALTER TABLE user_addresses ADD CONSTRAINT user_addresses_user_fk FOREIGN KEY (user_id) REFERENCES users(id)`;
        } catch (e) { /* Ignore if exists */ }

        try {
            await sql`ALTER TABLE coupons ADD CONSTRAINT coupons_user_fk FOREIGN KEY (user_id) REFERENCES users(id)`;
        } catch (e) { /* Ignore if exists */ }


        console.log("✅ Database Schema Fixed Successfully!");
    } catch (err) {
        console.error("❌ Error fixing database schema:", err);
        process.exit(1);
    }
}

main();
