import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { env } from "../config/env.js";
import { isDatabaseConnected } from "../config/db.js";
import { User } from "../models/User.js";
import { memoryStore } from "../utils/memoryStore.js";
import { cleanString, isValidEmail, isValidPhone } from "../utils/validators.js";
import { httpError } from "../utils/httpError.js";

export async function register(req, res, next) {
  try {
    const name = cleanString(req.body.name);
    const email = cleanString(req.body.email).toLowerCase();
    const phone = cleanString(req.body.phone);
    const password = String(req.body.password || "");

    if (!name) throw httpError(400, "Name is required", "INVALID_NAME");
    if (!isValidEmail(email)) throw httpError(400, "Email is invalid", "INVALID_EMAIL");
    if (!isValidPhone(phone)) throw httpError(400, "Phone number is invalid", "INVALID_PHONE");
    if (password.length < 8) {
      throw httpError(400, "Password must be at least 8 characters", "INVALID_PASSWORD");
    }

    const passwordHash = await bcrypt.hash(password, 12);
    let user;

    if (isDatabaseConnected()) {
      const exists = await User.findOne({ email });
      if (exists) throw httpError(409, "Email is already registered", "EMAIL_EXISTS");
      user = await User.create({ name, email, phone, passwordHash });
    } else {
      if (memoryStore.users.some((item) => item.email === email)) {
        throw httpError(409, "Email is already registered", "EMAIL_EXISTS");
      }
      user = {
        id: crypto.randomUUID(),
        name,
        email,
        phone,
        passwordHash,
        toSafeJSON() {
          return { id: this.id, name: this.name, email: this.email, phone: this.phone };
        }
      };
      memoryStore.users.push(user);
    }

    const safeUser = toSafeUser(user);
    const token = signToken(safeUser.id);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: safeUser
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const email = cleanString(req.body.email).toLowerCase();
    const password = String(req.body.password || "");

    if (!isValidEmail(email)) throw httpError(400, "Email is invalid", "INVALID_EMAIL");
    if (!password) throw httpError(400, "Password is required", "INVALID_PASSWORD");

    const user = isDatabaseConnected()
      ? await User.findOne({ email })
      : memoryStore.users.find((item) => item.email === email);

    if (!user) throw httpError(401, "Invalid email or password", "INVALID_CREDENTIALS");

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw httpError(401, "Invalid email or password", "INVALID_CREDENTIALS");

    const safeUser = toSafeUser(user);
    const token = signToken(safeUser.id);

    res.json({
      success: true,
      message: "Authenticated successfully",
      token,
      user: safeUser
    });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res) {
  res.json({
    success: true,
    user: toSafeUser(req.user)
  });
}

export function logout(req, res) {
  res.json({
    success: true,
    message: "Logged out successfully"
  });
}

function signToken(userId) {
  return jwt.sign({ sub: userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn
  });
}

function toSafeUser(user) {
  if (typeof user.toSafeJSON === "function") return user.toSafeJSON();
  return { id: user.id, name: user.name, email: user.email, phone: user.phone };
}
