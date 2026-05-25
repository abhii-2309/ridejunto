import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  databaseUrl: process.env.DATABASE_URL || "",
  jwtSecret: process.env.JWT_SECRET || "development-only-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  geocodeProvider: process.env.GEOCODE_PROVIDER || "nominatim",
  geocodeBaseUrl:
    process.env.GEOCODE_BASE_URL || "https://nominatim.openstreetmap.org",
  geocodeUserAgent:
    process.env.GEOCODE_USER_AGENT || "RideJunto/1.0 local@example.com",
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX || 60)
};
