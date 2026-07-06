import { useMemo, useCallback } from "react";

function useListDerivedData({ userLists, userTasks }) {
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

  return {
    userListsWithCounts,
    getCachedTasksByList,
    getListTitle,
    getListById,
  };
}

export default useListDerivedData;
