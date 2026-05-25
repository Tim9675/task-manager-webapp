import { useState } from "react";
import TaskList from "../components/tasks/TaskList";
import Sidebar from "../components/sidebar/Sidebar";
import TaskDetailsPanel from "../components/tasks/TaskDetailsPanel";

function DashboardLayout({
  children,
  selectedTask,
  updateTask,
  deleteTask,
  activeView,
  setActiveView,
}) {
  return (
    <div className="flex h-screen w-screen">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1">{children}</main>
      <TaskDetailsPanel
        selectedTask={selectedTask}
        updateTask={updateTask}
        deleteTask={deleteTask}
      />
    </div>
  );
}

export default DashboardLayout;
