import bcrypt from "bcrypt";

import User from "../models/User.js";
import { sanitizeUser } from "./helpers/sanitizeUser.js";
import { normalizeString } from "../helpers/normalizeString.js";
import { signToken } from "./helpers/signToken.js";

export async function register(req, res) {
  const { name, email, password, timezone } = req.body;

  const normalizedName = normalizeString(name);
  const normalizedEmail = normalizeString(email);

  const existingUser = await User.findOne({
    $or: [{ email: normalizedEmail }, { name: normalizedName }],
  }).lean();

  if (existingUser) {
    return res.status(409).json({
      message: "User already exists",
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email: normalizedEmail,
    passwordHash,
    timezone,
  });

  const token = signToken(user._id);
  res.status(201).json({
    message: "Account created successfully",
    user: sanitizeUser(user),
    token,
  });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const normalizedEmail = normalizeString(email);

  const existingUser = await User.findOne({ email: normalizedEmail }).lean();

  if (!existingUser) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const isMatch = await bcrypt.compare(password, existingUser.passwordHash);

  if (!isMatch)
    return res.status(401).json({ message: "Invalid email or password" });

  const token = signToken(existingUser._id);

  return res.status(200).json({
    message: "Account logged in successfully",
    user: sanitizeUser(existingUser),
    token,
  });
}

export async function getCurrentUser(req, res) {
  const userId = req.user.userId;

  const user = await User.findById(userId).select("name email timezone").lean();

  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(200).json({ data: sanitizeUser(user) });
}
