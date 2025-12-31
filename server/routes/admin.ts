import type { Router as RouterType, Request, Response, NextFunction } from "express";
import { Router } from "express";
import { storage } from "../storage/index.js";
import { requireAdmin, getSession } from "../middleware/auth.js";
import { insertProductSchema } from "../../shared/schema.js";
import { broadcastDiscountForProduct } from "./newsletter.js";

export function createAdminRouter(): RouterType {
    const router = Router();

    // Apply admin check to all routes in this router
    router.use(requireAdmin);

    // Dashboard Stats (Example) - logic might need to be added to storage
    // router.get("/stats", ...);

    // Orders
    router.get("/orders", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const orders = await storage.getOrders();

            // Enrich orders with product names
            const enrichedOrders = await Promise.all(orders.map(async (order) => {
                if (order.items && Array.isArray(order.items)) {
                    const enrichedItems = await Promise.all(
                        (order.items as any[]).map(async (item: any) => {
                            let productName = item.productName;
                            if (!productName && item.productId) {
                                const product = await storage.getProduct(item.productId);
                                productName = product?.name || `منتج #${item.productId.slice(0, 8)}`;
                            }
                            return {
                                ...item,
                                productName,
                                price: item.priceAtPurchase || item.price || 0
                            };
                        })
                    );
                    return { ...order, items: enrichedItems };
                }
                return order;
            }));

            res.json(enrichedOrders);
        } catch (err) {
            next(err);
        }
    });

    router.put("/orders/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params as { id: string };
            const previousOrder = await storage.getOrder(id);
            const order = await storage.updateOrder(id, req.body);

            if (order) {
                await storage.createAuditLog({
                    userId: (req as any).session?.userId || "admin",
                    action: "update",
                    entityType: "order",
                    entityId: order.id,
                    changes: req.body
                });

                // Send push notification when order status changes to shipped
                if (req.body.status === "shipped" && previousOrder?.status !== "shipped") {
                    try {
                        const webPush = await import("web-push");
                        const { getDb } = await import("../db.js");
                        const { pushSubscriptions } = await import("../../shared/schema.js");
                        const { eq, and } = await import("drizzle-orm");

                        const db = getDb();
                        const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
                        const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

                        if (db && VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY && (order as any).userId) {
                            webPush.default.setVapidDetails(
                                process.env.VAPID_SUBJECT || "mailto:admin@aquavo.com",
                                VAPID_PUBLIC_KEY,
                                VAPID_PRIVATE_KEY
                            );

                            const subscriptions = await db.select().from(pushSubscriptions).where(
                                and(eq(pushSubscriptions.isActive, true), eq(pushSubscriptions.userId, (order as any).userId))
                            );

                            const payload = JSON.stringify({
                                title: "🚚 طلبك في الطريق إليك!",
                                body: `تم شحن طلبك #${order.id.slice(0, 8).toUpperCase()}. سيصل قريباً!`,
                                url: `/order-tracking/${order.id}`,
                                icon: "/icons/icon-192x192.png"
                            });

                            for (const sub of subscriptions) {
                                try {
                                    await webPush.default.sendNotification(
                                        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
                                        payload
                                    );
                                } catch (sendErr) {
                                    console.error("Push send error:", sendErr);
                                }
                            }
                        }
                    } catch (pushErr) {
                        console.error("Failed to send push notification:", pushErr);
                    }
                }
            }

            res.json(order);
        } catch (err) { next(err); }
    });

    // Users
    // Users
    // Users Stats
    router.get("/users/stats", async (req: Request, res: Response, next: NextFunction) => {
        try {
            const stats = await storage.getUserStats();
            res.json(stats);
        } catch (err) { next(err); }
    });

    // Users
    router.get("/users", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Check if pagination params are present
            if (req.query.page || req.query.limit || req.query.search) {
                const page = parseInt(req.query.page as string) || 1;
                const limit = parseInt(req.query.limit as string) || 20;
                const search = req.query.search as string || undefined;

                const result = await storage.getUsersPaginated(page, limit, search);
                res.json(result);
            } else {
                // Backward compatibility: return all users if no pagination requested
                const users = await storage.getUsers();
                res.json(users);
            }
        } catch (err) {
            next(err);
        }
    });

    // Discounts
    router.get("/discounts", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const discounts = await storage.getDiscounts();
            res.json(discounts);
        } catch (err) { next(err); }
    });

    router.post("/discounts", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { productId, type, value, startDate, endDate } = req.body;

            // Validate required fields
            if (!productId || !type || value === undefined || value === "") {
                res.status(400).json({
                    message: "الحقول المطلوبة: معرف المنتج، نوع الخصم، والقيمة"
                });
                return;
            }

            // Validate discount type
            if (!["percentage", "fixed"].includes(type)) {
                res.status(400).json({
                    message: "نوع الخصم يجب أن يكون نسبة مئوية أو مبلغ ثابت"
                });
                return;
            }

            // Validate percentage value
            if (type === "percentage") {
                const numValue = parseFloat(value);
                if (isNaN(numValue) || numValue < 0 || numValue > 100) {
                    res.status(400).json({
                        message: "النسبة المئوية يجب أن تكون بين 0 و 100"
                    });
                    return;
                }
            }

            // Verify product exists
            const product = await storage.getProduct(productId);
            if (!product) {
                res.status(400).json({
                    message: "المنتج غير موجود"
                });
                return;
            }

            // Build discount object with proper date parsing
            const discountData: Record<string, unknown> = {
                productId,
                type,
                value: value.toString(),
                isActive: true,
            };

            // Parse dates if provided
            if (startDate) {
                discountData.startDate = new Date(startDate);
            }
            if (endDate) {
                discountData.endDate = new Date(endDate);
            }

            const discount = await storage.createDiscount(discountData);
            res.status(201).json(discount);
        } catch (err) {
            console.error("Discount creation error:", err);
            next(err);
        }
    });

    router.delete("/discounts/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params as { id: string };
            await storage.deleteDiscount(id);
            res.json({ message: "Deleted" });
        } catch (err) { next(err); }
    });

    // Coupons
    router.get("/coupons", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const coupons = await storage.getCoupons();
            res.json(coupons);
        } catch (err) { next(err); }
    });

    router.post("/coupons", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const coupon = await storage.createCoupon(req.body);
            res.status(201).json(coupon);
        } catch (err) { next(err); }
    });

    router.put("/coupons/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params as { id: string };
            const coupon = await storage.updateCoupon(id, req.body);
            res.json(coupon);
        } catch (err) { next(err); }
    });

    router.delete("/coupons/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params as { id: string };
            await storage.deleteCoupon(id);
            res.json({ message: "Deleted" });
        } catch (err) { next(err); }
    });

    // Audit Logs
    router.get("/audit-logs", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const logs = await storage.getAuditLogs(req.query as any);
            res.json(logs);
        } catch (err) { next(err); }
    });

    // Gallery Management
    router.get("/gallery/submissions", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // False = get all (pending + approved)
            const subs = await storage.getGallerySubmissions(false);
            res.json(subs);
        } catch (err) { next(err); }
    });

    router.post("/gallery/approve/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params as { id: string };
            const sub = await storage.approveGallerySubmission(id);
            res.json(sub);
        } catch (err) { next(err); }
    });

    router.post("/gallery/reject/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params as { id: string };
            await storage.deleteGallerySubmission(id);
            res.json({ message: "Rejected" });
        } catch (err) { next(err); }
    });

    router.post("/gallery/prize", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const prize = await storage.createOrUpdateGalleryPrize(req.body);
            res.json(prize);
        } catch (err) { next(err); }
    });

    router.post("/gallery/set-winner/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params as { id: string };
            const { nanoid } = await import("nanoid");
            // Logic for winner
            const currentPrize = await storage.getCurrentGalleryPrize();
            if (!currentPrize) {
                res.status(400).json({
                    message: "لا توجد جائزة نشطة للشهر الحالي. يرجى إنشاء جائزة أولاً."
                });
                return;
            }

            // Find submission to get userId
            const submissions = await storage.getGallerySubmissions(false);
            const submission = submissions.find(s => s.id === id);

            if (!submission) {
                res.status(404).json({ message: "Submission not found" });
                return;
            }

            // Use admin-provided coupon code or generate one automatically
            const { couponCode: adminCouponCode } = req.body;
            const code = adminCouponCode && adminCouponCode.trim()
                ? adminCouponCode.trim().toUpperCase()
                : `WINNER-${currentPrize.month.replace('-', '')}-${nanoid(6).toUpperCase()}`;

            // Determine value/type from prize or default
            const couponValue = currentPrize.discountPercentage ? currentPrize.discountPercentage.toString() : "0";
            const couponType = currentPrize.discountPercentage ? 'percentage' : 'fixed';

            // Create Coupon
            await storage.createCoupon({
                code,
                type: couponType,
                value: couponValue,
                maxUses: 1,
                maxUsesPerUser: 1,
                isActive: true,
                description: `Prize for ${currentPrize.month}: ${currentPrize.prize}`,
                userId: submission.userId || undefined
            });

            await storage.setGalleryWinner(id, currentPrize.month, currentPrize.prize, code);
            res.json({ message: "Winner set", coupon: code });
        } catch (err) { next(err); }
    });

    // Delete a past winner (removes submission and image from Cloudinary)
    router.delete("/gallery/winner/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params as { id: string };
            // Get the submission first to retrieve the image URL
            const submissions = await storage.getGallerySubmissions(false);
            const submission = submissions.find(s => s.id === id);

            if (!submission) {
                res.status(404).json({ message: "Submission not found" });
                return;
            }

            // Only allow deletion of winners
            if (!submission.isWinner) {
                res.status(400).json({ message: "This submission is not a winner" });
                return;
            }

            // Delete the image from Cloudinary if it exists and is a Cloudinary URL
            if (submission.imageUrl && submission.imageUrl.includes('cloudinary.com')) {
                try {
                    const { deleteImage } = await import("../utils/cloudinary.js");
                    await deleteImage(submission.imageUrl);
                } catch (imgError) {
                    console.error("Failed to delete image from Cloudinary:", imgError);
                    // Continue with submission deletion even if image deletion fails
                }
            }

            // Delete the submission from database
            await storage.deleteGallerySubmission(id);

            // Audit Log
            await storage.createAuditLog({
                userId: getSession(req)?.userId || "admin",
                action: "delete",
                entityType: "gallery_winner",
                entityId: id,
                changes: { customerName: submission.customerName, winnerMonth: submission.winnerMonth }
            });

            res.json({ message: "Winner deleted successfully" });
        } catch (err) { next(err); }
    });

    // ============ REVIEWS MANAGEMENT ============

    // Get all reviews for admin
    router.get("/reviews", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const reviews = await storage.getAllReviews();

            // Enrich with product and user info
            const enrichedReviews = await Promise.all(reviews.map(async (review) => {
                const product = await storage.getProduct(review.productId);
                const user = review.userId ? await storage.getUser(review.userId) : null;
                return {
                    ...review,
                    productName: product?.name || "منتج محذوف",
                    userName: user?.fullName || user?.email?.split('@')[0] || "زائر",
                };
            }));

            res.json(enrichedReviews);
        } catch (err) { next(err); }
    });

    // Delete a review (admin only)
    router.delete("/reviews/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params as { id: string };
            const review = await storage.getReview(id);
            if (!review) {
                res.status(404).json({ message: "المراجعة غير موجودة" });
                return;
            }

            await storage.deleteReview(id);

            // Audit Log
            await storage.createAuditLog({
                userId: getSession(req)?.userId || "admin",
                action: "delete",
                entityType: "review",
                entityId: id,
                changes: { comment: review.comment?.substring(0, 50) }
            });

            res.json({ message: "تم حذف المراجعة بنجاح" });
        } catch (err) { next(err); }
    });

    // ============ PRODUCTS MANAGEMENT ============

    router.post("/products", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = req.body;

            // Handle image upload if provided
            if (data.imageBase64) {
                try {
                    const { uploadImage } = await import("../utils/cloudinary.js");
                    const imageUrl = await uploadImage(data.imageBase64);

                    data.images = [imageUrl];
                    data.thumbnail = imageUrl;
                } catch (error) {
                    console.error("Image upload failed:", error);
                    throw new Error("Image upload failed. Please check your internet connection or Cloudinary configuration.");
                }
            }

            // Ensure images is array if not set
            if (!data.images) data.images = [];
            if (!data.thumbnail && data.images.length > 0) data.thumbnail = data.images[0];

            // Clean up imageBase64 before validation
            delete data.imageBase64;

            // Auto-generate ID if not provided
            if (!data.id) {
                data.id = crypto.randomUUID();
            }

            // Auto-generate slug from name if not provided
            if (!data.slug && data.name) {
                data.slug = data.name
                    .toLowerCase()
                    .replace(/[^\w\s\u0621-\u064A-]/g, '')
                    .replace(/\s+/g, '-')
                    .substring(0, 100);
            }

            const parsed = insertProductSchema.parse(data);
            const product = await storage.createProduct(parsed);

            // Audit Log
            await storage.createAuditLog({
                userId: getSession(req)?.userId || "admin",
                action: "create",
                entityType: "product",
                entityId: product.id,
                changes: parsed as any
            });

            res.status(201).json(product);
        } catch (err) { next(err); }
    });

    router.patch("/products/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params as { id: string };
            const updates = req.body;

            // Handle image upload if provided
            if (updates.imageBase64) {
                try {
                    const { uploadImage } = await import("../utils/cloudinary.js");
                    const imageUrl = await uploadImage(updates.imageBase64);

                    // Append to existing images or replace? 
                    // For now, let's treat it as "add/replace main image" logic or simple replace
                    // Based on typical admin usage, likely replacing the main image
                    // But let's verify if we want to keep array.
                    // The simple approach: Replace
                    updates.images = [imageUrl];
                    updates.thumbnail = imageUrl;
                } catch (error) {
                    console.error("Image upload failed:", error);
                    throw new Error("Image upload failed. Please check your internet connection or Cloudinary configuration.");
                }

                delete updates.imageBase64;
            }

            const product = await storage.updateProduct(id, updates);

            if (!product) {
                res.status(404).json({ message: "Product not found" });
                return;
            }

            // Audit Log
            await storage.createAuditLog({
                userId: getSession(req)?.userId || "admin",
                action: "update",
                entityType: "product",
                entityId: product.id,
                changes: updates
            });

            // Check if price was provided in updates
            if (updates.price) {
                const currentPrice = parseFloat(product.price);
                const oldPrice = product.originalPrice ? parseFloat(product.originalPrice) : Infinity;

                // If currently discounted (price < originalPrice)
                if (oldPrice > currentPrice) {
                    // Trigger broadcast in background
                    broadcastDiscountForProduct(storage, product.id).catch(err => {
                        console.error("Failed to auto-broadcast discount:", err);
                    });
                }
            }

            res.json(product);
        } catch (err: any) { next(err); }
    });

    router.delete("/products/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params as { id: string };
            const success = await storage.deleteProduct(id);
            if (!success) {
                res.status(404).json({ message: "Product not found" });
                return;
            }

            // Audit Log
            await storage.createAuditLog({
                userId: getSession(req)?.userId || "admin",
                action: "delete",
                entityType: "product",
                entityId: id,
                changes: {}
            });

            res.json({ message: "Product deleted" });
        } catch (err) { next(err); }
    });

    // ============ SETTINGS MANAGEMENT ============

    // Get all settings
    router.get("/settings", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const allSettings = await storage.getAllSettings();
            res.json(allSettings);
        } catch (err) { next(err); }
    });

    // Update settings
    router.put("/settings", async (req: Request, res: Response, next: NextFunction) => {
        try {
            const updates = req.body;

            // Validate that body is an object with string values
            if (typeof updates !== 'object' || updates === null) {
                res.status(400).json({ message: "Invalid settings format" });
                return;
            }

            await storage.updateAllSettings(updates);

            // Audit Log
            await storage.createAuditLog({
                userId: getSession(req)?.userId || "admin",
                action: "update",
                entityType: "settings",
                entityId: "store_settings",
                changes: updates
            });

            res.json({ message: "Settings updated successfully" });
        } catch (err) { next(err); }
    });

    // ============ AI SYSTEMS MANAGEMENT ============

    // Seed demo data for AI/ML development
    router.post("/ai/seed-demo-data", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { DataSeeder } = await import("../services/data-seeder.js");
            const seeder = new DataSeeder();

            console.log("[Admin API] 🌱 Starting demo data seeding...");
            await seeder.seedAll();

            // Audit Log
            await storage.createAuditLog({
                userId: getSession(req)?.userId || "admin",
                action: "create",
                entityType: "ai_data",
                entityId: "demo_seed",
                changes: { action: "seed_demo_data" }
            });

            res.json({
                success: true,
                message: "تم توليد البيانات التجريبية بنجاح"
            });
        } catch (err) {
            console.error("[Admin API] ❌ Error seeding demo data:", err);
            next(err);
        }
    });

    // Clear demo data
    router.delete("/ai/demo-data", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { DataSeeder } = await import("../services/data-seeder.js");
            const seeder = new DataSeeder();

            await seeder.clearDemoData();

            await storage.createAuditLog({
                userId: getSession(req)?.userId || "admin",
                action: "delete",
                entityType: "ai_data",
                entityId: "demo_clear",
                changes: { action: "clear_demo_data" }
            });

            res.json({
                success: true,
                message: "تم حذف البيانات التجريبية"
            });
        } catch (err) { next(err); }
    });

    // Generate embeddings for all products
    router.post("/ai/generate-embeddings", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { embeddingGenerator } = await import("../services/embedding-generator.js");

            console.log("[Admin API] 🚀 Starting embedding generation for all products...");
            const result = await embeddingGenerator.generateAllEmbeddings();

            await storage.createAuditLog({
                userId: getSession(req)?.userId || "admin",
                action: "create",
                entityType: "ai_embeddings",
                entityId: "bulk_generate",
                changes: result
            });

            res.json({
                success: true,
                message: `تم توليد embeddings بنجاح: ${result.success} نجح، ${result.failed} فشل`,
                data: result
            });
        } catch (err) {
            console.error("[Admin API] ❌ Error generating embeddings:", err);
            next(err);
        }
    });

    // Generate embeddings for missing products only
    router.post("/ai/generate-missing-embeddings", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { embeddingGenerator } = await import("../services/embedding-generator.js");

            console.log("[Admin API] 🔍 Generating embeddings for missing products...");
            const result = await embeddingGenerator.generateMissingEmbeddings();

            await storage.createAuditLog({
                userId: getSession(req)?.userId || "admin",
                action: "create",
                entityType: "ai_embeddings",
                entityId: "missing_generate",
                changes: result
            });

            res.json({
                success: true,
                message: `تم توليد embeddings للمنتجات الناقصة: ${result.success} نجح، ${result.failed} فشل`,
                data: result
            });
        } catch (err) {
            console.error("[Admin API] ❌ Error generating missing embeddings:", err);
            next(err);
        }
    });

    // Get AI systems statistics
    router.get("/ai/stats", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { embeddingGenerator } = await import("../services/embedding-generator.js");
            const { analyticsTracker } = await import("../services/analytics-tracker.js");
            const { getDb } = await import("../db.js");
            const { productInteractions, searchQueries, priceHistory, chatMessages, supportTickets } = await import("../../shared/schema.js");

            const { sql } = await import("drizzle-orm");

            const db = getDb();
            if (!db) {
                throw new Error("Database not initialized");
            }

            // Embedding stats
            const embeddingStats = await embeddingGenerator.getEmbeddingStats();

            // Interaction stats
            // Interaction stats
            const interactionCount = await db.select({ count: sql<number>`count(*)` })
                .from(productInteractions);

            // Search stats
            // Search stats
            const searchCount = await db.select({ count: sql<number>`count(*)` })
                .from(searchQueries);

            // Price history stats
            // Price history stats
            const priceHistoryCount = await db.select({ count: sql<number>`count(*)` })
                .from(priceHistory);

            // Chat stats
            // Chat stats
            const chatCount = await db.select({ count: sql<number>`count(*)` })
                .from(chatMessages);

            // Support ticket stats
            // Support ticket stats
            const ticketCount = await db.select({ count: sql<number>`count(*)` })
                .from(supportTickets);

            // Cart abandonment rate
            const abandonmentRate = await analyticsTracker.getCartAbandonmentRate(30);

            res.json({
                embeddings: embeddingStats,
                interactions: {
                    total: interactionCount[0]?.count || 0
                },
                searches: {
                    total: searchCount[0]?.count || 0
                },
                priceHistory: {
                    total: priceHistoryCount[0]?.count || 0
                },
                chat: {
                    total: chatCount[0]?.count || 0
                },
                support: {
                    total: ticketCount[0]?.count || 0
                },
                analytics: {
                    cartAbandonmentRate: Math.round(abandonmentRate * 10) / 10
                }
            });
        } catch (err) {
            console.error("[Admin API] ❌ Error getting AI stats:", err);
            next(err);
        }
    });

    // Get trending products (from analytics)
    router.get("/ai/trending", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { analyticsTracker } = await import("../services/analytics-tracker.js");
            const days = parseInt(req.query.days as string) || 7;
            const limit = parseInt(req.query.limit as string) || 10;

            const trending = await analyticsTracker.getTrendingProducts(days, limit);

            // Enrich with product details
            const enriched = await Promise.all(trending.map(async (item) => {
                const product = await storage.getProduct(item.productId);
                return {
                    ...item,
                    product
                };
            }));

            res.json(enriched);
        } catch (err) {
            console.error("[Admin API] ❌ Error getting trending products:", err);
            next(err);
        }
    });

    // Get top search keywords
    router.get("/ai/top-searches", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { analyticsTracker } = await import("../services/analytics-tracker.js");
            const days = parseInt(req.query.days as string) || 30;
            const limit = parseInt(req.query.limit as string) || 10;

            const topSearches = await analyticsTracker.getTopSearchKeywords(days, limit);
            res.json(topSearches);
        } catch (err) {
            console.error("[Admin API] ❌ Error getting top searches:", err);
            next(err);
        }
    });

    // Get searches with no results
    router.get("/ai/no-result-searches", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { analyticsTracker } = await import("../services/analytics-tracker.js");
            const days = parseInt(req.query.days as string) || 30;
            const limit = parseInt(req.query.limit as string) || 20;

            const noResults = await analyticsTracker.getNoResultSearches(days, limit);
            res.json(noResults);
        } catch (err) {
            console.error("[Admin API] ❌ Error getting no-result searches:", err);
            next(err);
        }
    });

    // ============ PRODUCT MERGE ============

    // Merge two products: transfer images from source to target, delete source
    router.post("/products/merge", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { targetProductId, sourceProductId } = req.body;

            // Validation
            if (!targetProductId || !sourceProductId) {
                res.status(400).json({
                    success: false,
                    message: "يرجى تقديم معرفات المنتجات المطلوبة",
                    code: "MISSING_PARAMETERS"
                });
                return;
            }

            if (targetProductId === sourceProductId) {
                res.status(400).json({
                    success: false,
                    message: "لا يمكن دمج المنتج مع نفسه",
                    code: "SAME_PRODUCT"
                });
                return;
            }

            // Get both products
            const targetProduct = await storage.getProduct(targetProductId);
            const sourceProduct = await storage.getProduct(sourceProductId);

            if (!targetProduct) {
                res.status(404).json({
                    success: false,
                    message: "المنتج الرئيسي غير موجود",
                    code: "TARGET_NOT_FOUND"
                });
                return;
            }

            if (!sourceProduct) {
                res.status(404).json({
                    success: false,
                    message: "المنتج المصدر غير موجود",
                    code: "SOURCE_NOT_FOUND"
                });
                return;
            }

            // Merge images (remove duplicates)
            const targetImages = Array.isArray(targetProduct.images) ? targetProduct.images : [];
            const sourceImages = Array.isArray(sourceProduct.images) ? sourceProduct.images : [];

            const mergedImages = Array.from(new Set([...targetImages, ...sourceImages]));
            const newImagesCount = mergedImages.length - targetImages.length;

            // Update target product with merged images
            await storage.updateProduct(targetProductId, {
                images: mergedImages,
                updatedAt: new Date()
            });

            // Delete source product (soft delete)
            await storage.deleteProduct(sourceProductId);

            // Audit log
            await storage.createAuditLog({
                userId: getSession(req)?.userId || "admin",
                action: "merge",
                entityType: "product",
                entityId: targetProductId,
                changes: {
                    sourceProductId,
                    sourceProductName: sourceProduct.name,
                    addedImages: newImagesCount,
                    totalImages: mergedImages.length
                }
            });

            // Get updated product
            const updatedProduct = await storage.getProduct(targetProductId);

            res.json({
                success: true,
                data: {
                    updatedProduct,
                    deletedProductId: sourceProductId,
                    mergedImagesCount: newImagesCount,
                    totalImages: mergedImages.length
                }
            });
        } catch (err) {
            console.error("[Admin API] ❌ Error merging products:", err);
            next(err);
        }
    });

    return router;
}
