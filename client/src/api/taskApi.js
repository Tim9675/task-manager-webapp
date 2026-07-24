import { getDueDateOnCreate } from "../utils/date";
import client from "./client";

export async function getUserTasks() {
  const response = await client.get("/tasks");

  return response.data.data;
}

export async function createTask(title, activeView) {
  if (!title.trim()) return;
  const date = getDueDateOnCreate(activeView);

  const newTask = {
    title,
    description: "",
    dueDate: date,
    listId: activeView.type === "list" ? activeView.id : null,
    tagIds: activeView.type === "tag" ? [activeView.id] : [],
    subtasks: [],
    checked: false,
  };

  const response = await client.post("/tasks", newTask);
  return response.data.data;
}

export async function toggleTask(taskId, checked) {
  const response = await client.patch(`/tasks/${taskId}`, { checked });
  return response.data.data;
}

export async function updateTask(taskId, patchBody) {
  const response = await client.patch(`/tasks/${taskId}`, patchBody);
  return response.data.data;
}

export async function deleteTask(taskId) {
  await client.delete(`/tasks/${taskId}`);
}
