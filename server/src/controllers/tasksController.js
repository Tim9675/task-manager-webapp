import Task from "../models/Task.js";
import { getUserId } from "../helpers/getUserId.js";

export async function getTasks(req, res) {
  try {
    const userId = getUserId(req);
    const tasks = await Task.find({ userId })
      .sort({ dueDate: 1, createdAt: 1 })
      .lean();
    res.status(200).json({ data: tasks });
  } catch (error) {
    console.error("Error in getTasks controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getTaskById(req, res) {
  try {
    const userId = getUserId(req);
    const task = await Task.findOne({ _id: req.params.id, userId }).lean();
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ data: task });
  } catch (error) {
    console.error("Error in getTaskById controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createTask(req, res) {
  try {
    const userId = getUserId(req);
    const { title, description, dueDate, listId, tagIds, subtasks } = req.body;

    // Always send ISO 8601 with timezone
    // (e.g. "2026-05-06T23:59:59.999+08:00" or "2026-05-06T15:59:59.999Z")
    // ^^^ SAME WITH updateTask ^^^

    const parsedDate = dueDate ? new Date(dueDate) : null;

    if (parsedDate && isNaN(parsedDate))
      return res.status(400).json({ message: "Invalid dueDate" });

    const task = new Task({
      userId,
      title,
      description,
      dueDate: parsedDate,
      listId,
      tagIds,
      subtasks,
    });

    await task.save();
    res.status(201).json({ message: "Task created successfully", data: task });
  } catch (error) {
    console.log("Error in createTask controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateTask(req, res) {
  try {
    const userId = getUserId(req);
    const { title, description, dueDate, listId, tagIds, subtasks, checked } =
      req.body;

    const updatePayload = {
      title,
      description,
      listId,
      tagIds,
      subtasks,
      checked,
    };

    if (dueDate !== undefined) {
      const parsedDate = dueDate ? new Date(dueDate) : null;

      if (parsedDate && isNaN(parsedDate)) {
        return res.status(400).json({ message: "Invalid dueDate" });
      }

      updatePayload.dueDate = parsedDate;
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, userId },
      updatePayload,
      { returnDocument: "after" },
    ).lean();

    if (!updatedTask)
      return res.status(404).json({ message: "Task not found" });

    res
      .status(200)
      .json({ message: "Task updated successfully", data: updatedTask });
  } catch (error) {
    console.log("Error in updateTask controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteTask(req, res) {
  try {
    const userId = getUserId(req);
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      userId,
    });

    if (!deletedTask)
      return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.log("Error in deleteTask controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
