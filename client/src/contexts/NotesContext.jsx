import { createContext, useState, useEffect, useContext } from "react";

import {
  getUserNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../api/noteApi";
import { normalizeTitle } from "./helpers/normalizeTitle";
import { showApiError, showActionSuccess } from "./helpers/showApiResponse";

const NotesContext = createContext();

export function NotesProvider({ children }) {
  const [userNotes, setUserNotes] = useState([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [isUpdatingNote, setIsUpdatingNote] = useState(false);

  useEffect(() => {
    async function fetchNotes() {
      try {
        const notes = await getUserNotes();
        setUserNotes(notes);
      } catch (error) {
        showApiError(error, "Error when fetching notes");
      } finally {
        setIsLoadingNotes(false);
      }
    }
    fetchNotes();
  }, []);

  const availableNoteColors = ["#d1eaed", "#ffdada", "#fdf2b3", "#ffd4a9"];

  // CRUD functions
  async function onCreateNote(title, content, color) {
    const normalizedTitle = normalizeTitle(title);
    const duplicate = userNotes.some(
      (note) => normalizeTitle(note.title) === normalizedTitle,
    );
    if (duplicate) return { success: false, error: "duplicate" };

    try {
      setIsCreatingNote(true);
      const res = await createNote(title, content, color);
      setUserNotes((prev) => [res, ...prev]);
      showActionSuccess("Note", "created");
      return { success: true };
    } catch (error) {
      showApiError(error, "Error when creating not");
      return { success: false, error: "Server error in onCreateNote" };
    } finally {
      setIsCreatingNote(false);
    }
  }

  async function onUpdateNote(updatedNote) {
    const normalizedTitle = normalizeTitle(updatedNote.title);
    const duplicate = userNotes.some(
      (note) =>
        note._id !== updatedNote._id &&
        normalizeTitle(note.title) === normalizedTitle,
    );
    if (duplicate) return { success: false, error: "duplicate" };

    try {
      setIsUpdatingNote(true);
      const res = await updateNote(updatedNote);
      setUserNotes((prev) =>
        prev.map((note) => (note._id === res._id ? res : note)),
      );
      showActionSuccess("Note", "updated");
      return { success: true };
    } catch (error) {
      showApiError(error, "Error when updating note");
      return { success: false, error: "Server error in onUpdateNote" };
    } finally {
      setIsUpdatingNote(false);
    }
  }

  async function onDeleteNote(noteId) {
    try {
      await deleteNote(noteId);
      setUserNotes((prev) => prev.filter((note) => note._id !== noteId));
      showActionSuccess("Note", "deleted");
    } catch (error) {
      showApiError(error, "Error when deleting note");
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

export function useNotes() {
  const context = useContext(NotesContext);

  if (!context) {
    throw new Error("useNotes must be used within NotesProvider");
  }

  return context;
}
