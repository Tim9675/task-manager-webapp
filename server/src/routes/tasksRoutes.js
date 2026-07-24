import express from "express";

import {
  getTasksToday,
  getTasksUpcoming,
} from "../controllers/datesController.js";
import { validateObjectId } from "../middleware/validateObjectId.js";
import {
  validateCreateTask,
  validateUpdateTask,
  validateTaskReferences,
} from "../validation/taskValidation.js";
import { asyncHandler } from "./helpers/asyncHandler.js";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/tasksController.js";

const router = express.Router();

router.get("/today", getTasksToday);
router.get("/upcoming", getTasksUpcoming);

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
