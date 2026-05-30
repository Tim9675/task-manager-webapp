import { useState } from "react";

import TaskList from "../components/tasks/TaskList";
import DashboardLayout from "../layouts/DashboardLayout";
import { mockTasks } from "../mock/tasks";
import { isToday, isUpcoming } from "../utils/date";
import TaskListSkeleton from "../components/skeletons/TaskListSkeleton";

function DashboardPage() {
  // Load state
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isLoadingTaskDetails, setIsLoadingTaskDetails] = useState(false);
  const [isLoadingSidebar, setIsLoadingSidebar] = useState(false);

  // TaskDetailsPanel
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // TaskList
  const [tasks, setTasks] = useState(mockTasks);
  const [isHideCompleted, setIsHideCompleted] = useState(false);
  const [activeView, setActiveView] = useState({
    type: "today",
  });

  // Sidebar
  const [searchQuery, setSearchQuery] = useState("");

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

  // Task to display in TaskDetailsPanel
  const selectedTask = tasks.find((task) => task.id === selectedTaskId) || null;

  function createTask(title) {
    const newTask = {
      id: crypto.randomUUID(),
      title: title,
      description: "",
      dueDate: activeView.type === "today" ? new Date() : null,
      listId: activeView.type === "list" ? activeView.id : null,
      tagIds: activeView.type === "tag" ? [activeView.id] : [],
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

  // REMINDER: Change criteria to createdAt when backend is integrated
  function compare(a, b) {
    if (a.checked === b.checked) return 0;

    return a.checked ? 1 : -1;
  }

  function renderHeader() {
    if (searchQuery) return "Search results";
    switch (activeView.type) {
      case "upcoming":
        return "Upcoming";
      case "list":
        return activeView.title;
      case "tag":
        return activeView.title;
      default:
        return "Today";
    }
  }

  const visibleTasks = searchQuery
    ? [...searchedTasks].sort(compare)
    : [...filteredTasks].sort(compare);

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
      isLoadingTaskDetails={isLoadingTaskDetails}
      isLoadingSidebar={isLoadingSidebar}
    >
      {isLoadingTasks ? (
        <TaskListSkeleton header={renderHeader()} />
      ) : (
        <TaskList
          tasks={visibleTasks}
          activeView={activeView}
          header={renderHeader()}
          selectedTaskId={selectedTaskId}
          setSelectedTaskId={setSelectedTaskId}
          createTask={createTask}
          toggleTask={toggleTask}
          searchQuery={searchQuery}
          setIsTaskDetailsOpen={setIsTaskDetailsOpen}
          isLoadingTasks={isLoadingTasks}
        />
      )}
    </DashboardLayout>
  );
}

export default DashboardPage;
