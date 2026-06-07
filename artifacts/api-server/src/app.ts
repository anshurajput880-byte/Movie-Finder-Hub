import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "path";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// In production (Railway), serve the built Vite frontend
if (process.env.NODE_ENV === "production") {
  // Use import.meta.url so the path is always relative to the built bundle
  // (dist/index.mjs → ../../.. → repo root → artifacts/cinemate/dist/public)
  const bundleDir = path.dirname(new URL(import.meta.url).pathname);
  const frontendDist = path.resolve(bundleDir, "../../../artifacts/cinemate/dist/public");
  logger.info({ frontendDist }, "Serving static frontend from");
  app.use(express.static(frontendDist));
  // All non-API routes serve index.html so client-side routing works
  app.get("*", (_req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

export default app;
