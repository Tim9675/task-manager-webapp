import express from "express";

import {
  getCurrentUser,
  login,
  register,
} from "../controllers/authController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";
import { asyncHandler } from "./helpers/asyncHandler.js";

const router = express.Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.get("/me", authMiddleWare, asyncHandler(getCurrentUser));

export default router;
