import Note from "../models/Note.js";

export async function getNotes(req, res) {
  try {
    const userId = req.user.userId;
    const notes = await Note.find({ userId })
      .select("-__v -userId -createdAt -updatedAt")
      .sort({ createdAt: -1 })
      .lean();
    res.status(200).json({ data: notes });
  } catch (error) {
    console.log("Error in getNotes controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createNote(req, res) {
  try {
    const userId = req.user.userId;
    const { title, content, color } = req.body;
    const notePayload = {
      userId,
      title,
      content,
      color,
    };
    const note = new Note(notePayload);
    await note.save();
    const resp = note.toObject();
    delete resp.__v;
    delete resp.userId;
    delete resp.createdAt;
    delete resp.updatedAt;
    res.status(201).json({ message: "Note created successfully", data: resp });
  } catch (error) {
    console.log("Error in createNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateNote(req, res) {
  try {
    const userId = req.user.userId;
    const { title, content, color } = req.body;
    const updatePayload = {};
    if (title !== undefined) updatePayload.title = title;
    if (content !== undefined) updatePayload.content = content;
    if (color !== undefined) updatePayload.color = color;
    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.noteId, userId },
      updatePayload,
      { returnDocument: "after", runValidators: true },
    )
      .select("-__v -userId -createdAt -updatedAt")
      .lean();
    if (!updatedNote)
      return res.status(404).json({ message: "Note not found" });
    res
      .status(200)
      .json({ message: "Note updated successfully", data: updatedNote });
  } catch (error) {
    console.log("Error in updateNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteNote(req, res) {
  try {
    const userId = req.user.userId;
    const deletedNote = await Note.findOneAndDelete({
      _id: req.params.noteId,
      userId,
    });
    if (!deletedNote)
      return res.status(404).json({ message: "Note not found" });
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.log("Error in deleteNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
