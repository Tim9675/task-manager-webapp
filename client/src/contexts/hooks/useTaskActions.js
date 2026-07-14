import { useState } from "react";

import {
  createTask,
  toggleTask,
  updateTask,
  deleteTask,
} from "../../api/taskApi.js";
import {
  showActionSuccess,
  showApiError,
  showWarning,
} from "../helpers/showApiResponse.js";
import { isEmptyUpdateBody } from "../helpers/isEmptyUpdateBody.js";

function useTaskActions({
  setUserTasks,
  selectedTaskId,
  setSelectedTaskId,
  setIsTaskDetailsOpen,
}) {
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isUpdatingTask, setIsUpdatingTask] = useState(false);
  const [isDeletingTask, setIsDeletingTask] = useState(false);

  async function onCreateTask(title, activeView) {
    if (!title.trim()) {
      showWarning("Task title required");
      return;
    }

    try {
      setIsCreatingTask(true);
      const res = await createTask(title, activeView);

      setUserTasks((prev) => [...prev, res]);
      setSelectedTaskId(res._id);
      setIsTaskDetailsOpen(true);
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
      showApiError(error, "Error when toggling task");
    }
  }

  async function onUpdateTask(taskId, patchBody) {
    if (isEmptyUpdateBody(patchBody)) return;

    try {
      setIsUpdatingTask(true);
      const res = await updateTask(taskId, patchBody);
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
      setIsDeletingTask(true);
      await deleteTask(taskId);
      setUserTasks((prev) => prev.filter((task) => task._id !== taskId));
      if (selectedTaskId === taskId) {
        setSelectedTaskId(null);
      }
      showActionSuccess("Task", "deleted");
    } catch (error) {
      showApiError(error, "Error when deleting task");
    } finally {
      setIsDeletingTask(false);
    }
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

  return {
    onCreateTask,
    onToggleTask,
    onUpdateTask,
    onDeleteTask,
    isCreatingTask,
    isUpdatingTask,
    isDeletingTask,
    removeListFromTasks,
    removeTagFromTasks,
  };
}

export default useTaskActions;
