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

const router = express.Router();

router.get("/", getNotes);
router.post("/", validateCreateNote, createNote);
router.patch(
  "/:noteId",
  validateObjectId("noteId"),
  validateUpdateNote,
  updateNote,
);
router.delete("/:noteId", validateObjectId("noteId"), deleteNote);

export default router;
