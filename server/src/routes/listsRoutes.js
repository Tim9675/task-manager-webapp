import express from "express";
import { validateObjectId } from "../middleware/validateObjectId.js";

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

router.post("/", validateCreateList, createList); // works
router.get("/", getLists); // works
router.patch(
  "/:listId",
  validateObjectId("listId"),
  validateUpdateList,
  updateList,
); //works
router.delete("/:listId", validateObjectId("listId"), deleteList); // works

export default router;
