import rateLimit from "express-rate-limit";
import { env } from "../config/env.js";

export const searchRateLimit = rateLimit({
  windowMs: env.rateLimitWindowMs,
  limit: env.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many search requests. Please slow down.",
    code: "RATE_LIMITED"
  }
});

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again later.",
    code: "AUTH_RATE_LIMITED"
  }
});
