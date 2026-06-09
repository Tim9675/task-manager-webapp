import { useState } from "react";

import { NotesContext } from "../../contexts/NotesContext";
import { mockNotes } from "../../mock/notes";

function NotesProvider({ children }) {
  const [userNotes, setUserNotes] = useState(mockNotes);

  // CRUD functions
  function createNote(title, content, color) {
    const normalizedTitle = title.trim().toLowerCase();
    const duplicate = userNotes.some(
      (note) => note.title.trim().toLowerCase() === normalizedTitle,
    );
    if (!normalizedTitle) return { success: false, error: "empty" };
    if (duplicate) return { success: false, error: "duplicate" };
    const newNote = {
      id: crypto.randomUUID(),
      title: title,
      content: content,
      color: color,
    };
    setUserNotes((prev) => [...prev, newNote]);
    return { success: true };
  }

  function updateNote(updatedNote) {
    const normalizedTitle = updatedNote.title.trim().toLowerCase();
    if (!normalizedTitle) return { success: false, error: "empty" };
    const duplicate = userNotes.some(
      (note) =>
        note.id !== updatedNote.id &&
        note.title.trim().toLowerCase() === normalizedTitle,
    );
    if (duplicate) return { success: false, error: "duplicate" };
    setUserNotes((prev) =>
      prev.map((note) => (note.id === updatedNote.id ? updatedNote : note)),
    );
    return { success: true };
  }

  function deleteNote(noteId) {
    setUserNotes((prev) => prev.filter((note) => note.id !== noteId));
  }

  return (
    <NotesContext.Provider
      value={{
        userNotes,
        createNote,
        updateNote,
        deleteNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export default NotesProvider;
