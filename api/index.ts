import express from "express";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import session from "express-session";
import { createServer } from "http";
import type { IncomingMessage, ServerResponse } from "http";
import { registerRoutes } from "../server/routes.js";
import { buildSessionSecret, createSessionStore } from "../server/session-config.js";

type RawBodyRequest = IncomingMessage & { rawBody?: Buffer };

async function buildApp() {
  console.log("🚀 Starting app initialization...");
  const app = express();
  const httpServer = createServer(app);

  app.use(
    express.json({
      verify: (req: RawBodyRequest, _res: ServerResponse, buf: Buffer, _encoding: string) => {
        req.rawBody = buf;
      },
    }),
  );

  app.use(express.urlencoded({ extended: false }));

  console.log("📦 Creating session store...");
  // Use persistent PostgreSQL session store in production
  const sessionStore = createSessionStore(process.env.NODE_ENV);
  console.log("✅ Session store created");

  app.use(
    session({
      store: sessionStore,
      secret: buildSessionSecret(),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      },
    }),
  );
  console.log("✅ Session middleware configured");

  app.use((req: any, res: any, next: any) => {
    const start = Date.now();

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (req.path.startsWith("/api")) {
        let logLine = `${req.method} ${req.path} ${res.statusCode} in ${duration}ms`;
        console.log(logLine);
      }
    });

    next();
  });

  console.log("📝 Registering routes...");
  await registerRoutes(httpServer, app);
  console.log("✅ All routes registered successfully");
  return app;
}

let appPromise: Promise<express.Application> | null = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!appPromise) {
      appPromise = buildApp();
    }
    const app = await appPromise;
    return (app as any)(req, res);
  } catch (error: any) {
    console.error("Handler error:", error);
    // Reset appPromise on error so next request tries again
    appPromise = null;
    res.status(500).json({
      message: "Server initialization error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
}

