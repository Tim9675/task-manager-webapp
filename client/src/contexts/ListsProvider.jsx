import { useState, useEffect } from "react";

import { useTasks } from "./useTasks.js";
import { getUserLists } from "../api/listApi.js";
import { showApiError } from "./utils/showApiResponse.js";
import useListCrud from "./hooks/useListCrud.js";
import useListDerivedData from "./hooks/useListDerivedData.js";
import ListsContext from "./ListsContext.js";

function ListsProvider({ children }) {
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
    { value: "#ff6b6b", label: "Coral" },
    { value: "#da77f2", label: "Orchid" },
    { value: "#9775fa", label: "Purple" },
    { value: "#5c7cfa", label: "Blue" },
    { value: "#66d9e8", label: "Cyan" },
    { value: "#8ce99a", label: "Mint" },
    { value: "#ffd43b", label: "Yellow" },
    { value: "#ff922b", label: "Orange" },
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

export default ListsProvider;
