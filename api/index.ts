import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import createMemoryStore from "memorystore";
import { createServer } from "http";
import { registerRoutes } from "../server/routes";

const MemoryStore = createMemoryStore(session);

function buildSessionSecret() {
  const secret =
    process.env.SESSION_SECRET ||
    process.env.JWT_SECRET ||
    "dev-secret-change-me";
  if (process.env.NODE_ENV === "production" && secret === "dev-secret-change-me") {
    throw new Error("SESSION_SECRET is required in production");
  }
  return secret;
}

function buildApp() {
  const app = express();
  const httpServer = createServer(app);

  app.use(
    express.json({
      verify: (req: Request & { rawBody?: Buffer }, _res: Response, buf: Buffer) => {
        req.rawBody = buf;
      },
    }),
  );

  app.use(express.urlencoded({ extended: false }));

  app.use(
    session({
      store: new MemoryStore({ checkPeriod: 1000 * 60 * 60 * 24 }),
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

  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    let capturedJsonResponse: unknown | undefined = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson: unknown, ...args: unknown[]) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...(args as [any])]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (req.path.startsWith("/api")) {
        let logLine = `${req.method} ${req.path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }
        console.log(logLine);
      }
    });

    next();
  });

  const ready = registerRoutes(httpServer, app);
  return { app, ready };
}

const { app, ready } = buildApp();

export default async function handler(req: Request, res: Response) {
  await ready;
  return app(req, res);
}
