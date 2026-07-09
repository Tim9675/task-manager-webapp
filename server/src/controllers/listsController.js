import Task from "../models/Task.js";
import List from "../models/List.js";
import { sanitizeDocument } from "./helpers/sanitizeDocument.js";

export async function getLists(req, res) {
  const userId = req.user.userId;
  const lists = await List.find({ userId })
    .select("-__v -createdAt -updatedAt -userId")
    .sort({ createdAt: 1 })
    .lean();
  res.status(200).json({ data: lists });
}

export async function createList(req, res) {
  const userId = req.user.userId;
  const { title, color } = req.body;

  const list = await List.create({
    userId,
    title,
    color,
  });

  const resp = sanitizeDocument(list);
  res.status(201).json({ message: "List created successfully", data: resp });
}

export async function updateList(req, res) {
  const userId = req.user.userId;
  const { title, color } = req.body;

  const updatePayload = {};

  if (title !== undefined) updatePayload.title = title;
  if (color !== undefined) updatePayload.color = color;

  if (!Object.keys(updatePayload).length) {
    return res.status(400).json({
      message: "No fields to update",
    });
  }

  const updatedList = await List.findOneAndUpdate(
    { _id: req.params.listId, userId },
    updatePayload,
    { returnDocument: "after", runValidators: true },
  )
    .select("-__v -createdAt -updatedAt -userId")
    .lean();

  if (!updatedList) return res.status(404).json({ message: "List not found" });
  res
    .status(200)
    .json({ message: "List updated successfully", data: updatedList });
}

export async function deleteList(req, res) {
  const userId = req.user.userId;

  await Task.updateMany(
    { userId, listId: req.params.listId },
    { $set: { listId: null } },
  );

  const deletedList = await List.findOneAndDelete({
    _id: req.params.listId,
    userId,
  });

  if (!deletedList) return res.status(404).json({ message: "List not found" });
  res.status(200).json({ message: "List deleted successfully" });
}
