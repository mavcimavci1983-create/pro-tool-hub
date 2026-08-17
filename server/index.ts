import "dotenv/config";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

// Required for SharedArrayBuffer (FFmpeg.wasm) and cross-origin isolation in dev
app.use((_req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Strict API routes — all must return JSON (never HTML). Unmatched /api/* → 404 JSON (see vite.ts).
  app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok", timestamp: Date.now() });
  });

  await registerRoutes(httpServer, app);

  // All errors must return JSON — never HTML (prevents "Unexpected token <" on client)
  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    res.setHeader("Content-Type", "application/json");
    return res.status(status).json({ error: message });
  });

  // ads.txt from project root (before SPA static so it is not overridden)
  app.get("/ads.txt", (_req, res) => {
    const adsPath = join(process.cwd(), "ads.txt");
    if (!existsSync(adsPath)) {
      return res.status(404).type("text/plain").send("ads.txt not found");
    }
    res.type("text/plain");
    res.sendFile(adsPath);
  });

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const PORT_FIXED = Number(process.env.PORT) || 5001;
  httpServer.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      console.error(`[server] Port ${PORT_FIXED} is already in use. Stop the other process or run: Get-NetTCPConnection -LocalPort ${PORT_FIXED} | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }`);
    } else {
      console.error("[server] Listen error:", err);
    }
    process.exit(1);
  });
  httpServer.listen(PORT_FIXED, "0.0.0.0", () => {
    log(`serving on port ${PORT_FIXED}`);
  });
})();
