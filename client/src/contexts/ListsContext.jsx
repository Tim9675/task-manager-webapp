import { createContext, useState, useEffect } from "react";

import { useTasks } from "./TasksContext";
import { getUserLists } from "../api/listApi.js";
import { showApiError } from "./helpers/showApiResponse.js";
import useListCrud from "./hooks/useListCrud.js";
import useListDerivedData from "./hooks/useListDerivedData.js";

const ListsContext = createContext();

export function ListsProvider({ children }) {
  const [userLists, setUserLists] = useState([]);
  const [isLoadingLists, setIsLoadingLists] = useState(true);
  const { userTasks, removeListFromTasks } = useTasks();

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
        isLoadingLists,
        availableListColors,
        ...crud,
        ...derived,
      }}
    >
      {children}
    </ListsContext.Provider>
  );
}
