import { createContext, useState, useEffect, useContext } from "react";

import { getUserNotes } from "../api/noteApi";
import { showApiError } from "./helpers/showApiResponse";
import useNoteCrud from "./hooks/useNoteCrud";

const NotesContext = createContext();

export function NotesProvider({ children }) {
  const [userNotes, setUserNotes] = useState([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);

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

  const crud = useNoteCrud({ userNotes, setUserNotes });

  return (
    <NotesContext.Provider
      value={{
        userNotes,
        isLoadingNotes,
        availableNoteColors,
        ...crud,
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
