import express from "express";
import {
  getTasksToday,
  getTasksUpcoming,
} from "../controllers/dateControllers.js";
import { validateObjectId } from "../middleware/validateObjectId.js";

import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/tasksController.js";

const router = express.Router();

// date-related routes
router.get("/today", getTasksToday); // Learning Point: Static routes (/today) must come before dynamic ones (/:id)
router.get("/upcoming", getTasksUpcoming);

// CRUD routes
router.get("/", getTasks);
router.post("/", createTask);
router.get("/:id", validateObjectId(), getTaskById);
router.put("/:id", validateObjectId(), updateTask);
router.delete("/:id", validateObjectId(), deleteTask);

export default router;
