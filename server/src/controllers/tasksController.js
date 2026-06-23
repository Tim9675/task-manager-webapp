import Task from "../models/Task.js";
import List from "../models/List.js";
import Tag from "../models/Tag.js";

export async function getTasks(req, res) {
  try {
    const userId = req.user.userId;
    const tasks = await Task.find({ userId })
      .select("-__v -createdAt -updatedAt -userId")
      .sort({ dueDate: 1, createdAt: 1 })
      .lean();
    res.status(200).json({ data: tasks });
  } catch (error) {
    console.log("Error in getTasks controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getTaskById(req, res) {
  try {
    const userId = req.user.userId;
    const task = await Task.findOne({ _id: req.params.taskId, userId }).lean();
    if (!task) return res.status(404).json({ message: "Task not found" }); // Not unauthorized to prevent info leak about task existence
    res.status(200).json({ data: task });
  } catch (error) {
    console.log("Error in getTaskById controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createTask(req, res) {
  try {
    const userId = req.user.userId;
    const { title, description, dueDate, listId, tagIds, subtasks } = req.body;

    // Always send ISO 8601 with timezone
    // (e.g. "2026-05-06T23:59:59.999+08:00" or "2026-05-06T15:59:59.999Z")
    // ^^^ SAME WITH updateTask ^^^

    // Prevents users from creating their tasks inside other users' lists; also catches ""
    if (listId !== undefined && listId !== null && listId !== "") {
      const listExists = await List.exists({
        _id: listId,
        userId,
      });

      if (!listExists) {
        return res.status(404).json({
          message: "List not found",
        });
      }
    }

    if (Array.isArray(tagIds) && tagIds.length > 0) {
      const uniqueTagIds = [...new Set(tagIds)];

      const existingTagsCount = await Tag.countDocuments({
        userId,
        _id: { $in: uniqueTagIds },
      });

      if (existingTagsCount !== uniqueTagIds.length) {
        return res.status(404).json({
          message: "One or more tags not found",
        });
      }
    }

    const parsedDate =
      dueDate === undefined || dueDate === "" ? null : new Date(dueDate);

    if (parsedDate && isNaN(parsedDate.getTime()))
      return res.status(400).json({ message: "Invalid dueDate" });

    const taskPayload = {
      userId,
      title,
      description,
      dueDate: parsedDate,
      subtasks,
    };

    if (listId !== undefined && listId !== "") {
      taskPayload.listId = listId;
    }

    if (tagIds !== undefined) {
      taskPayload.tagIds = tagIds;
    }

    const task = new Task(taskPayload);

    await task.save();
    const resp = task.toObject();
    delete resp.__v;
    delete resp.userId;
    delete resp.createdAt;
    delete resp.updatedAt;
    res.status(201).json({ message: "Task created successfully", data: resp });
  } catch (error) {
    console.log("Error in createTask controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateTask(req, res) {
  try {
    const userId = req.user.userId;
    const { title, description, dueDate, listId, tagIds, subtasks, checked } =
      req.body;

    // Prevents users from putting their tasks inside other users' lists; also catches ""
    if (listId !== undefined && listId !== null && listId !== "") {
      const listExists = await List.exists({
        _id: listId,
        userId,
      });

      if (!listExists) {
        return res.status(404).json({
          message: "List not found",
        });
      }
    }

    if (Array.isArray(tagIds) && tagIds.length > 0) {
      const uniqueTagIds = [...new Set(tagIds)];

      const existingTagsCount = await Tag.countDocuments({
        userId,
        _id: { $in: uniqueTagIds },
      });

      if (existingTagsCount !== uniqueTagIds.length) {
        return res.status(404).json({
          message: "One or more tags not found",
        });
      }
    }

    const updatePayload = {};

    if (title !== undefined) updatePayload.title = title;
    if (description !== undefined) updatePayload.description = description;
    if (dueDate !== undefined) {
      const parsedDate =
        dueDate === "" || dueDate === null ? null : new Date(dueDate);

      if (parsedDate && isNaN(parsedDate.getTime())) {
        return res.status(400).json({ message: "Invalid dueDate" });
      }

      updatePayload.dueDate = parsedDate;
    }
    if (listId !== undefined)
      updatePayload.listId = listId === "" ? null : listId;
    if (tagIds !== undefined) updatePayload.tagIds = tagIds;
    if (subtasks !== undefined) updatePayload.subtasks = subtasks;
    if (checked !== undefined) updatePayload.checked = checked;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.taskId, userId },
      updatePayload,
      { returnDocument: "after", runValidators: true },
    )
      .select("-__v -createdAt -updatedAt -userId")
      .lean();

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
    const userId = req.user.userId;
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.taskId,
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
