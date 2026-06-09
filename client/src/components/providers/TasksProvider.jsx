import { useMemo, useState } from "react";

import { TasksContext } from "../../contexts/TasksContext.jsx";
import { mockTasks } from "../../mock/tasks.js";

function TasksProvider({ children }) {
  const [userTasks, setUserTasks] = useState(mockTasks);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isTaskDetailsOpen, setisTaskDetailsOpen] = useState(false);

  // Task to display in TaskDetailsPanel
  const selectedTask = useMemo(
    () => userTasks.find((task) => task.id === selectedTaskId) || null,
    [userTasks, selectedTaskId],
  );

  // CRUD functions
  function createTask(title, activeView) {
    if (!title.trim()) return;
    const date = new Date();
    const dayOfWeek = date.getDay();
    switch (activeView.id) {
      case "tomorrow":
        date.setDate(date.getDate() + 1);
        break;
      // Sets date to day after tomorrow on weekdays, tomorrow for Saturday, and today for Sunday, to still adhere to "This Week"
      case "thisWeek":
        if (dayOfWeek === 6) {
          date.setDate(date.getDate() + 1);
        } else if (0 < dayOfWeek) {
          date.setDate(date.getDate() + 2);
        }
        break;
    }

    const newTask = {
      id: crypto.randomUUID(),
      title: title,
      description: "",
      dueDate:
        activeView.type === "today" || activeView.type === "upcoming"
          ? date
          : null,
      listId: activeView.type === "list" ? activeView.id : null,
      tagIds: activeView.type === "tag" ? [activeView.id] : [],
      subtasks: [],
      checked: false,
    };

    setUserTasks((prev) => [...prev, newTask]);
    setSelectedTaskId(newTask.id);
    setisTaskDetailsOpen(true);
  }

  function toggleTask(taskToToggle, checked) {
    setUserTasks((prev) =>
      prev.map((task) =>
        task.id === taskToToggle.id ? { ...task, checked } : task,
      ),
    );
  }

  function updateTask(updatedTask) {
    setUserTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    );
  }

  function deleteTask(taskId) {
    setUserTasks((prev) => prev.filter((task) => task.id !== taskId));

    if (selectedTaskId === taskId) {
      setSelectedTaskId(null);
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
        // selectedTaskId only used inside TaskCard.jsx
        selectedTask,
        isTaskDetailsOpen,
        openTask,
        closeTask,
        isSelectedTask,
        // createTask only used inside AddTask.jsx
        createTask,
        // updateTask only used inside TaskForm.jsx
        updateTask,
        // toggleTask only used inside TaskCard.jsx
        toggleTask,
        // deleteTask only used inside TaskDetailsPanel.jsx
        deleteTask,
        removeListFromTasks,
        removeTagFromTasks,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export default TasksProvider;
