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
import { asyncHandler } from "./helpers/asyncHandler.js";

const router = express.Router();

router.post("/", validateCreateTag, asyncHandler(createTag));
router.get("/", asyncHandler(getTags));
router.patch(
  "/:tagId",
  validateObjectId("tagId"),
  validateUpdateTag,
  asyncHandler(updateTag),
);
router.delete("/:tagId", validateObjectId("tagId"), asyncHandler(deleteTag));

export default router;
