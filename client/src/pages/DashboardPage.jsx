import { useState } from "react";

import TaskList from "../components/tasks/TaskList";
import DashboardLayout from "../layouts/DashboardLayout";
import { mockTasks } from "../mock/tasks";
import { isToday, isUpcoming } from "../utils/date";

function DashboardPage() {
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [tasks, setTasks] = useState(mockTasks);
  const [activeView, setActiveView] = useState({
    type: "today",
  });
  const [searchQuery, setSearchQuery] = useState("");

  // REMINDER: To be removed when backend connected
  const filteredTasks = tasks.filter((task) => {
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

  const searchedTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const visibleTasks = searchQuery ? searchedTasks : filteredTasks;

  const selectedTask = tasks.find((task) => task.id === selectedTaskId) || null;

  function updateTask(updatedTask) {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    );
  }

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

    setTasks((prev) => [newTask, ...prev]);

    setSelectedTaskId(newTask.id);
  }

  function deleteTask(taskId) {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));

    if (selectedTaskId === taskId) {
      setSelectedTaskId(null);
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
    >
      <TaskList
        tasks={visibleTasks}
        activeView={activeView}
        setTasks={setTasks}
        selectedTaskId={selectedTaskId}
        setSelectedTaskId={setSelectedTaskId}
        createTask={createTask}
        searchQuery={searchQuery}
      />
    </DashboardLayout>
  );
}

export default DashboardPage;
