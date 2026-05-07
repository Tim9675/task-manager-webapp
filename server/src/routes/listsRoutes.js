import express from "express";
import { validateObjectId } from "../middleware/validateObjectId.js";

import {
  getTasksByList,
  getLists,
  getListById,
  createList,
  updateList,
  deleteList,
} from "../controllers/listsController.js";

const router = express.Router();

router.post("/", createList); // works
router.get("/", getLists); // works
router.get("/:listId/tasks", validateObjectId("listId"), getTasksByList); // works
router.get("/:listId", validateObjectId("listId"), getListById); // works
router.put("/:listId", validateObjectId("listId"), updateList); //works
router.delete("/:listId", validateObjectId("listId"), deleteList); // works

export default router;
