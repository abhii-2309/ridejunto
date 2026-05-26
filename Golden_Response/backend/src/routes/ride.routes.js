import { Router } from "express";
import {
  createRide,
  getActiveRides,
  getRide,
  getRideHistory,
  updateRideStatus
} from "../controllers/ride.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

export const rideRouter = Router();

rideRouter.use(requireAuth);
rideRouter.post("/", createRide);
rideRouter.get("/active", getActiveRides);
rideRouter.get("/history", getRideHistory);
rideRouter.get("/:id", getRide);
rideRouter.patch("/:id/status", updateRideStatus);
