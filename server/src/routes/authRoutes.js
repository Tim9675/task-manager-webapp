import express from "express";

import {
  getCurrentUser,
  login,
  register,
} from "../controllers/authController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";
import { asyncHandler } from "./helpers/asyncHandler.js";
import {
  validateRegister,
  validateLogin,
} from "../validation/authValidation.js";

const router = express.Router();

router.post("/register", validateRegister, asyncHandler(register));
router.post("/login", validateLogin, asyncHandler(login));
router.get("/me", authMiddleWare, asyncHandler(getCurrentUser));

export default router;
