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

  // Check if session exists
  if (!sess) {
    console.error("❌ No session found - Environment variables may not be configured");
    res.status(401).json({
      message: "Session not configured. Please check Vercel environment variables (DATABASE_URL, SESSION_SECRET, NODE_ENV).",
      error: "NO_SESSION"
    });
    return;
  }

  // Check if user is logged in
  if (!sess.userId) {
    console.error("❌ No userId in session - User not logged in");
    res.status(401).json({
      message: "Unauthorized - Please login as admin",
      error: "NOT_LOGGED_IN"
    });
    return;
  }

  try {
    const user = await storage.getUser(sess.userId);

    if (!user) {
      console.error("❌ User not found in database:", sess.userId);
      res.status(401).json({
        message: "User not found",
        error: "USER_NOT_FOUND"
      });
      return;
    }

    if (user.role !== "admin") {
      console.error("❌ User is not admin:", user.email, "- Role:", user.role);
      res.status(403).json({
        message: "Forbidden: Admin access required. Your role: " + user.role,
        error: "NOT_ADMIN"
      });
      return;
    }

    console.log("✅ Admin authenticated:", user.email);
    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Error in requireAdmin:", error);
    res.status(500).json({
      message: "Internal server error",
      error: "SERVER_ERROR"
    });
  }
}
