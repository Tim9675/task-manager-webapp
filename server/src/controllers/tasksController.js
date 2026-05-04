export async function getTasks(req, res) {
  res.status(200).send("You got 5 tasks");
}

export async function createTask(req, res) {
  res.status(201).json({ message: "Task created successfully" });
}

export async function updateTask(req, res) {
  res.status(200).json({ message: "Task updated successfully" });
}

export async function deleteTask(req, res) {
  res.status(200).json({ message: "Task deleted successfully" });
}
