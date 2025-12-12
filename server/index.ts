import 'dotenv/config';
import http from "http";
import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import helmet from "helmet";
import { registerRoutes } from "./routes.js";
import { serveStatic } from "./static.js";
import { createSessionStore, buildSessionSecret } from "./session-config.js";
import { corsConfig, sanitizeBody, securityLogger } from "./middleware/security.js";

// Extend express Request type for rawBody
declare global {
  namespace Express {
    interface Request {
      rawBody?: Buffer;
    }
  }
}

const app = express();
const httpServer = http.createServer(app);

// Trust proxy for Vercel/production deployments
// Required for secure cookies to work behind a reverse proxy
// Trust proxy for Vercel/production/dev tunnels
// Required for secure cookies to work behind a reverse proxy
app.set("trust proxy", 1);

// Security: Helmet for comprehensive HTTP security headers
app.use(helmet({
  contentSecurityPolicy: false, // Using custom CSP if needed
  crossOriginEmbedderPolicy: false, // Allow embedding resources
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin resources
}));

// Security: CORS configuration
app.use(corsConfig);

// Security: Request body sanitization
app.use(sanitizeBody);

// Security: Log suspicious activity
app.use(securityLogger);

app.use(
  express.json({
    limit: '10mb', // Increase limit for base64 images
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration
const sessionStore = createSessionStore(process.env.NODE_ENV, { enableCleanupTimer: true });

// Log session store type
if (process.env.NODE_ENV === "production" && process.env.DATABASE_URL) {
  console.log("Using PostgreSQL session store for persistence");
} else {
  console.log("Using in-memory session store (development mode)");
}

app.use(
  session({
    store: sessionStore,
    secret: buildSessionSecret(),
    resave: false,
    saveUninitialized: false,
    rolling: true, // Extend session on every request
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      path: "/", // Explicit path for all routes
      sameSite: "lax", // "lax" is preferred for same-origin (frontend served by backend)
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      httpOnly: true, // Cookie not accessible via JavaScript (security)
    },
  }),
);

type LogLevel = "info" | "warn" | "error" | "debug";

interface HttpError extends Error {
  status?: number;
  statusCode?: number;
  expose?: boolean;
}

export function log(message: string, source = "express", level: LogLevel = "info") {
  const formattedTime = new Date().toISOString();
  const logMessage = JSON.stringify({
    timestamp: formattedTime,
    level,
    source,
    message,
    env: process.env.NODE_ENV,
  });

  // In production, use structured logging
  if (process.env.NODE_ENV === "production") {
    switch (level) {
      case "error":
        console.error(String(logMessage).replace(/\n|\r/g, ""));
        break;
      case "warn":
        console.warn(String(logMessage).replace(/\n|\r/g, ""));
        break;
      default:
        console.log(String(logMessage).replace(/\n|\r/g, ""));
    }
  } else {
    // In development, use readable format
    const time = new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    console.log(`${time} [${level.toUpperCase()}] [${source}] ${message}`);
  }
}

app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json.bind(res);
  res.json = function (bodyJson: any) {
    capturedJsonResponse = bodyJson;
    return originalResJson(bodyJson);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        const keys =
          typeof capturedJsonResponse === "object" && capturedJsonResponse !== null
            ? Object.keys(capturedJsonResponse).slice(0, 5)
            : [];
        const size = JSON.stringify(capturedJsonResponse).length;
        const totalKeys =
          typeof capturedJsonResponse === "object" && capturedJsonResponse !== null
            ? Object.keys(capturedJsonResponse).length
            : keys.length;
        logLine += ` :: bodyKeys=${keys.join(",") || "none"}${totalKeys > keys.length ? "+" : ""} size=${size}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(httpServer, app);

  app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
    const httpError = err as HttpError;
    const status =
      typeof httpError.status === "number"
        ? httpError.status
        : typeof httpError.statusCode === "number"
          ? httpError.statusCode
          : 500;
    const message =
      httpError.expose === true
        ? httpError.message
        : httpError.message || "Internal Server Error";

    // Log error with context
    const errorContext = {
      error: httpError.message,
      stack: process.env.NODE_ENV === "development" ? httpError.stack : undefined,
      method: req.method,
      path: req.path,
      statusCode: status,
      userAgent: req.get("user-agent"),
      ip: req.ip,
    };

    log(JSON.stringify(errorContext), "error-handler", "error");
    res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
})();
