import crypto from "crypto";
import session from "express-session";
import createMemoryStore from "memorystore";
import { DrizzleSessionStore } from "./session-store.js";

const DAY_MS = 1000 * 60 * 60 * 24;

export function buildSessionSecret(env = process.env.NODE_ENV): string {
  const secret = process.env.SESSION_SECRET || process.env.JWT_SECRET;

  if (!secret) {
    if (env === "production") {
      // In production without SESSION_SECRET, generate random one but warn
      console.warn("⚠️ SESSION_SECRET not set in production. Using random secret (sessions won't persist across restarts)");
      return crypto.randomBytes(32).toString("hex");
    }
    // Generate a strong per-boot secret for development to avoid weak defaults
    return crypto.randomBytes(32).toString("hex");
  }

  if (env === "production" && secret.length < 32) {
    console.warn("⚠️ SESSION_SECRET should be at least 32 characters in production");
  }

  return secret;
}

export function createSessionStore(
  env = process.env.NODE_ENV,
  options?: { enableCleanupTimer?: boolean },
): session.Store {
  const usePersistentStore = env === "production" && Boolean(process.env.DATABASE_URL);

  if (usePersistentStore) {
    const drizzleStore = new DrizzleSessionStore();
    if (options?.enableCleanupTimer) {
      // Only attach an interval on long-lived hosts; serverless relies on opportunistic cleanup
      drizzleStore.startCleanupTimer();
    }
    return drizzleStore;
  }

  const MemoryStore = createMemoryStore(session);
  return new MemoryStore({ checkPeriod: DAY_MS });
}
