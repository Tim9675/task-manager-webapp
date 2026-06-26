import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import { sanitizeUser } from "../helpers/sanitizeUser.js";
import { EMAILPATTERN, PASSWORDPATTERN } from "../constants/validation.js";

export async function register(req, res) {
  let errorMessage = [];
  try {
    const { name, email, password, timezone } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    if (!name || !normalizedEmail || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }
    if (name.length < 2 || name.length > 30) {
      errorMessage.push("Name must be between 2 and 30 characters");
    }
    if (!EMAILPATTERN.test(normalizedEmail)) {
      errorMessage.push("Invalid email address");
    }
    if (!PASSWORDPATTERN.test(password)) {
      errorMessage.push(
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      );
    }
    if (errorMessage.length > 0) {
      return res.status(400).json({ message: errorMessage });
    }
    if (!Intl.supportedValuesOf("timeZone").includes(timezone)) {
      return res.status(400).json({ message: "Invalid timezone" });
    }
    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { name: name.toLowerCase() }],
    });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email: normalizedEmail,
      passwordHash,
      timezone,
    });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
    res.status(201).json({
      message: "Account created successfully",
      user: sanitizeUser(user),
      token,
    });
  } catch (error) {
    console.log("Error in register controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }
    const existingUser = await User.findOne({ email: normalizedEmail }).lean();
    if (!existingUser) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    const isMatch = await bcrypt.compare(password, existingUser.passwordHash);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });
    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" },
    );
    return res.status(200).json({
      message: "Account logged in successfully",
      user: sanitizeUser(existingUser),
      token,
    });
  } catch (error) {
    console.log("Error in login controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getCurrentUser(req, res) {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId)
      .select("name email timezone")
      .lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ data: sanitizeUser(user) });
  } catch (error) {
    console.log("Error in getCurrentUser", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
