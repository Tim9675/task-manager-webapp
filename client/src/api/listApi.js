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

export async function updateList(updatedList) {
  const response = await client.patch(`/lists/${updatedList._id}`, updatedList);
  return response.data.data;
}

export async function deleteList(listId) {
  await client.delete(`/lists/${listId}`);
}
