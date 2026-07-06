import { useState } from "react";

import { createNote, updateNote, deleteNote } from "../../api/noteApi";
import { normalizeTitle } from "../helpers/normalizeTitle";
import { showApiError, showActionSuccess } from "../helpers/showApiResponse";

function useNoteCrud({ userNotes, setUserNotes }) {
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [isUpdatingNote, setIsUpdatingNote] = useState(false);
  const [isDeletingNote, setIsDeletingNote] = useState(false);

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
      setIsDeletingNote(true);
      await deleteNote(noteId);
      setUserNotes((prev) => prev.filter((note) => note._id !== noteId));
      showActionSuccess("Note", "deleted");
    } catch (error) {
      showApiError(error, "Error when deleting note");
    } finally {
      setIsDeletingNote(false);
    }
  }

  return {
    onCreateNote,
    onUpdateNote,
    onDeleteNote,
    isCreatingNote,
    isUpdatingNote,
    isDeletingNote,
  };
}

export default useNoteCrud;
