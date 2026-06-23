import client from "./client";
import { getDueDateOnCreate } from "../utils/date";

export async function getUserTasks() {
  const response = await client.get("/tasks");

  return response.data.data;
}

export async function createTask(title, activeView) {
  if (!title.trim()) return;
  const date = getDueDateOnCreate(activeView);

  const newTask = {
    title: title,
    description: "",
    dueDate: date,
    listId: activeView.type === "list" ? activeView.id : null,
    tagIds: activeView.type === "tag" ? [activeView.id] : [],
    subtasks: [],
    checked: false,
  };

  const response = await client.post("/tasks", newTask);
  await new Promise((resolve) => setTimeout(resolve, 5000));
  return response.data.data;
}

export async function toggleTask(taskId, checked) {
  const response = await client.patch(`/tasks/${taskId}`, { checked: checked });
  return response.data.data;
}

export async function updateTask(updatedTask) {
  const response = await client.patch(`/tasks/${updatedTask._id}`, updatedTask);
  return response.data.data;
}

export async function deleteTask(taskId) {
  await client.delete(`/tasks/${taskId}`);
}
