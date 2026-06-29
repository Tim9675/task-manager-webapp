import express from "express";
import {
  getTasksToday,
  getTasksUpcoming,
} from "../controllers/datesController.js";
import { validateObjectId } from "../middleware/validateObjectId.js";
import {
  validateCreateTask,
  validateTaskReferences,
  validateUpdateTask,
} from "../validation/taskValidation.js";

import {
  getTasks,
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
router.post("/", validateCreateTask, validateTaskReferences, createTask);
router.patch(
  "/:taskId",
  validateObjectId("taskId"),
  validateUpdateTask,
  validateTaskReferences,
  updateTask,
);
router.delete("/:taskId", validateObjectId("taskId"), deleteTask);

export default router;
