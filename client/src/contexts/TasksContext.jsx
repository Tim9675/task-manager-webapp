import { createContext, useContext, useEffect, useState } from "react";

import { getUserTasks } from "../api/taskApi.js";
import { showApiError } from "./helpers/showApiResponse.js";
import useTaskActions from "./hooks/useTaskActions.js";
import useTaskSelection from "./hooks/useTaskSelection.js";
import useTaskDerivedData from "./hooks/useTaskDerivedData.js";

const TasksContext = createContext();

export function TasksProvider({ children }) {
  const [userTasks, setUserTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const tasks = await getUserTasks();
        setUserTasks(tasks);
      } catch (error) {
        showApiError(error, "Error when fetching tasks");
      } finally {
        setIsLoadingTasks(false);
      }
    }

    fetchTasks();
  }, []);

  const action = useTaskActions({
    setUserTasks,
    selectedTaskId,
    setSelectedTaskId,
    setIsTaskDetailsOpen,
  });

  const selection = useTaskSelection({
    userTasks,
    selectedTaskId,
    setSelectedTaskId,
    setIsTaskDetailsOpen,
  });

  const derived = useTaskDerivedData({ userTasks });

  return (
    <TasksContext.Provider
      value={{
        userTasks,
        isTaskDetailsOpen,
        isLoadingTasks,
        ...action,
        ...selection,
        ...derived,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);

  if (!context) {
    throw new Error("useTasks must be used within TasksProvider");
  }

  return context;
}
