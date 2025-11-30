import type {
  Application,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema } from "../shared/schema";
import crypto from "crypto";

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

interface ApiError extends Error {
  status?: number;
}

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

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Application,
): Promise<Server> {
  app.get("/api/health", (_req: Request, res: Response) => {
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

  app.get("/api/products", async (req: Request, res: Response, next: NextFunction) => {
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

  app.get("/api/products/:id", async (req: Request, res: Response, next: NextFunction) => {
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

  app.get("/api/products/slug/:slug", async (req: Request, res: Response, next: NextFunction) => {
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

  app.post("/api/users", async (req: Request, res: Response, next: NextFunction) => {
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

      req.session.userId = user.id;
      res.status(201).json({ id: user.id, username: user.username });
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = insertUserSchema.parse(req.body);
      const user = await storage.getUserByUsername(payload.username);
      if (!user || !verifyPassword(payload.password, user.password)) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
      }
      req.session.userId = user.id;
      res.json({ id: user.id, username: user.username });
    } catch (err) {
      next(err);
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    if (!req.session) {
      res.status(200).json({ message: "ok" });
      return;
    }
    req.session.destroy(() => {
      res.status(200).json({ message: "ok" });
    });
  });

  app.get(
    "/api/auth/me",
    requireAuth as RequestHandler,
    async (req: Request, res: Response) => {
    const user = await storage.getUser(req.session.userId as string);
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    res.json({ id: user.id, username: user.username });
  });

  app.use("/api", (_req: Request, res: Response) => {
    res.status(404).json({ message: "Not Found" });
  });

  return httpServer;
}
