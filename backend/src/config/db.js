import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDatabase() {
  if (!env.databaseUrl) {
    console.warn("DATABASE_URL is not set. Using in-memory development store.");
    return false;
  }

  try {
    await mongoose.connect(env.databaseUrl);
    console.log("MongoDB connected");
    return true;
  } catch (error) {
    console.warn("MongoDB connection failed. Using in-memory development store.");
    console.warn(error.message);
    return false;
  }
}

export function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}
