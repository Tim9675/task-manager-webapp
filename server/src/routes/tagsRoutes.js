import express from "express";
import { validateObjectId } from "../middleware/validateObjectId.js";

import {
  getTags,
  createTag,
  updateTag,
  deleteTag,
} from "../controllers/tagsController.js";

const router = express.Router();

router.post("/", createTag);
router.get("/", getTags);
router.patch("/:tagId", validateObjectId("tagId"), updateTag);
router.delete("/:tagId", validateObjectId("tagId"), deleteTag);

export default router;
