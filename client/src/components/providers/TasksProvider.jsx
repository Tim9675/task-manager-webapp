import { useEffect, useMemo, useState } from "react";

import { TasksContext } from "../../contexts/TasksContext.jsx";
import { isToday, isUpcoming } from "../../utils/date.js";
import {
  createTask,
  deleteTask,
  getUserTasks,
  toggleTask,
  updateTask,
} from "../../api/taskApi.js";
import { showActionSuccess, showApiError } from "./helpers/showApiResponse.js";

function TasksProvider({ children }) {
  const [userTasks, setUserTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isTaskDetailsOpen, setisTaskDetailsOpen] = useState(false);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isUpdatingTask, setIsUpdatingTask] = useState(false);

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

  // Task to display in TaskDetailsPanel
  const selectedTask = useMemo(
    () => userTasks.find((task) => task._id === selectedTaskId) || null,
    [userTasks, selectedTaskId],
  );

  const todayTaskCount = useMemo(
    () =>
      userTasks.filter((task) => !task.checked && isToday(task.dueDate)).length,
    [userTasks],
  );

  const upcomingTaskCount = useMemo(
    () =>
      userTasks.filter((task) => !task.checked && isUpcoming(task.dueDate))
        .length,
    [userTasks],
  );

  // CRUD functions
  async function onCreateTask(title, activeView) {
    if (!title.trim()) return;
    try {
      setIsCreatingTask(true);
      const res = await createTask(title, activeView);

      setUserTasks((prev) => [...prev, res]);
      setSelectedTaskId(res._id);
      setisTaskDetailsOpen(true);
      showActionSuccess("Task", "created");
      return res;
    } catch (error) {
      showApiError(error, "Error when creating task");
    } finally {
      setIsCreatingTask(false);
    }
  }

  async function onToggleTask(taskId, checked) {
    try {
      const res = await toggleTask(taskId, checked);

      setUserTasks((prev) =>
        prev.map((task) => (task._id === res._id ? res : task)),
      );
    } catch (error) {
      console.error("Error in onToggleTask: ", error.response?.data?.message);
    }
  }

  async function onUpdateTask(updatedTask) {
    try {
      setIsUpdatingTask(true);
      const res = await updateTask(updatedTask);
      setUserTasks((prev) =>
        prev.map((task) => {
          return task._id === res._id ? res : task;
        }),
      );
      showActionSuccess("Task", "updated");
    } catch (error) {
      showApiError(error, "Error when updating task");
    } finally {
      setIsUpdatingTask(false);
    }
  }

  async function onDeleteTask(taskId) {
    try {
      await deleteTask(taskId);
      setUserTasks((prev) => prev.filter((task) => task._id !== taskId));
      if (selectedTaskId === taskId) {
        setSelectedTaskId(null);
      }
      showActionSuccess("Task", "deleted");
    } catch (error) {
      showApiError(error, "Error when deleting task");
    }
  }

  // Helper functions
  function openTask(taskId) {
    setSelectedTaskId(taskId);
    setisTaskDetailsOpen(true);
  }

  function closeTask() {
    setSelectedTaskId(null);
    setisTaskDetailsOpen(false);
  }

  function isSelectedTask(taskId) {
    return selectedTaskId === taskId;
  }

  function removeListFromTasks(listId) {
    setUserTasks((prev) =>
      prev.map((task) =>
        listId === task.listId ? { ...task, listId: null } : task,
      ),
    );
  }

  function removeTagFromTasks(tagId) {
    setUserTasks((prev) =>
      prev.map((task) => ({
        ...task,
        tagIds: task.tagIds.filter((id) => id !== tagId),
      })),
    );
  }

  return (
    <TasksContext.Provider
      value={{
        userTasks,
        isTaskDetailsOpen,
        selectedTask,
        todayTaskCount,
        upcomingTaskCount,
        openTask,
        closeTask,
        isSelectedTask,
        onCreateTask,
        onUpdateTask,
        onToggleTask,
        onDeleteTask,
        removeListFromTasks,
        removeTagFromTasks,
        isLoadingTasks,
        isCreatingTask,
        isUpdatingTask,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export default TasksProvider;
