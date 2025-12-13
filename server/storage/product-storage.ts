import { type Product, type Review, type ReviewRating, type Discount, type FishSpecies, products, reviews, reviewRatings, discounts, fishSpecies, categories } from "../../shared/schema.js";
import { eq, desc, and, gte, lte, sql, isNull } from "drizzle-orm";
import { getDb } from "../db.js";
import { randomUUID } from "crypto";

export interface ProductFilters {
    category?: string;
    subcategory?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    isNew?: boolean;
    isBestSeller?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
    sortBy?: 'rating' | 'price' | 'createdAt' | 'reviewCount';
    sortOrder?: 'asc' | 'desc';
}

export class ProductStorage {
    private db = getDb();

    private ensureDb() {
        if (!this.db) {
            throw new Error('Database not connected. Please configure DATABASE_URL in your .env file.');
        }
        return this.db;
    }

    async getProducts(filters?: ProductFilters): Promise<Product[]> {
        const db = this.ensureDb();
        let query = db.select().from(products);

        const conditions = [];
        if (filters?.category) conditions.push(sql`lower(${products.category}) = lower(${filters.category})`);
        if (filters?.subcategory) conditions.push(sql`lower(${products.subcategory}) = lower(${filters.subcategory})`);
        if (filters?.brand) conditions.push(sql`lower(${products.brand}) = lower(${filters.brand})`);

        if (filters?.isNew !== undefined) conditions.push(eq(products.isNew, filters.isNew));
        if (filters?.isBestSeller !== undefined) conditions.push(eq(products.isBestSeller, filters.isBestSeller));
        if (filters?.minPrice) conditions.push(gte(products.price, filters.minPrice.toString()));
        if (filters?.maxPrice) conditions.push(lte(products.price, filters.maxPrice.toString()));

        if (filters?.search) {
            conditions.push(
                sql`(${products.name} ILIKE ${`%${filters.search}%`} OR ${products.description} ILIKE ${`%${filters.search}%`})`
            );
        }

        // Ensure soft deleted products are hidden
        conditions.push(isNull(products.deletedAt));

        if (conditions.length > 0) {
            query = query.where(and(...conditions)) as any;
        }

        // Apply sorting
        if (filters?.sortBy) {
            const sortColumn = filters.sortBy === 'rating' ? products.rating :
                filters.sortBy === 'price' ? products.price :
                    filters.sortBy === 'reviewCount' ? products.reviewCount :
                        products.createdAt;

            query = filters.sortOrder === 'asc'
                ? query.orderBy(sortColumn) as any
                : query.orderBy(desc(sortColumn)) as any;
        } else {
            query = query.orderBy(desc(products.createdAt)) as any;
        }

        if (filters?.limit) {
            query = query.limit(filters.limit) as any;
        }
        if (filters?.offset) {
            query = query.offset(filters.offset) as any;
        }

        return await query;
    }

    async getProduct(id: string): Promise<Product | undefined> {
        const db = this.ensureDb();
        const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
        return result[0];
    }

    async getProductBySlug(slug: string): Promise<Product | undefined> {
        const db = this.ensureDb();
        const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
        return result[0];
    }

    private async resolveCategoryId(categoryName: string): Promise<string | undefined> {
        if (!categoryName) return undefined;
        const db = this.ensureDb();

        // 1. Try to find existing category
        const existing = await db.select().from(categories)
            .where(sql`lower(${categories.name}) = lower(${categoryName})`)
            .limit(1);

        if (existing.length > 0) {
            return existing[0].id;
        }

        // 2. If not found, create it (Auto-seed for migration)
        try {
            const newCategory = await db.insert(categories).values({
                name: categoryName,
                displayName: categoryName, // Fallback to same name
                slug: categoryName.toLowerCase().replace(/\s+/g, '-'),
                description: `Auto-generated category for ${categoryName}`
            }).returning();
            return newCategory[0].id;
        } catch (e) {
            // Check for race condition or unique constraint error, retry fetch
            const retry = await db.select().from(categories)
                .where(sql`lower(${categories.name}) = lower(${categoryName})`)
                .limit(1);
            return retry[0]?.id;
        }
    }

    async createProduct(product: Partial<Product>): Promise<Product> {
        const db = this.ensureDb();
        // Dual Write Logic: Ensure categoryId is set if category is provided
        if (product.category && !product.categoryId) {
            product.categoryId = await this.resolveCategoryId(product.category) || null;
        }

        const newProduct = {
            ...product,
            id: product.id || randomUUID(),
        };
        const result = await db.insert(products).values(newProduct as any).returning();
        return result[0];
    }

    async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
        const db = this.ensureDb();
        // Dual Write Logic: Update categoryId if category changes
        if (updates.category) {
            const newCategoryId = await this.resolveCategoryId(updates.category);
            if (newCategoryId) {
                updates.categoryId = newCategoryId;
            }
        }

