import express from "express";
import { validateObjectId } from "../middleware/validateObjectId.js";

import {
  getTasksByTag,
  getTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
} from "../controllers/tagsControllers.js";

const router = express.Router();

router.post("/", createTag);
router.get("/", getTags);
router.get("/:tagId/tasks", validateObjectId("tagId"), getTasksByTag);
router.get("/:tagId", validateObjectId("tagId"), getTagById);
router.put("/:tagId", validateObjectId("tagId"), updateTag);
router.delete("/:tagId", validateObjectId("tagId"), deleteTag);

export default router;
