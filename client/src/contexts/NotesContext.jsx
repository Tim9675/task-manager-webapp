import { createContext, useState, useEffect } from "react";

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

  const availableNoteColors = [
    { value: "#d1eaed", label: "Light blue" },
    { value: "#ffdada", label: "Light pink" },
    { value: "#fdf2b3", label: "Light yellow" },
    { value: "#ffd4a9", label: "Light orange" },
  ];

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
