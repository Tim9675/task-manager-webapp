import client from "./client";

export async function getUserNotes() {
  const response = await client.get("/notes");
  return response.data.data;
}

export async function createNote(title, content, color) {
  if (!title.trim()) return;

  const newNote = {
    title,
    content,
    color,
  };

  const response = await client.post("/notes", newNote);
  return response.data.data;
}

export async function updateNote(updatedNote) {
  const response = await client.patch(`/notes/${updatedNote._id}`, updatedNote);
  return response.data.data;
}

export async function deleteNote(noteId) {
  await client.delete(`/notes/${noteId}`);
}
