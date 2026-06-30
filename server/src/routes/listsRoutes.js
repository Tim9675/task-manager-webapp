import express from "express";

import { validateObjectId } from "../middleware/validateObjectId.js";
import { asyncHandler } from "./helpers/asyncHandler.js";

import {
  getLists,
  createList,
  updateList,
  deleteList,
} from "../controllers/listsController.js";
import {
  validateCreateList,
  validateUpdateList,
} from "../validation/listValidation.js";

const router = express.Router();

router.post("/", validateCreateList, asyncHandler(createList)); // works
router.get("/", asyncHandler(getLists)); // works
router.patch(
  "/:listId",
  validateObjectId("listId"),
  validateUpdateList,
  asyncHandler(updateList),
); //works
router.delete("/:listId", validateObjectId("listId"), asyncHandler(deleteList)); // works

export default router;
