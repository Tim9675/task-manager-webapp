import { useContext, useState, useMemo, useCallback, useEffect } from "react";

import { ListsContext } from "../../contexts/ListsContext";
import { TasksContext } from "../../contexts/TasksContext";
import {
  createList,
  deleteList,
  getUserLists,
  updateList,
} from "../../api/listApi";

function ListsProvider({ children }) {
  const [userLists, setUserLists] = useState([]);
  const { userTasks, removeListFromTasks } = useContext(TasksContext);
  const [isLoadingLists, setIsLoadingLists] = useState(true);
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [isUpdatingList, setIsUpdatingList] = useState(false);

  useEffect(() => {
    async function fetchLists() {
      try {
        const lists = await getUserLists();
        setUserLists(lists);
      } catch (error) {
        console.log("Error fetching lists");
        console.log(error);
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
    const normalizedTitle = title.trim().toLowerCase();
    const duplicate = userLists.some(
      (list) => list.title.trim().toLowerCase() === normalizedTitle,
    );
    if (duplicate) return { success: false, error: "duplicate" };

    try {
      setIsCreatingList(true);
      const res = await createList(title, color);
      console.log(res);
      setUserLists((prev) => [...prev, res]);
      return { success: true };
    } catch (error) {
      console.log("Error in onCreateList");
      console.log(error);
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
    const normalizedTitle = updatedList.title.trim().toLowerCase();
    const duplicate = userLists.some(
      (list) =>
        list._id !== updatedList._id &&
        list.title.trim().toLowerCase() === normalizedTitle,
    );
    if (duplicate) return { success: false, error: "duplicate" };

    try {
      setIsUpdatingList(true);
      const res = await updateList(updatedList);
      console.log(res);
      setUserLists((prev) =>
        prev.map((list) => (list._id === res._id ? res : list)),
      );
      return { success: true };
    } catch (error) {
      console.log("Error in onUpdateList");
      console.log(error);
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
      await deleteList(listId);
      setUserLists((prev) => prev.filter((list) => list._id !== listId));
      removeListFromTasks(listId);
    } catch (error) {
      console.log("Error in onDeleteList");
      console.log(error);
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
      }}
    >
      {children}
    </ListsContext.Provider>
  );
}

export default ListsProvider;
