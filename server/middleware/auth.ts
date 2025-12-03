import type { Request, Response, NextFunction } from "express";
import type session from "express-session";
import { storage } from "../storage.js";

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

const getSession = (req: Request): (session.Session & Partial<session.SessionData>) | undefined =>
  (req as any).session;

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const sess = getSession(req);
  if (!sess?.userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  next();
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const sess = getSession(req);
  if (!sess?.userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const user = await storage.getUser(sess.userId);
    if (!user || user.role !== "admin") {
      res.status(403).json({ message: "Forbidden: Admin access required" });
      return;
    }
    (req as any).user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
