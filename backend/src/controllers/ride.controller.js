import crypto from "crypto";
import { isDatabaseConnected } from "../config/db.js";
import { Ride } from "../models/Ride.js";
import { memoryStore } from "../utils/memoryStore.js";
import { httpError } from "../utils/httpError.js";
import { parseLocation } from "../utils/validators.js";
import { buildRideEstimate } from "../utils/estimates.js";
import { buildRideMatches } from "../services/match.service.js";
import { emitRideUpdate } from "../sockets/ride.socket.js";

export async function createRide(req, res, next) {
  try {
    const pickup = parseLocation(req.body.pickup);
    const dropoff = parseLocation(req.body.dropoff);
    const seats = Number(req.body.seats);

    if (!pickup) throw httpError(400, "Pickup location is required", "INVALID_PICKUP");
    if (!dropoff) throw httpError(400, "Drop-off location is required", "INVALID_DROPOFF");
    if (!Number.isInteger(seats) || seats < 1 || seats > 6) {
      throw httpError(400, "Seats must be between 1 and 6", "INVALID_SEATS");
    }

    const estimate = buildRideEstimate(pickup, dropoff, seats);
    let ride;

    if (isDatabaseConnected()) {
      ride = await Ride.create({
        user: req.userId,
        pickup,
        dropoff,
        seats,
        ...estimate
      });
      ride = ride.toJSON();
    } else {
      ride = {
        id: crypto.randomUUID(),
        user: req.userId,
        pickup,
        dropoff,
        seats,
        status: "pending",
        ...estimate,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      memoryStore.rides.push(ride);
    }

    const activeRides = await getActiveRideList(req.userId);
    const matches = buildRideMatches(ride, activeRides);

    emitRideUpdate("ride:created", { ride, matches });
    emitRideUpdate("ride:matched", { ride, matches });

    res.status(201).json({
      success: true,
      message: "Ride request created",
      ride,
      matches
    });
  } catch (error) {
    next(error);
  }
}

export async function getActiveRides(req, res, next) {
  try {
    const rides = await getActiveRideList(req.userId);
    res.json({ success: true, rides });
  } catch (error) {
    next(error);
  }
}

export async function getRideHistory(req, res, next) {
  try {
    let rides;
    if (isDatabaseConnected()) {
      const docs = await Ride.find({ user: req.userId }).sort({ createdAt: -1 }).limit(50);
      rides = docs.map((ride) => ride.toJSON());
    } else {
      rides = memoryStore.rides
        .filter((ride) => ride.user === req.userId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    res.json({ success: true, rides });
  } catch (error) {
    next(error);
  }
}

export async function getRide(req, res, next) {
  try {
    const ride = await findUserRide(req.params.id, req.userId);
    if (!ride) throw httpError(404, "Ride not found", "RIDE_NOT_FOUND");
    res.json({ success: true, ride });
  } catch (error) {
    next(error);
  }
}

export async function updateRideStatus(req, res, next) {
  try {
    const allowed = ["pending", "matched", "accepted", "completed", "cancelled"];
    const status = String(req.body.status || "");

    if (!allowed.includes(status)) {
      throw httpError(400, "Ride status is invalid", "INVALID_STATUS");
    }

    let ride;
    if (isDatabaseConnected()) {
      const doc = await Ride.findOneAndUpdate(
        { _id: req.params.id, user: req.userId },
        { status },
        { new: true }
      );
      ride = doc?.toJSON();
    } else {
      ride = memoryStore.rides.find(
        (item) => item.id === req.params.id && item.user === req.userId
      );
      if (ride) {
        ride.status = status;
        ride.updatedAt = new Date().toISOString();
      }
    }

    if (!ride) throw httpError(404, "Ride not found", "RIDE_NOT_FOUND");

    emitRideUpdate("ride:status-updated", { ride });
    res.json({ success: true, message: "Ride status updated", ride });
  } catch (error) {
    next(error);
  }
}

async function findUserRide(id, userId) {
  if (isDatabaseConnected()) {
    const doc = await Ride.findOne({ _id: id, user: userId });
    return doc?.toJSON();
  }
  return memoryStore.rides.find((ride) => ride.id === id && ride.user === userId);
}

async function getActiveRideList(userId) {
  if (isDatabaseConnected()) {
    const docs = await Ride.find({
      user: userId,
      status: { $in: ["pending", "matched", "accepted"] }
    })
      .sort({ createdAt: -1 })
      .limit(25);
    return docs.map((ride) => ride.toJSON());
  }

  return memoryStore.rides
    .filter(
      (ride) =>
        ride.user === userId && ["pending", "matched", "accepted"].includes(ride.status)
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}
