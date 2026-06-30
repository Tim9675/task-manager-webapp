import express from "express";

import { validateObjectId } from "../middleware/validateObjectId.js";
import {
  getTags,
  createTag,
  updateTag,
  deleteTag,
} from "../controllers/tagsController.js";
import {
  validateCreateTag,
  validateUpdateTag,
} from "../validation/tagValidation.js";

const router = express.Router();

router.post("/", validateCreateTag, createTag);
router.get("/", getTags);
router.patch(
  "/:tagId",
  validateObjectId("tagId"),
  validateUpdateTag,
  updateTag,
);
router.delete("/:tagId", validateObjectId("tagId"), deleteTag);

export default router;
