import express from "express";
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTasksToday,
  // getTasksUpcoming,
} from "../controllers/tasksController.js";

const router = express.Router();

router.get("/", getTasks);
router.get("/today", getTasksToday); // Learning Point: Routes need to be ordered from most specific to least specific, otherwise /:id will catch "today" as an id
// router.get("/upcoming", getTasksUpcoming);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

export default router;
