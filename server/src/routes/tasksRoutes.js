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
import { asyncHandler } from "./helpers/asyncHandler.js";

const router = express.Router();

// date-related routes
router.get("/today", getTasksToday); // Learning Point: Static routes (/today) must come before dynamic ones (/:taskId)
router.get("/upcoming", getTasksUpcoming);

// CRUD routes
router.get("/", asyncHandler(getTasks));
router.post(
  "/",
  validateCreateTask,
  validateTaskReferences,
  asyncHandler(createTask),
);
router.patch(
  "/:taskId",
  validateObjectId("taskId"),
  validateUpdateTask,
  validateTaskReferences,
  asyncHandler(updateTask),
);
router.delete("/:taskId", validateObjectId("taskId"), asyncHandler(deleteTask));

export default router;
