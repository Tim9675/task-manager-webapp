import { useState, useEffect } from "react";

import { NotesContext } from "../../contexts/NotesContext";
import {
  getUserNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../../api/noteApi";

function NotesProvider({ children }) {
  const [userNotes, setUserNotes] = useState([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [isUpdatingNote, setIsUpdatingNote] = useState(false);

  useEffect(() => {
    async function fetchNotes() {
      try {
        const notes = await getUserNotes();
        console.log(notes);
        setUserNotes(notes);
      } catch (error) {
        console.log("Error fetching notes:");
        console.log(error);
      } finally {
        setIsLoadingNotes(false);
      }
    }
    fetchNotes();
  }, []);

  const availableNoteColors = ["#d1eaed", "#ffdada", "#fdf2b3", "#ffd4a9"];

  // CRUD functions
  async function onCreateNote(title, content, color) {
    const normalizedTitle = title.trim().toLowerCase();
    const duplicate = userNotes.some(
      (note) => note.title.trim().toLowerCase() === normalizedTitle,
    );
    if (duplicate) return { success: false, error: "duplicate" };

    try {
      setIsCreatingNote(true);
      const res = await createNote(title, content, color);
      console.log(res);
      setUserNotes((prev) => [...prev, res]);
      return { success: true };
    } catch (error) {
      console.log("Error in onCreateNote");
      console.log(error);
      return { success: false, error: "Server error in onCreateNote" };
    } finally {
      setIsCreatingNote(false);
    }
  }

  async function onUpdateNote(updatedNote) {
    const normalizedTitle = updatedNote.title.trim().toLowerCase();
    const duplicate = userNotes.some(
      (note) =>
        note._id !== updatedNote._id &&
        note.title.trim().toLowerCase() === normalizedTitle,
    );
    if (duplicate) return { success: false, error: "duplicate" };

    try {
      setIsUpdatingNote(true);
      const res = await updateNote(updatedNote);
      console.log(res);
      setUserNotes((prev) =>
        prev.map((note) => (note._id === res._id ? res : note)),
      );
      return { success: true };
    } catch (error) {
      console.log("Error in onUpdateNote");
      console.log(error);
      return { success: false, error: "Server error in onUpdateNote" };
    } finally {
      setIsUpdatingNote(false);
    }
  }

  async function onDeleteNote(noteId) {
    try {
      await deleteNote(noteId);
      setUserNotes((prev) => prev.filter((note) => note._id !== noteId));
    } catch (error) {
      console.log("Error in onDeleteNote");
      console.log(error);
    }
  }

  return (
    <NotesContext.Provider
      value={{
        userNotes,
        availableNoteColors,
        onCreateNote,
        onUpdateNote,
        onDeleteNote,
        isLoadingNotes,
        isCreatingNote,
        isUpdatingNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

export default NotesProvider;
