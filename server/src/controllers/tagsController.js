import Task from "../models/Task.js";
import Tag from "../models/Tag.js";
import { sanitizeDocument } from "./helpers/sanitizeDocument.js";

export async function getTags(req, res) {
  const userId = req.user.userId;
  const tags = await Tag.find({ userId })
    .select("-__v -createdAt -updatedAt -userId")
    .sort({ createdAt: 1 })
    .lean();
  res.status(200).json({ data: tags });
}

export async function createTag(req, res) {
  const userId = req.user.userId;
  const { title, color } = req.body;

  const tag = await Tag.create({
    userId,
    title,
    color,
  });

  const resp = sanitizeDocument(tag);
  res.status(201).json({ message: "Tag created successfully", data: resp });
}

export async function updateTag(req, res) {
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

  const updatedTag = await Tag.findOneAndUpdate(
    { _id: req.params.tagId, userId },
    updatePayload,
    { returnDocument: "after", runValidators: true },
  )
    .select("-__v -createdAt -updatedAt -userId")
    .lean();

  if (!updatedTag) return res.status(404).json({ message: "Tag not found" });
  res
    .status(200)
    .json({ message: "Tag updated successfully", data: updatedTag });
}

export async function deleteTag(req, res) {
  const userId = req.user.userId;

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
}
