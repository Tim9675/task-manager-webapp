import express from "express";

import { validateObjectId } from "../middleware/validateObjectId.js";
import {
  validateCreateList,
  validateUpdateList,
} from "../validation/listValidation.js";
import { asyncHandler } from "./helpers/asyncHandler.js";
import {
  getLists,
  createList,
  updateList,
  deleteList,
} from "../controllers/listsController.js";

const router = express.Router();

router.get("/", asyncHandler(getLists));
router.post("/", validateCreateList, asyncHandler(createList));
router.patch(
  "/:listId",
  validateObjectId("listId"),
  validateUpdateList,
  asyncHandler(updateList),
);
router.delete("/:listId", validateObjectId("listId"), asyncHandler(deleteList));

export default router;
