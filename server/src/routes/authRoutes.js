import express from "express";
import {
  getCurrentUser,
  login,
  register,
} from "../controllers/authController.js";
import { authMiddleWare } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleWare, getCurrentUser);

export default router;
