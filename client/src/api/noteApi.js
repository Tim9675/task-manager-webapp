import client from "./client";

export async function getUserNotes() {
  const response = await client.get("/notes");
  await new Promise((resolve) => setTimeout(resolve, 5000));
  return response.data.data;
}

export async function createNote(title, content, color) {
  if (!title.trim()) return;

  const newNote = {
    title: title,
    content: content,
    color: color,
  };

  const response = await client.post("/notes", newNote);
  await new Promise((resolve) => setTimeout(resolve, 5000));
  return response.data.data;
}

export async function updateNote(updatedNote) {
  const response = await client.patch(`/notes/${updatedNote._id}`, updatedNote);
  await new Promise((resolve) => setTimeout(resolve, 5000));
  return response.data.data;
}

export async function deleteNote(noteId) {
  await client.delete(`/notes/${noteId}`);
}
