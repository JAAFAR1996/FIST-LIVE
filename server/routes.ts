import type { Server } from "http";
import type session from "express-session";
import "express-session";
import { storage } from "./storage.js";
import { insertUserSchema, insertProductSchema, insertDiscountSchema } from "../shared/schema.js";
import crypto from "crypto";
import express from "express";
import { requireAuth, requireAdmin } from "./middleware/auth.js";
import { saveBase64Image, deleteImage } from "./middleware/upload.js";

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

interface ApiError extends Error {
  status?: number;
}

const getSession = (req: express.Request): (session.Session & Partial<session.SessionData>) | undefined =>
  (req as express.Request & { session?: session.Session & Partial<session.SessionData> }).session;

function derivePassword(password: string, salt: string) {
  return crypto
    .pbkdf2Sync(password, salt, 15000, 64, "sha512")
    .toString("hex");
}

function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const digest = derivePassword(password, salt);
  return `${salt}:${digest}`;
}

function verifyPassword(password: string, stored: string) {
  const [salt, digest] = stored.split(":");
  if (!salt || !digest) return false;
  const check = derivePassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(digest, "hex"), Buffer.from(check, "hex"));
}

function localRequireAuth(req: any, res: any, next: any) {
  const sess = getSession(req);
  if (!sess?.userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  // authorized, continue
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: express.Application,
): Promise<Server> {
  (app as any).get("/api/health", (_req: any, res: any) => {
    res.json({ status: "ok", timestamp: Date.now() });
  });

  function transformProduct(dbProduct: any) {
    return {
      id: dbProduct.id,
      name: dbProduct.name,
      brand: dbProduct.brand,
      price: Number(dbProduct.price),
      originalPrice: dbProduct.originalPrice ? Number(dbProduct.originalPrice) : undefined,
      rating: Number(dbProduct.rating),
      reviewCount: dbProduct.reviewCount,
      image: dbProduct.thumbnail || (dbProduct.images && dbProduct.images[0]) || '',
      category: dbProduct.subcategory || dbProduct.category,
      specs: dbProduct.description,
      isNew: dbProduct.isNew,
      isBestSeller: dbProduct.isBestSeller,
      difficulty: dbProduct.specifications?.difficulty,
      ecoFriendly: dbProduct.specifications?.ecoFriendly,
      videoUrl: dbProduct.specifications?.videoUrl,
      stock: dbProduct.stock,
      slug: dbProduct.slug,
    };
  }

  (app as any).get("/api/products", async (req: any, res: any, next: any) => {
    try {
      const { category, subcategory, brand, minPrice, maxPrice, isNew, isBestSeller, search, limit, offset } = req.query;

      const filters: any = {};
      if (category) filters.category = category as string;
      if (subcategory) filters.subcategory = subcategory as string;
      if (brand) filters.brand = brand as string;
      if (minPrice) filters.minPrice = Number(minPrice);
      if (maxPrice) filters.maxPrice = Number(maxPrice);
      if (isNew !== undefined) filters.isNew = isNew === 'true';
      if (isBestSeller !== undefined) filters.isBestSeller = isBestSeller === 'true';
      if (search) filters.search = search as string;
      if (limit) filters.limit = Number(limit);
      if (offset) filters.offset = Number(offset);

      const dbProducts = await storage.getProducts(filters);
      const products = dbProducts.map(transformProduct);
      res.json({ products });
    } catch (err) {
      next(err);
    }
  });

  (app as any).get("/api/products/:id", async (req: any, res: any, next: any) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
      res.json(transformProduct(product));
    } catch (err) {
      next(err);
    }
  });

  (app as any).get("/api/products/slug/:slug", async (req: any, res: any, next: any) => {
    try {
      const product = await storage.getProductBySlug(req.params.slug);
      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
      res.json(transformProduct(product));
    } catch (err) {
      next(err);
    }
  });

  (app as any).post("/api/users", async (req: any, res: any, next: any) => {
    try {
      const payload = insertUserSchema.parse(req.body);
      const existing = await storage.getUserByUsername(payload.username);
      if (existing) {
        res.status(409).json({ message: "Username already exists" });
        return;
      }

      const user = await storage.createUser({
        ...payload,
        password: hashPassword(payload.password),
      });

      const sess = getSession(req);
      if (!sess) {
        res.status(500).json({ message: "Session not initialized" });
        return;
      }
      sess.userId = user.id;
      res.status(201).json({ id: user.id, username: user.username });
    } catch (err) {
      next(err);
    }
  });

  (app as any).post("/api/auth/login", async (req: any, res: any, next: any) => {
    try {
      const payload = insertUserSchema.parse(req.body);
      const user = await storage.getUserByUsername(payload.username);
      if (!user || !verifyPassword(payload.password, user.password)) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }
      const sess = getSession(req);
      if (!sess) {
        res.status(500).json({ message: "Session not initialized" });
        return;
      }
      sess.userId = user.id;
      res.json({ id: user.id, username: user.username });
    } catch (err) {
      next(err);
    }
  });

  (app as any).post("/api/auth/logout", (req: any, res: any) => {
    const sess = getSession(req);
    if (!sess) {
      res.status(200).json({ message: "ok" });
      return;
    }
    sess.destroy(() => {
      res.status(200).json({ message: "ok" });
    });
  });

  (app as any).get(
    "/api/auth/me",
    localRequireAuth as express.RequestHandler,
    async (req: any, res: any) => {
    const sess = getSession(req);
    const userId = sess?.userId as string | undefined;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const user = await storage.getUser(userId);
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    res.json({ id: user.id, username: user.username, role: user.role });
  });

  // ============ ADMIN ENDPOINTS ============

  // Create Product (Admin only)
  (app as any).post(
    "/api/admin/products",
    requireAdmin as express.RequestHandler,
    async (req: any, res: any, next: any) => {
      try {
        const productData = req.body;

        // Handle image upload if base64 provided
        if (productData.imageBase64) {
          const imageUrl = saveBase64Image(productData.imageBase64);
          productData.thumbnail = imageUrl;
          if (!productData.images) productData.images = [];
          productData.images.push(imageUrl);
          delete productData.imageBase64;
        }

        const product = await storage.createProduct(productData);

        // Create audit log
        await storage.createAuditLog({
          userId: req.user.id,
          action: "create",
          entityType: "product",
          entityId: product.id,
          changes: { created: productData },
        });

        res.status(201).json(product);
      } catch (err) {
        next(err);
      }
    }
  );

  // Update Product (Admin only)
  (app as any).put(
    "/api/admin/products/:id",
    requireAdmin as express.RequestHandler,
    async (req: any, res: any, next: any) => {
      try {
        const { id } = req.params;
        const updates = req.body;

        // Handle image upload if base64 provided
        if (updates.imageBase64) {
          const imageUrl = saveBase64Image(updates.imageBase64);
          updates.thumbnail = imageUrl;
          if (!updates.images) updates.images = [];
          updates.images.push(imageUrl);
          delete updates.imageBase64;
        }

        const oldProduct = await storage.getProduct(id);
        const product = await storage.updateProduct(id, updates);

        if (!product) {
          res.status(404).json({ message: "Product not found" });
          return;
        }

        // Create audit log
        await storage.createAuditLog({
          userId: req.user.id,
          action: "update",
          entityType: "product",
          entityId: id,
          changes: { old: oldProduct, new: product },
        });

        res.json(product);
      } catch (err) {
        next(err);
      }
    }
  );

  // Delete Product (Admin only)
  (app as any).delete(
    "/api/admin/products/:id",
    requireAdmin as express.RequestHandler,
    async (req: any, res: any, next: any) => {
      try {
        const { id } = req.params;
        const product = await storage.getProduct(id);

        if (!product) {
          res.status(404).json({ message: "Product not found" });
          return;
        }

        // Delete product images
        if (product.thumbnail) deleteImage(product.thumbnail);
        if (product.images) {
          (product.images as string[]).forEach((img: string) => deleteImage(img));
        }

        const success = await storage.deleteProduct(id);

        if (success) {
          // Create audit log
          await storage.createAuditLog({
            userId: req.user.id,
            action: "delete",
            entityType: "product",
            entityId: id,
            changes: { deleted: product },
          });

          res.json({ message: "Product deleted successfully" });
        } else {
          res.status(500).json({ message: "Failed to delete product" });
        }
      } catch (err) {
        next(err);
      }
    }
  );

  // ============ DISCOUNT MANAGEMENT ============

  // Get all discounts or by product
  (app as any).get("/api/admin/discounts", requireAdmin as express.RequestHandler, async (req: any, res: any, next: any) => {
    try {
      const { productId } = req.query;
      const discounts = await storage.getDiscounts(productId);
      res.json(discounts);
    } catch (err) {
      next(err);
    }
  });

  // Create Discount
  (app as any).post(
    "/api/admin/discounts",
    requireAdmin as express.RequestHandler,
    async (req: any, res: any, next: any) => {
      try {
        const discount = await storage.createDiscount(req.body);

        // Create audit log
        await storage.createAuditLog({
          userId: req.user.id,
          action: "create",
          entityType: "discount",
          entityId: discount.id,
          changes: { created: req.body },
        });

        res.status(201).json(discount);
      } catch (err) {
        next(err);
      }
    }
  );

  // Update Discount
  (app as any).put(
    "/api/admin/discounts/:id",
    requireAdmin as express.RequestHandler,
    async (req: any, res: any, next: any) => {
      try {
        const { id } = req.params;
        const discount = await storage.updateDiscount(id, req.body);

        if (!discount) {
          res.status(404).json({ message: "Discount not found" });
          return;
        }

        // Create audit log
        await storage.createAuditLog({
          userId: req.user.id,
          action: "update",
          entityType: "discount",
          entityId: id,
          changes: { updated: req.body },
        });

        res.json(discount);
      } catch (err) {
        next(err);
      }
    }
  );

  // Delete Discount
  (app as any).delete(
    "/api/admin/discounts/:id",
    requireAdmin as express.RequestHandler,
    async (req: any, res: any, next: any) => {
      try {
        const { id } = req.params;
        const success = await storage.deleteDiscount(id);

        if (success) {
          // Create audit log
          await storage.createAuditLog({
            userId: req.user.id,
            action: "delete",
            entityType: "discount",
            entityId: id,
            changes: {},
          });

          res.json({ message: "Discount deleted successfully" });
        } else {
          res.status(404).json({ message: "Discount not found" });
        }
      } catch (err) {
        next(err);
      }
    }
  );

  // ============ AUDIT LOGS ============

  // Get Audit Logs (Admin only)
  (app as any).get(
    "/api/admin/audit-logs",
    requireAdmin as express.RequestHandler,
    async (req: any, res: any, next: any) => {
      try {
        const { userId, entityType, entityId } = req.query;
        const logs = await storage.getAuditLogs({
          userId: userId as string | undefined,
          entityType: entityType as string | undefined,
          entityId: entityId as string | undefined,
        });
        res.json(logs);
      } catch (err) {
        next(err);
      }
    }
  );

  // Get all orders (Admin only)
  (app as any).get(
    "/api/admin/orders",
    requireAdmin as express.RequestHandler,
    async (req: any, res: any, next: any) => {
      try {
        const orders = await storage.getOrders();
        res.json(orders);
      } catch (err) {
        next(err);
      }
    }
  );

  (app as any).use("/api", (_req: any, res: any) => {
    res.status(404).json({ message: "Not Found" });
  });

  return httpServer;
}
