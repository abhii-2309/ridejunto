import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env.js";
import { authRouter } from "./routes/auth.routes.js";
import { geocodeRouter } from "./routes/geocode.routes.js";
import { rideRouter } from "./routes/ride.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware.js";
import { sanitizeRequest } from "./middleware/sanitize.middleware.js";

export function createApp() {
  const app = express();

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" }
    })
  );
  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true
    })
  );
  app.use(express.json({ limit: "64kb" }));
  app.use(sanitizeRequest);

  app.get("/api/health", (req, res) => {
    res.json({
      success: true,
      message: "RideJunto API is healthy",
      timestamp: new Date().toISOString()
    });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/geocode", geocodeRouter);
  app.use("/api/rides", rideRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
