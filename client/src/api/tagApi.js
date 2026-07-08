import client from "./client";

export async function getUserTags() {
  const response = await client.get("/tags");
  return response.data.data;
}

export async function createTag(title, color) {
  if (!title.trim()) return;

  const newTag = {
    title,
    color,
  };

  const response = await client.post("/tags", newTag);
  return response.data.data;
}

export async function updateTag(updatedTag) {
  const response = await client.patch(`/tags/${updatedTag._id}`, updatedTag);
  return response.data.data;
}

export async function deleteTag(tagId) {
  await client.delete(`/tags/${tagId}`);
}
