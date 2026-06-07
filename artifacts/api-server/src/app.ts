import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "path";
import { existsSync } from "fs";
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

// Serve the built Vite frontend if the dist folder exists (production / Railway)
const bundleDir = path.dirname(new URL(import.meta.url).pathname);
const frontendDist = path.resolve(bundleDir, "../../../artifacts/cinemate/dist/public");

if (existsSync(frontendDist)) {
  logger.info({ frontendDist }, "Serving static frontend from");
  app.use(express.static(frontendDist));
  app.get("/*path", (_req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
} else {
  logger.info({ frontendDist }, "Frontend dist not found, skipping static serving");
}

export default app;
