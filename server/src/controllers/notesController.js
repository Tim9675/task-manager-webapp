import { sanitizeDocument } from "./helpers/sanitizeDocument.js";
import Note from "../models/Note.js";

export async function getNotes(req, res) {
  const userId = req.user.userId;
  const notes = await Note.find({ userId })
    .select("-__v -userId -createdAt -updatedAt")
    .sort({ createdAt: -1 })
    .lean();
  res.status(200).json({ message: "Notes fetched successfully", data: notes });
}

export async function createNote(req, res) {
  const userId = req.user.userId;
  const { title, content, color } = req.body;

  const note = await Note.create({
    userId,
    title,
    content,
    color,
  });

  const resp = sanitizeDocument(note);
  res.status(201).json({ message: "Note created successfully", data: resp });
}

export async function updateNote(req, res) {
  const userId = req.user.userId;
  const { title, content, color } = req.body;

  const updatePayload = {};

  if (title !== undefined) updatePayload.title = title;
  if (content !== undefined) updatePayload.content = content;
  if (color !== undefined) updatePayload.color = color;

  if (!Object.keys(updatePayload).length) {
    return res.status(400).json({ message: "No fields to update" });
  }

  const updatedNote = await Note.findOneAndUpdate(
    { _id: req.params.noteId, userId },
    updatePayload,
    { returnDocument: "after", runValidators: true },
  )
    .select("-__v -userId -createdAt -updatedAt")
    .lean();

  if (!updatedNote) return res.status(404).json({ message: "Note not found" });

  res
    .status(200)
    .json({ message: "Note updated successfully", data: updatedNote });
}

export async function deleteNote(req, res) {
  const userId = req.user.userId;
  const deletedNote = await Note.findOneAndDelete({
    _id: req.params.noteId,
    userId,
  });

  if (!deletedNote) return res.status(404).json({ message: "Note not found" });
  res.status(200).json({ message: "Note deleted successfully" });
}