        const result = await db.update(products).set({ ...updates, updatedAt: new Date() }).where(eq(products.id, id)).returning();
        return result[0];
    }

    async deleteProduct(id: string): Promise<boolean> {
        const db = this.ensureDb();
        // Soft delete
        const result = await db.update(products)
            .set({ deletedAt: new Date(), updatedAt: new Date() })
            .where(eq(products.id, id))
            .returning();
        return result.length > 0;
    }

    // Reviews
    async getReviews(productId: string): Promise<Review[]> {
        const db = this.ensureDb();
        return await db.select().from(reviews)
            .where(and(eq(reviews.productId, productId), eq(reviews.status, 'approved')))
            .orderBy(desc(reviews.createdAt));
    }

    async getReview(id: string): Promise<Review | undefined> {
        const db = this.ensureDb();
        const result = await db.select().from(reviews).where(eq(reviews.id, id)).limit(1);
        return result[0];
    }

    async createReview(review: Partial<Review>): Promise<Review> {
        const db = this.ensureDb();
        const result = await db.insert(reviews).values({
            ...review,
            status: 'approved', // Auto-approve
        } as any).returning();

        // Update product rating
        if (review.productId) {
            await this.updateProductRating(review.productId);
        }

        return result[0];
    }

    async updateReview(id: string, updates: Partial<Review>): Promise<Review | undefined> {
        const db = this.ensureDb();
        const result = await db.update(reviews)
            .set({ ...updates, updatedAt: new Date() })
            .where(eq(reviews.id, id))
            .returning();
        return result[0];
    }

    async deleteReview(id: string): Promise<boolean> {
        const db = this.ensureDb();
        const review = await this.getReview(id);
        const result = await db.delete(reviews).where(eq(reviews.id, id)).returning();

        // Update product rating after deletion
        if (review?.productId) {
            await this.updateProductRating(review.productId);
        }

        return result.length > 0;
    }

    async markReviewHelpful(reviewId: string, userId: string | null, ipAddress: string): Promise<boolean> {
        const db = this.ensureDb();
        // Check if already voted
        const existingVote = await db.select().from(reviewRatings)
            .where(
                and(
                    eq(reviewRatings.reviewId, reviewId),
                    userId
                        ? eq(reviewRatings.userId, userId)
                        : eq(reviewRatings.ipAddress, ipAddress)
                )
            ).limit(1);

        if (existingVote.length > 0) {
            return false; // Already voted
        }

        // Record the vote
        await db.insert(reviewRatings).values({
            reviewId,
            userId,
            ipAddress,
            isHelpful: true,
        });

        // Increment helpful count
        await db.update(reviews)
            .set({ helpfulCount: sql`COALESCE(${reviews.helpfulCount}, 0) + 1` })
            .where(eq(reviews.id, reviewId));

        return true;
    }

    async updateProductRating(productId: string): Promise<void> {
        const db = this.ensureDb();
        // Calculate average rating from approved reviews
        const result = await db.execute(sql`
      SELECT 
        COALESCE(AVG(rating), 0) as avg_rating,
        COUNT(*) as review_count 
      FROM reviews 
      WHERE product_id = ${productId} AND status = 'approved'
    `);

        const avgRating = Number(result.rows[0]?.avg_rating || 0).toFixed(1);
        const reviewCount = Number(result.rows[0]?.review_count || 0);

        await db.update(products)
            .set({
                rating: avgRating,
                reviewCount: reviewCount,
                updatedAt: new Date()
            })
            .where(eq(products.id, productId));
    }

    // Discounts
    async getDiscounts(productId?: string): Promise<Discount[]> {
        const db = this.ensureDb();
        if (productId) {
            return await db.select().from(discounts).where(eq(discounts.productId, productId)).orderBy(desc(discounts.createdAt));
        }
        return await db.select().from(discounts).orderBy(desc(discounts.createdAt));
    }

    async getDiscount(id: string): Promise<Discount | undefined> {
        const db = this.ensureDb();
        const result = await db.select().from(discounts).where(eq(discounts.id, id)).limit(1);
        return result[0];
    }

    async createDiscount(discount: Partial<Discount>): Promise<Discount> {
        const db = this.ensureDb();
        const result = await db.insert(discounts).values(discount as any).returning();
        return result[0];
    }

    async updateDiscount(id: string, updates: Partial<Discount>): Promise<Discount | undefined> {
        const db = this.ensureDb();
        const result = await db.update(discounts).set({ ...updates, updatedAt: new Date() }).where(eq(discounts.id, id)).returning();
        return result[0];
    }

    async deleteDiscount(id: string): Promise<boolean> {
        const db = this.ensureDb();
        const result = await db.delete(discounts).where(eq(discounts.id, id)).returning();
        return result.length > 0;
    }

    // Fish Species methods implementation
    async getAllFishSpecies(): Promise<FishSpecies[]> {
        const db = this.ensureDb();
        return await db.select().from(fishSpecies);
    }

    async getFishSpeciesById(id: string): Promise<FishSpecies | undefined> {
        const db = this.ensureDb();
        const result = await db.select().from(fishSpecies).where(eq(fishSpecies.id, id));
        return result[0];
    }

    async seedFishSpeciesIfNeeded(): Promise<void> {
        // Implementation can be moved here or kept in seed script
    }
}
