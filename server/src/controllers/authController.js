import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { sanitizeUser } from "../helpers/sanitizeUser.js";

export async function register(req, res) {
  try {
    const { name, email, password, timezone } = req.body;
    const normalizedEmail = email.toLowerCase();
    if (!name || !normalizedEmail || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }
    const existingUser = await User.findOne({
      $or: [{ normalizedEmail }, { name }],
    });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      normalizedEmail,
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
    const normalizedEmail = email.toLowerCase();
    if (!normalizedEmail || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }
    const existingUser = await User.findOne({ normalizedEmail }).lean();
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
      user: sanitizeUser(user),
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
    res.status(200).json({ data: user });
  } catch (error) {
    console.log("Error in getCurrentUser", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
