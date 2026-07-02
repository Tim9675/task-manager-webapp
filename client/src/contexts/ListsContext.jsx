import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";

import { useTasks } from "./TasksContext";
import {
  createList,
  deleteList,
  getUserLists,
  updateList,
} from "../api/listApi";
import { normalizeTitle } from "./helpers/normalizeTitle.js";
import { showActionSuccess, showApiError } from "./helpers/showApiResponse.js";

const ListsContext = createContext();

export function ListsProvider({ children }) {
  const [userLists, setUserLists] = useState([]);
  const { userTasks, removeListFromTasks } = useTasks();
  const [isLoadingLists, setIsLoadingLists] = useState(true);
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [isUpdatingList, setIsUpdatingList] = useState(false);
  const [isDeletingList, setIsDeletingList] = useState(false);

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

  const userListsWithCounts = useMemo(() => {
    const taskCounter = {};

    for (const task of userTasks) {
      if (task.checked) continue;
      taskCounter[task.listId] = (taskCounter[task.listId] ?? 0) + 1;
    }

    return userLists.map((list) => ({
      ...list,
      count: taskCounter[list._id] ?? 0,
    }));
  }, [userLists, userTasks]);

  const userListsMap = useMemo(
    () => Object.fromEntries(userLists.map((list) => [list._id, list])),
    [userLists],
  );

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

  // CRUD functions
  async function onCreateList(title, color) {
    // Don't need to check for empty string title since button is disabled if listTitle state is empty
    const normalizedTitle = normalizeTitle(title);
    const duplicate = userLists.some(
      (list) => normalizeTitle(list.title) === normalizedTitle,
    );
    if (duplicate) return { success: false, error: "duplicate" };

    try {
      setIsCreatingList(true);
      const res = await createList(title, color);
      setUserLists((prev) => [...prev, res]);
      showActionSuccess("List", "created");
      return { success: true };
    } catch (error) {
      showApiError(error, "Error when creating list");
      return {
        success: false,
        error: "Server error in onCreateList",
      };
    } finally {
      setIsCreatingList(false);
    }
  }

  async function onUpdateList(updatedList) {
    // Same reasoning as onCreateList for empty title
    const normalizedTitle = normalizeTitle(updatedList.title);
    const duplicate = userLists.some(
      (list) =>
        list._id !== updatedList._id &&
        normalizeTitle(list.title) === normalizedTitle,
    );
    if (duplicate) return { success: false, error: "duplicate" };

    try {
      setIsUpdatingList(true);
      const res = await updateList(updatedList);
      setUserLists((prev) =>
        prev.map((list) => (list._id === res._id ? res : list)),
      );
      showActionSuccess("List", "updated");
      return { success: true };
    } catch (error) {
      showApiError(error, "Error when updating list");
      return {
        success: false,
        error: "Server error in onUpdateList",
      };
    } finally {
      setIsUpdatingList(false);
    }
  }

  async function onDeleteList(listId) {
    try {
      setIsDeletingList(true);
      await deleteList(listId);
      setUserLists((prev) => prev.filter((list) => list._id !== listId));
      removeListFromTasks(listId);
      showActionSuccess("List", "deleted");
    } catch (error) {
      showApiError(error, "Error when deleting list");
    } finally {
      setIsDeletingList(false);
    }
  }

  // Helper functions
  const getCachedTasksByList = useCallback(
    (listId) => userTasks.filter((task) => task.listId === listId),
    [userTasks],
  );

  function getListTitle(id) {
    return userListsMap[id]?.title;
  }

  function getListById(id) {
    return userListsMap[id];
  }

  return (
    <ListsContext.Provider
      value={{
        userLists,
        userListsWithCounts,
        availableListColors,
        onCreateList,
        onUpdateList,
        onDeleteList,
        getCachedTasksByList,
        getListTitle,
        getListById,
        isLoadingLists,
        isCreatingList,
        isUpdatingList,
        isDeletingList,
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
