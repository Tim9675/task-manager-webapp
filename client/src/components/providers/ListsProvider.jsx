import { useContext, useState, useMemo, useCallback } from "react";

import { ListsContext } from "../../contexts/ListsContext";
import { mockLists } from "../../mock/lists";
import { TasksContext } from "../../contexts/TasksContext";

function ListsProvider({ children }) {
  const [userLists, setUserLists] = useState(mockLists);
  const { userTasks, removeListFromTasks } = useContext(TasksContext);

  const userListsWithCounts = useMemo(() => {
    const taskCounter = {};

    for (const task of userTasks) {
      if (task.checked) continue;
      taskCounter[task.listId] = (taskCounter[task.listId] ?? 0) + 1;
    }

    return userLists.map((list) => ({
      ...list,
      count: taskCounter[list.id] ?? 0,
    }));
  }, [userLists, userTasks]);

  const userListsMap = useMemo(
    () => Object.fromEntries(userLists.map((list) => [list.id, list])),
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
  function createList(title, color) {
    const normalizedTitle = title.trim().toLowerCase();
    const duplicate = userLists.some(
      (list) => list.title.trim().toLowerCase() === normalizedTitle,
    );
    if (!normalizedTitle) return { success: false, error: "empty" };
    if (duplicate) return { success: false, error: "duplicate" };
    const newList = {
      id: crypto.randomUUID(),
      title: title,
      color: color,
    };
    setUserLists((prev) => [...prev, newList]);
    return { success: true };
  }

  function updateList(updatedList) {
    const normalizedTitle = updatedList.title.trim().toLowerCase();
    if (!normalizedTitle) return { success: false, error: "empty" };
    const duplicate = userLists.some(
      (list) =>
        list.id !== updatedList.id &&
        list.title.trim().toLowerCase() === normalizedTitle,
    );
    if (duplicate) return { success: false, error: "duplicate" };
    setUserLists((prev) =>
      prev.map((list) => (list.id === updatedList.id ? updatedList : list)),
    );
    return { success: true };
  }

  function deleteList(listId) {
    setUserLists((prev) => prev.filter((list) => list.id !== listId));
    removeListFromTasks(listId);
  }

  // Helper functions
  const getTasksByList = useCallback(
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
        createList,
        updateList,
        deleteList,
        getTasksByList,
        getListTitle,
        getListById,
      }}
    >
      {children}
    </ListsContext.Provider>
  );
}

export default ListsProvider;
