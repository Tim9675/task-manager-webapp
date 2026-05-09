import Task from "../models/Task.js";
import Tag from "../models/Tag.js";
import { getUserId } from "../helpers/getUserId.js";

export async function getTasksByTag(req, res) {
  try {
    const userId = getUserId(req);
    const tagId = req.params.tagId;
    const tagExists = await Tag.exists({
      _id: tagId,
      userId,
    });
    if (!tagExists) {
      return res.status(404).json({
        message: "Tag not found",
      });
    }
    const tasks = await Task.find({
      userId,
      tagIds: tagId,
    })
      .sort({ dueDate: 1, createdAt: 1 })
      .lean();
    res.status(200).json({ data: tasks });
  } catch (error) {
    console.log("Error in getTasksByTag controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getTags(req, res) {
  try {
    const userId = getUserId(req);
    const tags = await Tag.find({ userId }).sort({ createdAt: 1 }).lean();
    res.status(200).json({ data: tags });
  } catch (error) {
    console.log("Error in getTags controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getTagById(req, res) {
  try {
    const userId = getUserId(req);
    const tag = await Tag.findOne({ _id: req.params.tagId, userId }).lean();
    if (!tag) return res.status(404).json({ message: "Tag not found" });
    res.status(200).json({ data: tag });
  } catch (error) {
    console.log("Error in getTagById controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createTag(req, res) {
  try {
    const userId = getUserId(req);
    const { title, color } = req.body;
    const tag = new Tag({
      userId,
      title,
      color, // validate color
    });
    await tag.save();
    res.status(201).json({ message: "Tag created successfully", data: tag });
  } catch (error) {
    console.log("Error in createTag controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateTag(req, res) {
  try {
    const userId = getUserId(req);
    const { title, color } = req.body;
    const updatedTag = await Tag.findOneAndUpdate(
      { _id: req.params.tagId, userId },
      { title, color },
      { returnDocument: "after", runValidators: true },
    ).lean();
    if (!updatedTag) return res.status(404).json({ message: "Tag not found" });
    res
      .status(200)
      .json({ message: "Tag updated successfully", data: updatedTag });
  } catch (error) {
    console.log("Error in updateTag controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteTag(req, res) {
  try {
    const userId = getUserId(req);
    await Task.updateMany(
      { userId, tagIds: req.params.tagId },
      { $pull: { tagIds: req.params.tagId } },
    );
    const deletedTag = await Tag.findOneAndDelete({
      _id: req.params.tagId,
      userId,
    });
    if (!deletedTag) return res.status(404).json({ message: "Tag not found" });
    res.status(200).json({ message: "Tag deleted successfully" });
  } catch (error) {
    console.log("Error in deleteTag controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
