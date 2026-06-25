import Task from "../models/Task.js";
import Tag from "../models/Tag.js";

export async function getTags(req, res) {
  try {
    const userId = req.user.userId;
    const tags = await Tag.find({ userId })
      .select("-__v -createdAt -updatedAt -userId")
      .sort({ createdAt: 1 })
      .lean();
    res.status(200).json({ data: tags });
  } catch (error) {
    console.log("Error in getTags controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createTag(req, res) {
  try {
    const userId = req.user.userId;
    const { title, color } = req.body;
    const tag = new Tag({
      userId,
      title,
      color, // validate color
    });
    await tag.save();
    const resp = tag.toObject();
    delete resp.__v;
    delete resp.userId;
    delete resp.createdAt;
    delete resp.updatedAt;
    res.status(201).json({ message: "Tag created successfully", data: resp });
  } catch (error) {
    console.log("Error in createTag controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateTag(req, res) {
  try {
    const userId = req.user.userId;
    const { title, color } = req.body;
    const updatedTag = await Tag.findOneAndUpdate(
      { _id: req.params.tagId, userId },
      { title, color },
      { returnDocument: "after", runValidators: true },
    )
      .select("-__v -createdAt -updatedAt -userId")
      .lean();
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
  } catch (error) {
    console.log("Error in deleteTag controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
