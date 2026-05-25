import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { isDatabaseConnected } from "../config/db.js";
import { User } from "../models/User.js";
import { memoryStore } from "../utils/memoryStore.js";
import { httpError } from "../utils/httpError.js";

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      throw httpError(401, "Authentication token is required", "UNAUTHORIZED");
    }

    const payload = jwt.verify(token, env.jwtSecret);
    let user;

    if (isDatabaseConnected()) {
      user = await User.findById(payload.sub);
    } else {
      user = memoryStore.users.find((item) => item.id === payload.sub);
    }

    if (!user) {
      throw httpError(401, "User session is no longer valid", "UNAUTHORIZED");
    }

    req.user = user;
    req.userId = payload.sub;
    next();
  } catch (error) {
    next(
      error.status
        ? error
        : httpError(401, "Invalid or expired session", "UNAUTHORIZED")
    );
  }
}
