import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    lat: { type: Number, required: true, min: -90, max: 90 },
    lng: { type: Number, required: true, min: -180, max: 180 }
  },
  { _id: false }
);

const rideSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    pickup: { type: locationSchema, required: true },
    dropoff: { type: locationSchema, required: true },
    seats: { type: Number, required: true, min: 1, max: 6 },
    status: {
      type: String,
      enum: ["pending", "matched", "accepted", "completed", "cancelled"],
      default: "pending",
      index: true
    },
    estimatedDistanceKm: { type: Number, required: true },
    estimatedDurationMinutes: { type: Number, required: true },
    estimatedFare: { type: Number, required: true }
  },
  { timestamps: true }
);

rideSchema.methods.toJSON = function toJSON() {
  return {
    id: this._id.toString(),
    user: this.user?.toString?.() || this.user,
    pickup: this.pickup,
    dropoff: this.dropoff,
    seats: this.seats,
    status: this.status,
    estimatedDistanceKm: this.estimatedDistanceKm,
    estimatedDurationMinutes: this.estimatedDurationMinutes,
    estimatedFare: this.estimatedFare,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

export const Ride = mongoose.model("Ride", rideSchema);
