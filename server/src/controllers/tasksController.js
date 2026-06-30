import Task from "../models/Task.js";
import { normalizeDueDate } from "./helpers/normalizeDueDate.js";
import { sanitizeDocument } from "./helpers/sanitizeDocument.js";

export async function getTasks(req, res) {
  const userId = req.user.userId;
  const tasks = await Task.find({ userId })
    .select("-__v -createdAt -updatedAt -userId")
    .sort({ dueDate: 1, createdAt: 1 })
    .lean();
  res.status(200).json({ data: tasks });
}

export async function createTask(req, res) {
  const userId = req.user.userId;
  const { title, description, dueDate, listId, tagIds, subtasks } = req.body;

  const task = await Task.create({
    userId,
    title,
    description,
    dueDate: normalizeDueDate(dueDate),
    listId: listId || null,
    tagIds,
    subtasks,
  });

  const resp = sanitizeDocument(task);
  res.status(201).json({ message: "Task created successfully", data: resp });
}

export async function updateTask(req, res) {
  const userId = req.user.userId;
  const { title, description, dueDate, listId, tagIds, subtasks, checked } =
    req.body;

  const updatePayload = {};

  if (title !== undefined) updatePayload.title = title;
  if (description !== undefined) updatePayload.description = description;
  if (dueDate !== undefined) updatePayload.dueDate = normalizeDueDate(dueDate);
  if (listId !== undefined) updatePayload.listId = listId || null;
  if (tagIds !== undefined) updatePayload.tagIds = tagIds;
  if (subtasks !== undefined) updatePayload.subtasks = subtasks;
  if (checked !== undefined) updatePayload.checked = checked;

  //  VVV Uncomment when TaskForm dirtyfields are implemented VVV

  // if (!Object.keys(updatePayload).length) {
  //   return res.status(400).json({
  //     message: "No fields to update",
  //   });
  // }

  const updatedTask = await Task.findOneAndUpdate(
    { _id: req.params.taskId, userId },
    updatePayload,
    { returnDocument: "after", runValidators: true },
  )
    .select("-__v -createdAt -updatedAt -userId")
    .lean();

  if (!updatedTask) return res.status(404).json({ message: "Task not found" });

  res
    .status(200)
    .json({ message: "Task updated successfully", data: updatedTask });
}

export async function deleteTask(req, res) {
  const userId = req.user.userId;
  const deletedTask = await Task.findOneAndDelete({
    _id: req.params.taskId,
    userId,
  });

  if (!deletedTask) return res.status(404).json({ message: "Task not found" });
  res.status(200).json({ message: "Task deleted successfully" });
}
