import { useState } from "react";
import TaskList from "../components/tasks/TaskList";
import DashboardLayout from "../layouts/DashboardLayout";

function DashboardPage() {
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [tasks, setTasks] = useState([
    {
      id: 0,
      title: "Research content ideas",
      description: "Description 1",
      dueDate: new Date(Date.now()),
      listId: 1,
      tagIds: [],
      subtasks: [],
      checked: false,
    },
    {
      id: 1,
      title: "Create a database of guest authors",
      description: "Description 2",
      dueDate: new Date(Date.now()),
      listId: 2,
      tagIds: [],
      subtasks: [],
      checked: true,
    },
    {
      id: 2,
      title: "Renew driver's license",
      description: "Description 3",
      dueDate: new Date(Date.now()),
      listId: 1,
      tagIds: [0],
      subtasks: [
        {
          id: 0,
          title: "Subtask 1",
          checked: false,
        },
      ],
      checked: false,
    },
    {
      id: 3,
      title: "Consult accountant",
      description: "Description 4",
      dueDate: new Date(Date.now()),
      listId: 2,
      tagIds: [],
      subtasks: [
        {
          id: 0,
          title: "Subtask 1",
          checked: false,
        },
        {
          id: 1,
          title: "Subtask 2",
          checked: true,
        },
        {
          id: 2,
          title: "Subtask 3",
          checked: false,
        },
      ],
      checked: true,
    },
    {
      id: 4,
      title: "Print business card",
      description: "Description 5",
      dueDate: new Date(Date.now()),
      listId: null,
      tagIds: [],
      subtasks: [],
      checked: false,
    },
  ]);

  const selectedTask = tasks.find((task) => task.id === selectedTaskId) || null;

  function updateTask(updatedTask) {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    );
  }

  return (
    <DashboardLayout selectedTask={selectedTask} updateTask={updateTask}>
      <TaskList
        tasks={tasks}
        selectedTaskId={selectedTaskId}
        setSelectedTaskId={setSelectedTaskId}
      />
    </DashboardLayout>
  );
}

export default DashboardPage;
