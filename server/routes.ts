import type { Express, Request, Response, NextFunction } from "express";
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

const demoProducts = [
  {
    id: "fluval-407",
    name: "Fluval 407 Performance Canister Filter",
    price: 285000,
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=800&q=80&auto=format&fit=crop",
  },
  {
    id: "seachem-prime",
    name: "Seachem Prime Water Conditioner 500ml",
    price: 55000,
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=800&q=80&auto=format&fit=crop",
  },
  {
    id: "anubias-nana",
    name: "Anubias Nana Live Aquarium Plant",
    price: 35000,
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?w=800&q=80&auto=format&fit=crop",
  },
];

function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
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
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: Date.now() });
  });

  app.get("/api/products", (_req, res) => {
    res.json({ products: demoProducts });
  });

  app.get("/api/products/:id", (req, res) => {
    const product = demoProducts.find((p) => p.id === req.params.id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json(product);
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
      if (!user || user.password !== hashPassword(payload.password)) {
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
