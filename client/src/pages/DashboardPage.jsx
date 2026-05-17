import { useState } from "react";
import TaskList from "../components/tasks/TaskList";
import DashboardLayout from "../layouts/DashboardLayout";

import { mockTasks } from "../mock/tasks";

function DashboardPage() {
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [tasks, setTasks] = useState(mockTasks);

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
    >
      <TaskList
        tasks={tasks}
        setTasks={setTasks}
        selectedTaskId={selectedTaskId}
        setSelectedTaskId={setSelectedTaskId}
        createTask={createTask}
      />
    </DashboardLayout>
  );
}

export default DashboardPage;
