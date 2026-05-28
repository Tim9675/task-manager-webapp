import { useState } from "react";

import TaskList from "../components/tasks/TaskList";
import DashboardLayout from "../layouts/DashboardLayout";
import { mockTasks } from "../mock/tasks";
import { isToday, isUpcoming } from "../utils/date";

function DashboardPage() {
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [tasks, setTasks] = useState(mockTasks);
  const [activeView, setActiveView] = useState({
    type: "today",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isHideCompleted, setIsHideCompleted] = useState(false);

  // REMINDER: To be removed when backend connected
  const filteredTasks = tasks.filter((task) => {
    if (isHideCompleted && task.checked) return false;
    switch (activeView.type) {
      case "today":
        return isToday(task.dueDate);
      case "upcoming":
        return isUpcoming(task.dueDate);
      case "list":
        return task.listId === activeView.id;
      case "tag":
        return task.tagIds.includes(activeView.id);
      default:
        return true;
    }
  });

  const searchedTasks = filteredTasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const selectedTask = tasks.find((task) => task.id === selectedTaskId) || null;
  const visibleTasks = searchQuery ? searchedTasks : filteredTasks;

  function createTask(title) {
    const newTask = {
      id: crypto.randomUUID(),
      title: title,
      description: "",
      dueDate: null,
      listId: null,
      tagIds: [],
      subtasks: [],
      checked: false,
    };

    setTasks((prev) => [...prev, newTask]);
    setSelectedTaskId(newTask.id);
    setIsTaskDetailsOpen(true);
  }

  function toggleTask(taskToToggle, checked) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskToToggle.id ? { ...task, checked } : task,
      ),
    );
  }

  function updateTask(updatedTask) {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    );
  }

  function deleteTask(taskId) {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));

    if (selectedTaskId === taskId) {
      setSelectedTaskId(null);
      setIsTaskDetailsOpen(false);
    }
  }

  return (
    <DashboardLayout
      selectedTask={selectedTask}
      updateTask={updateTask}
      deleteTask={deleteTask}
      activeView={activeView}
      setActiveView={setActiveView}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      isHideCompleted={isHideCompleted}
      setIsHideCompleted={setIsHideCompleted}
      isTaskDetailsOpen={isTaskDetailsOpen}
      setIsTaskDetailsOpen={setIsTaskDetailsOpen}
    >
      <TaskList
        tasks={visibleTasks}
        activeView={activeView}
        selectedTaskId={selectedTaskId}
        setSelectedTaskId={setSelectedTaskId}
        createTask={createTask}
        toggleTask={toggleTask}
        searchQuery={searchQuery}
        setIsTaskDetailsOpen={setIsTaskDetailsOpen}
      />
    </DashboardLayout>
  );
}

export default DashboardPage;
