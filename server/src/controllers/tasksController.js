import Task from "../models/Task.js";

export async function getTasks(_, res) {
  try {
    const tasks = await Task.find().sort({ dueDate: 1 });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error in getTasks controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getTaskById(req, res) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);
  } catch (error) {
    console.error("Error in getTaskById controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createTask(req, res) {
  try {
    const { userId, title, description, dueDate, listId, tagIds, subtasks } =
      req.body;

    const task = new Task({
      userId,
      title,
      description,
      dueDate,
      listId,
      tagIds,
      subtasks,
    });

    await task.save();
    res
      .status(201)
      .json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    console.log("Error in createTask controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateTask(req, res) {
  try {
    const {
      userId,
      title,
      description,
      dueDate,
      listId,
      tagIds,
      subtasks,
      checked,
    } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        userId,
        title,
        description,
        dueDate,
        listId,
        tagIds,
        subtasks,
        checked,
      },
      { returnDocument: "after" },
    );

    if (!updatedTask)
      return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task updated successfully" });
  } catch (error) {
    console.log("Error in updateTask controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteTask(req, res) {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id, {
      returnDocument: "after",
    });

    if (!deletedTask)
      return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.log("Error in deleteTask controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
