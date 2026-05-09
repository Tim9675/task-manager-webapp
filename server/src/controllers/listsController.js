import Task from "../models/Task.js";
import List from "../models/List.js";
import { getUserId } from "../helpers/getUserId.js";

export async function getTasksByList(req, res) {
  try {
    const userId = getUserId(req);
    const listId = req.params.listId;
    const listExists = await List.exists({
      _id: listId,
      userId,
    });

    if (!listExists) {
      return res.status(404).json({
        message: "List not found",
      });
    }
    const tasks = await Task.find({ userId, listId })
      .sort({ dueDate: 1, createdAt: 1 })
      .lean();
    res.status(200).json({ data: tasks });
  } catch (error) {
    console.log("Error in getTasksByList controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getLists(req, res) {
  try {
    const userId = getUserId(req);
    const lists = await List.find({ userId }).sort({ createdAt: 1 }).lean();
    res.status(200).json({ data: lists });
  } catch (error) {
    console.log("Error in getLists controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getListById(req, res) {
  try {
    const userId = getUserId(req);
    const list = await List.findOne({ _id: req.params.listId, userId }).lean();
    if (!list) return res.status(404).json({ message: "List not found" });
    res.status(200).json({ data: list });
  } catch (error) {
    console.log("Error in getListById controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createList(req, res) {
  try {
    const userId = getUserId(req);
    const { title, color } = req.body;
    const list = new List({
      userId,
      title,
      color,
    });
    await list.save();
    res.status(201).json({ message: "List created successfully", data: list });
  } catch (error) {
    console.log("Error in createList controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateList(req, res) {
  try {
    const userId = getUserId(req);
    const { title, color } = req.body;
    const updatedList = await List.findOneAndUpdate(
      { _id: req.params.listId, userId },
      { title, color },
      { returnDocument: "after", runValidators: true },
    ).lean();
    if (!updatedList)
      return res.status(404).json({ message: "List not found" });
    res
      .status(200)
      .json({ message: "List updated successfully", data: updatedList });
  } catch (error) {
    console.log("Error in updateList controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteList(req, res) {
  try {
    const userId = getUserId(req);
    await Task.updateMany(
      { userId, listId: req.params.listId },
      { $set: { listId: null } },
    );
    const deletedList = await List.findOneAndDelete({
      _id: req.params.listId,
      userId,
    });
    if (!deletedList)
      return res.status(404).json({ message: "List not found" });
    res.status(200).json({ message: "List deleted successfully" });
  } catch (error) {
    console.log("Error in deleteList controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
