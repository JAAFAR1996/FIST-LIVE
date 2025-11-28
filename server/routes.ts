import type { Express, Request, Response, NextFunction } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, type InsertProduct } from "../shared/schema";
import crypto from "crypto";

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

const ASSET_BASE =
  process.env.NEXT_PUBLIC_R2_PUBLIC_URL ||
  "https://images.unsplash.com";

function imageUrl(unsplashPath: string, r2Filename: string) {
  if (ASSET_BASE.includes("unsplash.com")) {
    return `${ASSET_BASE}${unsplashPath}`;
  }
  return `${ASSET_BASE.replace(/\/$/, "")}/${r2Filename}`;
}

const seedProducts: InsertProduct[] = [
  {
    id: "seachem-prime",
    name: "Seachem Prime Water Conditioner 500ml",
    brand: "Seachem",
    price: 55000,
    rating: 4.8,
    reviewCount: 67,
    image: imageUrl(
      "/photo-1522069169874-c58ec4b76be5?w=1200&q=90&auto=format&fit=crop",
      "seachem_prime_500ml__b70abe42.jpg",
    ),
    category: "Conditioners",
    specs: "التوافق: جميع الأحجام",
    isBestSeller: true,
    difficulty: "easy",
    ecoFriendly: true,
  },
  {
    id: "fluval-407",
    name: "Fluval 407 Performance Canister Filter",
    brand: "Fluval",
    price: 285000,
    rating: 4.9,
    reviewCount: 45,
    image: imageUrl(
      "/photo-1524704654690-b56c05c78a00?w=1200&q=90&auto=format&fit=crop",
      "fluval_407_canister__4d80d974.jpg",
    ),
    category: "Filters",
    specs: "التدفق: ١٤٥٠ لتر/ساعة | القدرة: ٢٠ واط",
    isBestSeller: true,
    difficulty: "medium",
    videoUrl:
      "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    id: "eheim-jager",
    name: "EHEIM Jager 200W Aquarium Heater",
    brand: "EHEIM",
    price: 95000,
    rating: 4.7,
    reviewCount: 28,
    image: imageUrl(
      "/photo-1520990269667-98a1d1d9d6b0?w=1200&q=90&auto=format&fit=crop",
      "eheim_jager_aquarium_f65664bd.jpg",
    ),
    category: "Heaters",
    specs: "القدرة: ٢٠٠ واط | للأحواض ١٥٠-٣٠٠ لتر",
    isBestSeller: true,
    difficulty: "easy",
  },
  {
    id: "aquaclear-70",
    name: "AquaClear 70 Power Filter",
    brand: "AquaClear",
    price: 125000,
    originalPrice: 145000,
    rating: 4.6,
    reviewCount: 32,
    image: imageUrl(
      "/photo-1535591273668-578e31182c4f?w=1200&q=90&auto=format&fit=crop",
      "aquaclear_70_power_f_dfd543e8.jpg",
    ),
    category: "Filters",
    specs: "التدفق: ١١٣٥ لتر/ساعة | القدرة: ٨ واط",
    isBestSeller: true,
    difficulty: "easy",
  },
  {
    id: "anubias-nana",
    name: "Anubias Nana Live Aquarium Plant",
    brand: "Aquatic Plants",
    price: 35000,
    rating: 4.5,
    reviewCount: 18,
    image: imageUrl(
      "/photo-1497250681960-ef046c08a56e?w=1200&q=90&auto=format&fit=crop",
      "anubias_nana_aquariu_554af5dc.jpg",
    ),
    category: "Plants",
    specs: "للأحواض ٢٠-٥٠٠ لتر",
    isNew: true,
    ecoFriendly: true,
    difficulty: "easy",
  },
];

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
  app: Express,
): Promise<Server> {
  await storage.seedProducts(seedProducts);

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: Date.now() });
  });

  app.get("/api/products", (_req, res) => {
    storage
      .listProducts()
      .then((products) => res.json({ products }))
      .catch((err) => {
        res.status(500).json({ message: "Failed to load products" });
        throw err;
      });
  });

  app.get("/api/products/:id", (req, res) => {
    storage
      .getProduct(req.params.id)
      .then((product) => {
        if (!product) {
          res.status(404).json({ message: "Product not found" });
          return;
        }
        res.json(product);
      })
      .catch((err) => {
        res.status(500).json({ message: "Failed to load product" });
        throw err;
      });
  });

  app.post("/api/users", async (req, res, next) => {
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

  app.post("/api/auth/login", async (req, res, next) => {
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

  app.post("/api/auth/logout", (req, res) => {
    if (!req.session) {
      res.status(200).json({ message: "ok" });
      return;
    }
    req.session.destroy(() => {
      res.status(200).json({ message: "ok" });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    const user = await storage.getUser(req.session.userId as string);
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    res.json({ id: user.id, username: user.username });
  });

  app.use("/api", (_req, res) => {
    res.status(404).json({ message: "Not Found" });
  });

  return httpServer;
}
