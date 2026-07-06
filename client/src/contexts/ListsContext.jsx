import { createContext, useContext, useState, useEffect } from "react";

import { useTasks } from "./TasksContext";
import { getUserLists } from "../api/listApi.js";
import { showApiError } from "./helpers/showApiResponse.js";
import useListCrud from "./hooks/useListCrud.js";
import useListDerivedData from "./hooks/useListDerivedData.js";

const ListsContext = createContext();

export function ListsProvider({ children }) {
  const [userLists, setUserLists] = useState([]);
  const { userTasks, removeListFromTasks } = useTasks();
  const [isLoadingLists, setIsLoadingLists] = useState(true);

  useEffect(() => {
    async function fetchLists() {
      try {
        const lists = await getUserLists();
        setUserLists(lists);
      } catch (error) {
        showApiError(error, "Error when fetching lists");
      } finally {
        setIsLoadingLists(false);
      }
    }
    fetchLists();
  }, []);

  const availableListColors = [
    "#ff6b6b",
    "#da77f2",
    "#9775fa",
    "#5c7cfa",
    "#66d9e8",
    "#8ce99a",
    "#ffd43b",
    "#ff922b",
  ];

  const crud = useListCrud({ userLists, setUserLists, removeListFromTasks });

  const derived = useListDerivedData({ userLists, userTasks });

  return (
    <ListsContext.Provider
      value={{
        userLists,
        availableListColors,
        ...crud,
        ...derived,
        isLoadingLists,
      }}
    >
      {children}
    </ListsContext.Provider>
  );
}

export function useLists() {
  const context = useContext(ListsContext);

  if (!context) {
    throw new Error("useLists must be used within ListsProvider");
  }

  return context;
}
