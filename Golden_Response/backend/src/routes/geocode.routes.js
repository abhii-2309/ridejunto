import { Router } from "express";
import { reverse, search } from "../controllers/geocode.controller.js";
import { searchRateLimit } from "../middleware/rateLimit.middleware.js";

export const geocodeRouter = Router();

geocodeRouter.get("/search", searchRateLimit, search);
geocodeRouter.get("/reverse", searchRateLimit, reverse);
