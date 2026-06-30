import express from "express";

import {
  createNote,
  deleteNote,
  getNotes,
  updateNote,
} from "../controllers/notesController.js";
import { validateObjectId } from "../middleware/validateObjectId.js";
import {
  validateCreateNote,
  validateUpdateNote,
} from "../validation/noteValidation.js";
import { asyncHandler } from "./helpers/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(getNotes));
router.post("/", validateCreateNote, asyncHandler(createNote));
router.patch(
  "/:noteId",
  validateObjectId("noteId"),
  validateUpdateNote,
  asyncHandler(updateNote),
);
router.delete("/:noteId", validateObjectId("noteId"), asyncHandler(deleteNote));

export default router;
