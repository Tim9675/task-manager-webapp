import client from "./client";

export async function getUserTasks() {
  const response = await client.get("/tasks");
  console.log(response.data);
  return response.data;
}
