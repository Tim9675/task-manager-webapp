import client from "./client";

export async function getUserLists() {
  const response = await client.get("/lists");
  return response.data.data;
}

export async function createList(title, color) {
  if (!title.trim()) return;

  const newList = {
    title,
    color,
  };

  const response = await client.post("/lists", newList);
  return response.data.data;
}

export async function updateList(listId, patchBody) {
  const response = await client.patch(`/lists/${listId}`, patchBody);
  return response.data.data;
}

export async function deleteList(listId) {
  await client.delete(`/lists/${listId}`);
}
