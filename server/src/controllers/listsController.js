import Task from "../models/Task.js";
import List from "../models/List.js";

export async function getLists(req, res) {
  try {
    const userId = req.user.userId;
    const lists = await List.find({ userId })
      .select("-__v -createdAt -updatedAt -userId")
      .sort({ createdAt: 1 })
      .lean();
    res.status(200).json({ data: lists });
  } catch (error) {
    console.log("Error in getLists controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createList(req, res) {
  try {
    const userId = req.user.userId;
    const { title, color } = req.body;
    const list = new List({
      userId,
      title,
      color,
    });
    await list.save();
    const resp = list.toObject();
    delete resp.__v;
    delete resp.userId;
    delete resp.createdAt;
    delete resp.updatedAt;
    res.status(201).json({ message: "List created successfully", data: resp });
  } catch (error) {
    console.log("Error in createList controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateList(req, res) {
  try {
    const userId = req.user.userId;
    const { title, color } = req.body;
    const updatedList = await List.findOneAndUpdate(
      { _id: req.params.listId, userId },
      { title, color },
      { returnDocument: "after", runValidators: true },
    )
      .select("-__v -createdAt -updatedAt -userId")
      .lean();
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
    const userId = req.user.userId;
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
