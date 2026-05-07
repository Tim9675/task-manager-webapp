import express from "express";
import {
  getTasksToday,
  getTasksUpcoming,
} from "../controllers/datesControllers.js";
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
router.get("/today", getTasksToday); // Learning Point: Static routes (/today) must come before dynamic ones (/:taskId)
router.get("/upcoming", getTasksUpcoming);

// CRUD routes
router.get("/", getTasks);
router.post("/", createTask);
router.get("/:taskId", validateObjectId("taskId"), getTaskById);
router.put("/:taskId", validateObjectId("taskId"), updateTask);
router.delete("/:taskId", validateObjectId("taskId"), deleteTask);

export default router;
