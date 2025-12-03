import type session from "express-session";
import { storage } from "../storage.js";

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

const getSession = (req: any): (session.Session & Partial<session.SessionData>) | undefined =>
  req.session;

export function requireAuth(req: any, res: any, next: any) {
  const sess = getSession(req);
  if (!sess?.userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  next();
}

export async function requireAdmin(req: any, res: any, next: any) {
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
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}
