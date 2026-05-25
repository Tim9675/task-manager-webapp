import { useState } from "react";

import TaskList from "../components/tasks/TaskList";
import DashboardLayout from "../layouts/DashboardLayout";
import { mockTasks } from "../mock/tasks";
import { isToday, isUpcoming } from "../utils/date";

function DashboardPage() {
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [tasks, setTasks] = useState(mockTasks);
  const [activeView, setActiveView] = useState({
    type: "Today",
  });

  // REMINDER: To be removed when backend connected
  const filteredTasks = tasks.filter((task) => {
    switch (activeView.type) {
      case "Today":
        return isToday(task.dueDate);
      case "Upcoming":
        return isUpcoming(task.dueDate);
      case "List":
        return task.listId === activeView.id;
      case "Tag":
        return task.tagIds.includes(activeView.id);
      default:
        true;
    }
  });

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
    >
      <TaskList
        tasks={filteredTasks}
        activeView={activeView}
        setTasks={setTasks}
        selectedTaskId={selectedTaskId}
        setSelectedTaskId={setSelectedTaskId}
        createTask={createTask}
      />
    </DashboardLayout>
  );
}

export default DashboardPage;
