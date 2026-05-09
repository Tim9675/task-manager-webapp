import express from "express";
import {
  createNote,
  deleteNote,
  getNotes,
  updateNote,
} from "../controllers/notesController.js";
import { validateObjectId } from "../middleware/validateObjectId.js";

const router = express.Router();

router.get("/", getNotes);
router.post("/", createNote);
router.put("/:noteId", validateObjectId("noteId"), updateNote);
router.delete("/:noteId", validateObjectId("noteId"), deleteNote);

export default router;
