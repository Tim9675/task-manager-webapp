import express from "express";

import {
  validateRegister,
  validateLogin,
} from "../validation/authValidation.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";
import { asyncHandler } from "./helpers/asyncHandler.js";
import {
  register,
  login,
  getCurrentUser,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", validateRegister, asyncHandler(register));
router.post("/login", validateLogin, asyncHandler(login));
router.get("/me", authMiddleWare, asyncHandler(getCurrentUser));

export default router;
